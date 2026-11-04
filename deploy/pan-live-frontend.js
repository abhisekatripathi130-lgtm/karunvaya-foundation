(()=>{
'use strict';
if(window.__kvLivePanInit)return;window.__kvLivePanInit=true;
const fmt=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
const LIMIT=100000;
function init(){
 const form=document.querySelector('#giving-form');
 const amountInput=document.querySelector('#custom-amount');
 const card=document.querySelector('#kv-pan-gate');
 if(!form||!amountInput||!card)return;
 amountInput.max='10000000';
 card.innerHTML='<div class="kv-pan-head"><span class="kv-pan-kicker">VERIFIED DONOR IDENTITY</span><span class="kv-pan-badge">SECURE PAN CHECK</span></div>'+
 '<h3 class="kv-pan-title" id="kv-pan-title">PAN verification for donations above ₹1,00,000</h3>'+
 '<p class="kv-pan-text">For high-value contributions, our website requests a real PAN check from an authorised verification provider. The gateway only permits approved donations.</p>'+
 '<div class="kv-pan-status" id="kv-pan-status" role="status" aria-live="polite">Checking verification availability…</div>'+
 '<div id="kv-pan-fields" hidden><p class="kv-pan-text"><strong>Selected amount: <span id="kv-pan-amount">—</span></strong></p>'+
 '<label class="kv-pan-label" for="kv-pan-name">Full name as registered with PAN</label><input id="kv-pan-name" class="kv-pan-input kv-pan-name-input" autocomplete="name" maxlength="120" required disabled>'+
 '<label class="kv-pan-label" for="kv-pan-number">PAN number</label><input id="kv-pan-number" class="kv-pan-input" autocomplete="off" maxlength="10" inputmode="text" placeholder="ABCDE1234F" required disabled>'+
 '<label class="kv-pan-consent"><input type="checkbox" id="kv-pan-consent" disabled><span>I consent to secure verification of my PAN and name through Cashfree Secure ID for this proposed donation. I understand PAN details will be sent to the authorised provider and will not be stored by this website.</span></label>'+
 '<button type="button" class="kv-pan-verify" id="kv-pan-verify" disabled>Verify PAN securely</button></div>'+
 '<p class="kv-pan-note" id="kv-pan-privacy">Real verification requires an approved live provider connection. A valid-looking PAN format is not proof of identity.</p>'+
 '<div class="kv-pan-alert" id="kv-pan-payment-note">High-value online checkout remains restricted until PAN verification and gateway approval are available.</div>';
 const status=card.querySelector('#kv-pan-status'),fields=card.querySelector('#kv-pan-fields'),selected=card.querySelector('#kv-pan-amount');
 const name=card.querySelector('#kv-pan-name'),pan=card.querySelector('#kv-pan-number'),consent=card.querySelector('#kv-pan-consent'),verify=card.querySelector('#kv-pan-verify'),note=card.querySelector('#kv-pan-payment-note');
 let ready=false,busy=false,verification=null;
 const selection=()=>{
  const custom=amountInput.value.trim();
  if(custom){const n=Number(custom);return Number.isSafeInteger(n)?n:0;}
  const choice=form.querySelector('input[name="amount"]:checked');
  return choice?Number(choice.value):0;
 };
 function reset(){
  verification=null;status.dataset.verified='false';
  verify.textContent='Verify PAN securely';
 }
 function update(){
  const amount=selection();const high=amount>LIMIT;
  fields.hidden=!high;selected.textContent=fmt.format(amount||0);
  pan.disabled=!high||!ready||busy;name.disabled=!high||!ready||busy;consent.disabled=!high||!ready||busy;
  verify.disabled=!high||!ready||busy||!!verification;
  if(!high){status.textContent='PAN verification becomes required automatically above ₹1,00,000.';note.textContent='Online payments above ₹1 lakh remain subject to verification and gateway approval.';return;}
  if(!ready){status.textContent='Live PAN verification is not activated. Do not enter PAN details; high-value payments are blocked.';note.textContent='Provider approval and production credentials are required. This is not a test or simulated check.';return;}
  if(verification){status.textContent='PAN verified by Cashfree Secure ID. Verification reference: '+verification.reference;note.textContent='Identity check passed. High-value checkout still requires payment-gateway approval and activation.';return;}
  status.textContent='Enter your registered PAN name, PAN number and consent, then press Verify PAN. Verification uses live provider records.';
  note.textContent='PAN must be verified before high-value payment; gateway approval is a separate requirement.';
 }
 // Always clear verification on change of selected amount or identity.
 for(const el of form.querySelectorAll('input[name="amount"],#custom-amount')){
  el.addEventListener('change',()=>{reset();update()});
  el.addEventListener('input',()=>{reset();queueMicrotask(update)});
 }
 for(const el of [name,pan])el.addEventListener('input',reset);
 pan.addEventListener('input',()=>{const v=pan.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);if(pan.value!==v)pan.value=v});
 verify.addEventListener('click',async()=>{
  const amount=selection();const enteredPan=pan.value.trim().toUpperCase();const enteredName=name.value.trim();
  if(!ready||busy||amount<=LIMIT)return;
  if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(enteredPan)){status.textContent='Enter a PAN in the correct format.';pan.focus();return;}
  if(enteredName.length<2||enteredName.length>120){status.textContent='Enter your complete name as registered with PAN.';name.focus();return;}
  if(!consent.checked){status.textContent='Please provide consent for real PAN verification.';consent.focus();return;}
  busy=true;verify.textContent='Verifying with Cashfree…';update();status.textContent='Contacting the authorised PAN verification provider…';
  try{
   const res=await fetch('/api/pan/verify',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({amount,pan:enteredPan,name:enteredName,consent:true})});
   const out=await res.json();
   if(!res.ok||out.verified!==true||out.mode!=='live')throw Error(out.message||'PAN could not be verified.');
   verification={reference:String(out.reference||'N/A'),token:out.token||null};
   pan.value=''; // Never retain raw PAN in the page after verification.
   name.value='';
   status.dataset.verified='true';
  }catch(e){verification=null;status.textContent=e?.message||'Verification unavailable. Payment is blocked.';}
  finally{busy=false;update();}
 });
 function takeName(){
  const actualName=form.querySelector('input[name="name"]')?.value?.trim();
  if(actualName&&!name.value)name.value=actualName;
 }
 const donorName=form.querySelector('input[name="name"]');
 donorName?.addEventListener('change',()=>{if(!verification)takeName()});
 fetch('/api/pan/config',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json()).then(data=>{
  ready=data.enabled===true&&data.mode==='live';takeName();update();
 }).catch(()=>{ready=false;update()});
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();