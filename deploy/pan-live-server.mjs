
const PAN_HIGH_VALUE_THRESHOLD=100000;
function panReply(obj,status=200){
 return new Response(JSON.stringify(obj),{status,headers:{
  'content-type':'application/json; charset=utf-8','cache-control':'no-store',
  'x-content-type-options':'nosniff','referrer-policy':'no-referrer',
  'pragma':'no-cache','content-security-policy':"default-src 'none'"
 }});
}
function panReady(env){return env.PAN_PROVIDER_MODE==='live'&&
 typeof env.CASHFREE_PAN_CLIENT_ID==='string'&&env.CASHFREE_PAN_CLIENT_ID.length>5&&
 typeof env.CASHFREE_PAN_CLIENT_SECRET==='string'&&env.CASHFREE_PAN_CLIENT_SECRET.length>8&&
 typeof env.PAN_TOKEN_SECRET==='string'&&env.PAN_TOKEN_SECRET.length>=32;}
function panNormalize(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');}
function panOriginOK(request){return request.headers.get('origin')===new URL(request.url).origin;}
function panB64(bytes){const b=String.fromCharCode(...bytes);return btoa(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');}
function panUnb64(t){const b=atob(String(t).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0));}
async function panSign(body,secret){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return panB64(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body))))}
async function panToken(value,secret){const data=panB64(new TextEncoder().encode(JSON.stringify(value)));return data+'.'+await panSign(data,secret)}
async function panCheckToken(token,amount,name,secret){
 try{
  const [encoded,sig,extra]=String(token||'').split('.');
  if(!encoded||!sig||extra||encoded.length>2048)return false;
  const expected=await panSign(encoded,secret);
  if(sig.length!==expected.length)return false;
  let diff=0;for(let i=0;i<sig.length;i++)diff|=sig.charCodeAt(i)^expected.charCodeAt(i);
  if(diff!==0)return false;
  const data=JSON.parse(new TextDecoder().decode(panUnb64(encoded)));
  return data.v===1&&data.provider==='cashfree-live'&&data.amount===amount&&
   data.name===panNormalize(name)&&Number.isFinite(data.expires)&&data.expires>Date.now()&&data.expires<Date.now()+900000;
 }catch{return false}
}
async function panAuthorizeUser(request,env){
 const uri=new URL('/api/auth/me',request.url);
 const resp=await env.BACKEND.fetch(new Request(uri.href,{method:'GET',headers:{cookie:request.headers.get('cookie')||''}}));
 return resp.ok;
}
async function panApi(request,env){
 const u=new URL(request.url);
 if(u.pathname==='/api/pan/config'){
  if(request.method!=='GET')return panReply({message:'Method not allowed'},405);
  return panReply({enabled:panReady(env),mode:panReady(env)?'live':'unavailable',provider:'cashfree-secure-id',threshold:PAN_HIGH_VALUE_THRESHOLD,
   message:panReady(env)?'Live PAN verification provider is configured. Login is required for high-value verification.':'PAN verification is unavailable until provider approval and production secrets are configured.'});
 }
 if(u.pathname!=='/api/pan/verify'||request.method!=='POST')return panReply({message:'Not found'},404);
 if(!panReady(env))return panReply({verified:false,message:'Official PAN verification is not yet active. No PAN was checked; high-value payments remain blocked.'},503);
 if(!panOriginOK(request))return panReply({verified:false,message:'Invalid origin'},403);
 if(!String(request.headers.get('content-type')||'').toLowerCase().includes('application/json'))return panReply({verified:false,message:'JSON required'},415);
 if((Number(request.headers.get('content-length'))||0)>2300)return panReply({verified:false,message:'Request too large'},413);
 let raw=await request.text();if(raw.length>2300)return panReply({verified:false,message:'Request too large'},413);
 let input;try{input=JSON.parse(raw)}catch{return panReply({verified:false,message:'Invalid request'},400)}
 const amount=Number(input.amount),pan=String(input.pan||'').toUpperCase().trim(),name=String(input.name||'').trim();
 if(!Number.isSafeInteger(amount)||amount<=PAN_HIGH_VALUE_THRESHOLD||amount>10000000)return panReply({verified:false,message:'Select a high-value amount above ₹1,00,000.'},400);
 if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)||!name||name.length>120||input.consent!==true)return panReply({verified:false,message:'Valid PAN, registered name and express consent are required.'},400);
 try{if(!await panAuthorizeUser(request,env))return panReply({verified:false,message:'Please log in before PAN verification.'},401)}
 catch{return panReply({verified:false,message:'Account verification is unavailable.'},503)}
 // LIVE ONLY: no sandbox fallback or local format-only success. PAN is never logged or persisted here.
 let res;try{
  res=await fetch('https://api.cashfree.com/verification/pan',{method:'POST',
   headers:{'content-type':'application/json','x-client-id':env.CASHFREE_PAN_CLIENT_ID,'x-client-secret':env.CASHFREE_PAN_CLIENT_SECRET,'x-api-version':'2022-09-13'},
   body:JSON.stringify({pan,name}),cache:'no-store',signal:AbortSignal.timeout(10000)
  });
 }catch{return panReply({verified:false,message:'Live PAN verification service could not be reached. Payment blocked.'},502)}
 if(!res.ok)return panReply({verified:false,message:'PAN verification provider declined the request or is not enabled for this account.'},502);
 let v;try{v=await res.json()}catch{return panReply({verified:false,message:'Provider response was unreadable. Payment blocked.'},502)}
 const nameMatch=String(v.name_match_result||'').toUpperCase();
 const normalizedEqual=panNormalize(v.registered_name)===panNormalize(name);
 const acceptedName=nameMatch==='DIRECT_MATCH'||(normalizedEqual&&String(v.registered_name||'').length>2);
 const verified=v.valid===true&&v.pan_status==='VALID'&&v.pan===pan&&acceptedName&&
  (typeof v.reference_id==='string'||typeof v.reference_id==='number');
 if(!verified)return panReply({verified:false,message:'PAN was not verified with a matching registered name and active status. Payment blocked.'},422);
 const token=await panToken({v:1,provider:'cashfree-live',amount,name:panNormalize(name),reference:String(v.reference_id),expires:Date.now()+10*60*1000},env.PAN_TOKEN_SECRET);
 return panReply({verified:true,mode:'live',reference:String(v.reference_id),token,message:'PAN verified by the live provider. Payment approval is separate.'});
}
async function panOrderGate(request,env){
 if(request.method!=='POST')return env.BACKEND.fetch(request);
 if(!panReady(env))return env.BACKEND.fetch(request); // Existing backend enforces the original ₹1 lakh cap.
 if(!panOriginOK(request))return panReply({error:'Invalid origin'},403);
 let original;try{original=await request.clone().json()}catch{return panReply({error:'Invalid payment request'},400)}
 const amount=Number(original.amount);
 if(!Number.isSafeInteger(amount)||amount<=PAN_HIGH_VALUE_THRESHOLD)return env.BACKEND.fetch(request);
 const donorName=original.donor?.name;
 if(!await panCheckToken(original.panVerificationToken,amount,donorName,env.PAN_TOKEN_SECRET))return panReply({error:'A live verified PAN token bound to this amount and name is required before checkout.'},403);
 if(env.HIGH_VALUE_CHECKOUT_ENABLED!=='true')return panReply({error:'PAN verified, but high-value donations are not enabled until payment-gateway onboarding and approval.'},503);
 return env.BACKEND.fetch(request); // Backend must separately approve >₹1L; never bypass its limit.
}
