(()=>{
"use strict";
if(window.__kvPanPrecheckV1)return;
window.__kvPanPrecheckV1=true;
const limit=100000;
const fmt=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
function boot(){
 if(!/(?:^|\/)(?:donate|donation|donations|support)(?:\.html)?\/?$/i.test(location.pathname))return;
 const amt=document.querySelector("#don-custom-amount");
 const planner=document.querySelector(".donate-planner,#donation-planner,.donation-planner");
 if(!amt||!planner)return;
 if(document.getElementById("kv-pan-gate"))return;
 const panel=document.createElement("section");
 panel.className="kv-pan-gate";
 panel.id="kv-pan-gate";
 panel.hidden=true;
 panel.setAttribute("aria-labelledby","kv-pan-title");
 panel.innerHTML='<div class="kv-pan-head"><span class="kv-pan-overline">HIGH-VALUE CONTRIBUTIONS · INR</span><span class="kv-pan-badge">PAN CHECK REQUIRED</span></div>'+
 '<h3 class="kv-pan-title" id="kv-pan-title">PAN verification required above ₹1,00,000</h3>'+
 '<p class="kv-pan-text">For a planned contribution above ₹1 lakh, identity verification must be completed through an authorised service before any real payment can be enabled.</p>'+
 '<label class="kv-pan-label" for="kv-pan-preview">PAN format pre-check (preview only)</label>'+
 '<input class="kv-pan-input" id="kv-pan-preview" type="text" placeholder="ABCDE1234F" maxlength="10" inputmode="text" spellcheck="false" autocomplete="off" aria-describedby="kv-pan-result kv-pan-privacy">'+
 '<div class="kv-pan-result" id="kv-pan-result" role="status" aria-live="polite">Format preview only — not identity verification.</div>'+
 '<p class="kv-pan-note" id="kv-pan-privacy"><strong>Do not enter your real PAN in this preview.</strong> This local format example is not transmitted, stored or verified against Income Tax records.</p>'+
 '<div class="kv-pan-separator"></div>'+
 '<div class="kv-pan-stop" role="note"><strong>Checkout unavailable above ₹1,00,000.</strong> The current gateway is TEST only and caps orders at ₹1 lakh. Live high-value payments remain disabled until legal onboarding and an authorised PAN verification service are connected.</div>';
 const field=amt.closest(".don-custom-wrap");
 if(field&&field.parentElement)field.insertAdjacentElement("afterend",panel);
 else planner.append(panel);
 const hint=document.createElement("small");
 hint.className="kv-pan-inline-hint";
 hint.textContent="Above ₹1,00,000: PAN verification required before a real donation can proceed.";
 if(field)field.append(hint);
 const input=panel.querySelector("#kv-pan-preview");
 const status=panel.querySelector("#kv-pan-result");
 function getAmount(){
   const custom=amt.value.trim();
   if(custom!==""){
    const n=Number(custom);
    return Number.isSafeInteger(n)&&n>0?n:null;
   }
   const selected=document.querySelector('input[name="amount"]:checked');
   return selected?Number(selected.value):null;
 }
 function update(){
  const amount=getAmount();
  const high=amount!==null&&amount>limit;
  panel.hidden=!high;
  if(!high){input.value="";status.textContent="Format preview only — not identity verification."}
 }
 input.addEventListener("input",()=>{
  let v=input.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,10);
  input.value=v;
  const valid=/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
  status.textContent=!v?"Format preview only — not identity verification.":(valid?"PAN pattern matches the format. Identity is NOT verified; payment remains disabled.":"Incomplete/invalid PAN format (5 letters, 4 digits, 1 letter).");
 });
 amt.addEventListener("input",update);
 amt.addEventListener("change",update);
 for(const option of document.querySelectorAll('input[name="amount"]'))option.addEventListener("change",update);
 update();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
