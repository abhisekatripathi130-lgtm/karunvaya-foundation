// Secure website enquiry storage + private admin-only inbox.
// No email deliveries are claimed or sent.
const KV_CONTACT_TOPICS=new Set(["General enquiry","Volunteer coordination","Education programmes","Social welfare programmes","Feedback or concern"]);
function kvContactJson(value,status=200){
 return new Response(JSON.stringify(value),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"no-referrer","permissions-policy":"interest-cohort=()"}});
}
function kvContactOrigin(request){return request.headers.get("origin")===new URL(request.url).origin;}
async function kvContactReadBody(request){
 const length=Number(request.headers.get("content-length")||0);if(length>6500)throw Error("Request too large");
 const txt=await request.text();if(txt.length>6500)throw Error("Request too large");
 return JSON.parse(txt);
}
async function kvContactAuth(request,env){
 if(!env.BACKEND)return false;
 const test=new URL("/api/admin/summary",request.url);
 const headers=new Headers();headers.set("cookie",request.headers.get("cookie")||"");
 const r=await env.BACKEND.fetch(new Request(test.toString(),{method:"GET",headers}));
 return r.status===200;
}
async function kvContactAPI(request,env){
 const u=new URL(request.url);
 if(!env.SITE_DB)return kvContactJson({error:"Contact message service is not available."},503);
 if(u.pathname==="/api/site/contact"){
  if(request.method!=="POST")return kvContactJson({error:"Method not allowed"},405);
  if(!kvContactOrigin(request))return kvContactJson({error:"Invalid origin"},403);
  if(!String(request.headers.get("content-type")||"").toLowerCase().includes("application/json"))return kvContactJson({error:"Use JSON content type"},415);
  let body;try{body=await kvContactReadBody(request)}catch{return kvContactJson({error:"Invalid contact form"},400)}
  if(typeof body.website==="string"&&body.website.length>0)return kvContactJson({error:"Unable to process this submission."},400);
  const name=String(body.name||"").trim().replace(/\s+/g," ");
  const email=String(body.email||"").trim().toLowerCase();
  const category=String(body.category||"").trim();
  const message=String(body.message||"").trim();
  if(name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>160||!KV_CONTACT_TOPICS.has(category)||message.length<15||message.length>2500||body.consent!==true)
   return kvContactJson({error:"Please provide your name, valid email, subject, message and consent."},400);
  const now=Date.now();
  try{
   const count=await env.SITE_DB.prepare("SELECT COUNT(*) as n FROM foundation_enquiries WHERE email=? AND created_epoch>?").bind(email,now-86400000).first();
   if(Number(count?.n||0)>=4)return kvContactJson({error:"Too many enquiries from this email in one day. Please try again later."},429);
   const total=await env.SITE_DB.prepare("SELECT COUNT(*) as n FROM foundation_enquiries WHERE created_epoch>?").bind(now-3600000).first();
   if(Number(total?.n||0)>=100)return kvContactJson({error:"Contact intake is busy. Please try again later."},429);
   const reference="KVC-"+new Date(now).getUTCFullYear()+"-"+crypto.randomUUID().replaceAll("-","").slice(0,10).toUpperCase();
   await env.SITE_DB.prepare("INSERT INTO foundation_enquiries (id,created_epoch,created_at,name,email,category,message,consent,status) VALUES (?,?,?,?,?,?,?,?,?)").bind(reference,now,new Date(now).toISOString(),name,email,category,message,1,"new").run();
   return kvContactJson({saved:true,reference,message:"Your enquiry is saved in the Foundation's private database. No email was sent."},201);
  }catch{return kvContactJson({error:"Unable to save your enquiry at this time. Please try again."},503)}
 }
 if(!u.pathname.startsWith("/api/admin/enquiries"))return kvContactJson({error:"Not found"},404);
 let allowed=false;try{allowed=await kvContactAuth(request,env)}catch{return kvContactJson({error:"Admin authentication temporarily unavailable."},503)}
 if(!allowed)return kvContactJson({error:"Admin sign-in required."},401);
 if(u.pathname==="/api/admin/enquiries"&&request.method==="GET"){
  try{
   const [rows,count]=await Promise.all([
    env.SITE_DB.prepare("SELECT id,created_at,name,email,category,message,status FROM foundation_enquiries ORDER BY created_epoch DESC LIMIT 40").all(),
    env.SITE_DB.prepare("SELECT COUNT(*) AS n FROM foundation_enquiries").first()
   ]);
   const items=(rows.results||[]).map(x=>({reference:x.id,createdAt:x.created_at,name:x.name,email:x.email,category:x.category,message:x.message,status:x.status}));
   return kvContactJson({total:Number(count?.n||0),items});
  }catch{return kvContactJson({error:"Admin inbox temporarily unavailable."},503)}
 }
 if(u.pathname==="/api/admin/enquiries/status"&&request.method==="POST"){
  if(!kvContactOrigin(request))return kvContactJson({error:"Invalid origin"},403);
  let data;try{data=await kvContactReadBody(request)}catch{return kvContactJson({error:"Invalid status request"},400)}
  const reference=String(data.reference||"");
  if(!/^KVC-\d{4}-[A-Z0-9]{10}$/.test(reference)||!["reviewed","resolved"].includes(data.status))return kvContactJson({error:"Invalid reference or status"},400);
  try{const outcome=await env.SITE_DB.prepare("UPDATE foundation_enquiries SET status=? WHERE id=?").bind(data.status,reference).run();
   if(Number(outcome.meta?.changes||0)<1)return kvContactJson({error:"Enquiry not found"},404);
   return kvContactJson({saved:true,reference,status:data.status});
  }catch{return kvContactJson({error:"Could not update the enquiry status"},503)}
 }
 return kvContactJson({error:"Method not allowed"},405);
}
