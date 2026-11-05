async function kvPublicOverview(request,env){
 if(request.method!=="GET"&&request.method!=="HEAD")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:{"allow":"GET, HEAD","content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
 const headers={"content-type":"application/json; charset=utf-8","cache-control":"public,max-age=30,stale-while-revalidate=60","x-content-type-options":"nosniff","referrer-policy":"no-referrer"};
 if(!env.SITE_DB)return new Response(JSON.stringify({error:"Live metrics not configured"}),{status:503,headers:{"content-type":"application/json","cache-control":"no-store"}});
 try{
  // Only aggregates; never select or return personal names, phone numbers, emails, or application content.
  const row=await env.SITE_DB.prepare("SELECT COUNT(*) AS received FROM volunteer_applications").first();
  const count=Number(row?.received);
  if(!Number.isSafeInteger(count)||count<0)throw Error("Bad count");
  const data={applicationsReceived:count,metricDefinition:"Submitted volunteer applications; not approved memberships",asOf:new Date().toISOString(),source:"live-foundation-records",programmeReports:"not-published"};
  return new Response(request.method==="HEAD"?null:JSON.stringify(data),{status:200,headers});
 }catch{return new Response(JSON.stringify({error:"Live metrics currently unavailable"}),{status:503,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}
}
