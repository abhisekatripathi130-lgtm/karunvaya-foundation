(()=>{
"use strict";if(window.__kvContactAdmin)return;window.__kvContactAdmin=true;
function init(){
 const nav=document.querySelector("#workspace aside nav");
 const workspace=document.getElementById("workspace");
 if(!nav||!workspace)return;
 const button=document.createElement("button");button.type="button";button.id="kv-contact-admin-tab";button.textContent="Contact enquiries";nav.append(button);
 const d=document.createElement("dialog");d.id="kv-contact-inbox";
 d.innerHTML='<div class="kv-inbox-header"><h2>Contact enquiries</h2><button type="button" id="kv-inbox-close">Close ×</button></div><div class="kv-inbox-body"><div class="kv-inbox-meta"><span id="kv-inbox-summary">Only authorised administrators can view messages.</span><button type="button" id="kv-inbox-refresh">Refresh enquiries</button></div><p id="kv-inbox-feedback" role="status" aria-live="polite"></p><div class="kv-inbox-list" id="kv-inbox-list"></div></div>';
 document.body.append(d);
 const list=d.querySelector("#kv-inbox-list"),feedback=d.querySelector("#kv-inbox-feedback"),summary=d.querySelector("#kv-inbox-summary");
 d.querySelector("#kv-inbox-close").addEventListener("click",()=>d.close());
 d.querySelector("#kv-inbox-refresh").addEventListener("click",load);
 button.addEventListener("click",()=>{if(workspace.hidden)return;d.showModal();load()});
 // Update a now-obsolete disclaimer in the original admin dashboard, without touching any data.
 for(const p of document.querySelectorAll("#overview p"))if(p.textContent.includes("Contact enquiries are not stored"))p.textContent="Contact enquiries submitted through the secure website form are saved in the foundation database and available through Contact enquiries. Visitor analytics are displayed only when verified.";
 const api=async(path,body)=>{
  const res=await fetch(path,{credentials:"same-origin",cache:"no-store",...(body?{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}:{})});
  let out={};try{out=await res.json()}catch{}
  if(!res.ok)throw Error(out.error||"Unable to access contact records.");
  return out;
 };
 function cell(tag,text,cls){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=String(text??"");return e}
 function renderEntry(e){
  const box=cell("article","","kv-inbox-item");
  const top=cell("div","","kv-inbox-itemtop");
  const name=cell("strong",e.name||"Unspecified");
  const time=cell("small",new Date(e.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"}));
  top.append(name,time);box.append(top);
  box.append(cell("div",e.category,"kv-inbox-topic"));
  const email=cell("a",e.email);
  email.href="mailto:"+encodeURIComponent(e.email);
  box.append(email);
  box.append(cell("p",e.message,"kv-inbox-message"));
  box.append(cell("div","Reference: "+e.reference,"kv-inbox-ref"));
  const actions=cell("div","","kv-inbox-itemtop");
  actions.style.marginTop="11px";
  actions.append(cell("span",e.status,"kv-inbox-status"));
  if(e.status!=="resolved"){
   const resolve=cell("button","Mark resolved","kv-inbox-action");resolve.type="button";
   resolve.addEventListener("click",async()=>{
    resolve.disabled=true;
    try{await api("/api/admin/enquiries/status",{reference:e.reference,status:"resolved"});feedback.textContent="Enquiry marked resolved.";await load()}
    catch(err){feedback.textContent=err.message;resolve.disabled=false}
   });
   actions.append(resolve);
  }
  box.append(actions);return box;
 }
 async function load(){
  if(!d.open)return;
  feedback.textContent="Loading saved contact enquiries…";list.replaceChildren();
  try{const out=await api("/api/admin/enquiries");summary.textContent=out.total+" saved enquiries · Latest 40";feedback.textContent=out.total===0?"No enquiries received yet.":"";
   for(const item of out.items)list.append(renderEntry(item));
  }catch(err){summary.textContent="Private owner inbox";feedback.textContent=err.message}
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();