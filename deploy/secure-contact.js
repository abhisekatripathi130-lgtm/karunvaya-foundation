(()=>{
"use strict";if(window.__kvContactForm)return;window.__kvContactForm=true;
function init(){const form=document.getElementById("kv-contact-form");if(!form)return;
const status=document.getElementById("kv-contact-message"),btn=document.getElementById("kv-contact-submit");
let busy=false;
form.addEventListener("submit",async e=>{
 e.preventDefault();if(busy||!form.reportValidity())return;
 busy=true;btn.disabled=true;status.dataset.error="false";status.textContent="Saving your enquiry securely…";
 const input=Object.fromEntries(new FormData(form));
 input.consent=form.elements.consent.checked===true;
 try{
  const r=await fetch("/api/site/contact",{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok||data.saved!==true)throw Error(data.error||"We could not save your enquiry. Please try again.");
  status.textContent="Enquiry saved successfully. Reference: "+data.reference+". Please keep this number for your records. No email has been sent.";
  status.dataset.error="false";
  form.reset();
 }catch(err){status.dataset.error="true";status.textContent=err.message||"Enquiry could not be saved."}
 finally{busy=false;btn.disabled=false}
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();