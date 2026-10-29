/* Karunvaya Razorpay TEST MODE verification, Cloudflare Workers.
   THIS SERVER ONLY ACCEPTS rzp_test_ KEYS; it cannot accept real donations.
   Required Worker bindings/secrets: RZP_KEY_ID, RZP_KEY_SECRET,
   RZP_TEST_ENABLED="true". Never commit or chat-share secret values.
   For a production payments system add verified legal onboarding,
   persistent transaction records, authenticated webhooks,
   refund/reconciliation workflows, and proper donation receipts.
*/
const KP_ALLOWED_CAUSES = new Set(["Education","Social welfare","Where most needed"]);
function kpJson(obj,status=200){
  return new Response(JSON.stringify(obj),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"no-referrer"}});
}
function kpEnabled(env){
  return env.RZP_TEST_ENABLED==="true" && typeof env.RZP_KEY_ID==="string" &&
    env.RZP_KEY_ID.startsWith("rzp_test_") && Boolean(env.RZP_KEY_SECRET);
}
function kpSameOrigin(request){
  const origin=request.headers.get("Origin");
  return origin!==null && origin===new URL(request.url).origin;
}
async function kpBody(request){
  if(Number(request.headers.get("content-length")||0)>4096)throw Error("Request too large");
  const text=await request.text();
  if(text.length>4096)throw Error("Request too large");
  return JSON.parse(text);
}
function kpConstantTimeHex(a,b){
  if(typeof a!=="string"||typeof b!=="string"||a.length!==b.length)return false;
  let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);
  return d===0;
}
async function kpSignature(secret,message){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const bytes=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(message)));
  return [...bytes].map(n=>n.toString(16).padStart(2,"0")).join("");
}
async function kpRazorpay(env,path,method="GET",body){
  const response=await fetch("https://api.razorpay.com/v1/"+path,{
    method,headers:{"Authorization":"Basic "+btoa(env.RZP_KEY_ID+":"+env.RZP_KEY_SECRET),
      ...(body?{"Content-Type":"application/json"}:{})},
    body:body?JSON.stringify(body):undefined,
    cache:"no-store",
    signal:AbortSignal.timeout(15000)
  });
  if(!response.ok){throw Error("Razorpay API returned "+response.status)}
  return response.json();
}
async function kpHandlePaymentApi(request,env){
  const path=new URL(request.url).pathname;
  if(path==="/api/payments/config"&&request.method==="GET"){
    return kpJson({enabled:kpEnabled(env),environment:"test",provider:"razorpay",
      message:kpEnabled(env)?"Gateway test mode configured. No real money moves.":"Gateway test account is not connected yet."});
  }
  if(path!=="/api/payments/order"&&path!=="/api/payments/verify")return kpJson({error:"Not found"},404);
  if(request.method!=="POST")return kpJson({error:"Method not allowed"},405);
  if(!kpSameOrigin(request))return kpJson({error:"Same-origin requests only"},403);
  if(!kpEnabled(env))return kpJson({error:"Razorpay test gateway is not configured"},503);
  let input;
  try{input=await kpBody(request)}catch{return kpJson({error:"Invalid request body"},400)}
  if(path==="/api/payments/order"){
    const amount=Number(input?.amount);
    const cause=input?.cause;
    if(!Number.isSafeInteger(amount)||amount<1||amount>100000||!KP_ALLOWED_CAUSES.has(cause)){
      return kpJson({error:"Choose a valid whole-rupee amount (₹1–₹1,00,000) and cause."},400);
    }
    const testReference="KVTEST-"+crypto.randomUUID().replaceAll("-","").slice(0,16).toUpperCase();
    try{
      const order=await kpRazorpay(env,"orders","POST",{
        amount:amount*100,currency:"INR",receipt:testReference,
        notes:{site:"karunvaya-test-checkout",cause}
      });
      if(!order?.id||order.amount!==amount*100||order.currency!=="INR"){
        return kpJson({error:"Gateway did not return a valid order."},502);
      }
      return kpJson({orderId:order.id,keyId:env.RZP_KEY_ID,amount:order.amount,
        currency:"INR",mode:"test"});
    }catch{return kpJson({error:"Could not create a gateway test order. Try again later."},502)}
  }
  const id=input?.razorpay_order_id,pid=input?.razorpay_payment_id,sig=input?.razorpay_signature;
  if(typeof id!=="string"||!/^order_[a-zA-Z0-9_-]{8,80}$/.test(id)||
     typeof pid!=="string"||!/^pay_[a-zA-Z0-9_-]{8,80}$/.test(pid)||
     typeof sig!=="string"||!/^[a-f0-9]{64}$/i.test(sig)){
    return kpJson({verified:false,error:"Invalid verification response."},400);
  }
  const signed=await kpSignature(env.RZP_KEY_SECRET,id+"|"+pid);
  if(!kpConstantTimeHex(signed,sig.toLowerCase()))return kpJson({verified:false,error:"Payment signature could not be verified."},403);
  try{
    const [payment,order]=await Promise.all([
      kpRazorpay(env,"payments/"+encodeURIComponent(pid)),
      kpRazorpay(env,"orders/"+encodeURIComponent(id))
    ]);
    const valid=payment.id===pid&&payment.order_id===id&&payment.status==="captured"&&
      order.id===id&&order.status==="paid"&&order.receipt?.startsWith("KVTEST-")&&
      order.notes?.site==="karunvaya-test-checkout"&&
      KP_ALLOWED_CAUSES.has(order.notes?.cause)&&
      payment.amount===order.amount&&payment.currency==="INR"&&order.currency==="INR";
    if(!valid)return kpJson({verified:false,status:"pending",message:"Gateway has not confirmed a captured/paid test transaction. No receipt issued."},202);
    return kpJson({verified:true,mode:"test",type:"test-payment-receipt",
      testPaymentSuccessful:true,realMoneyReceived:false,
      paymentId:pid,orderId:id,reference:order.receipt,
      amount:payment.amount/100,cause:order.notes.cause,
      paidAt:new Date((payment.created_at||Math.floor(Date.now()/1000))*1000).toISOString(),
      message:"Razorpay TEST transaction verified. No actual money was transferred."});
  }catch{return kpJson({verified:false,error:"Payment status could not be checked at the gateway."},502)}
}
