/* Donation planner and browser-only TEST receipt. No real payments, data collection, or success claims. */
(()=>{"use strict";
 const radios=[...document.querySelectorAll('input[name="amount"]')];
 const custom=document.getElementById('don-custom-amount');
 const amtOut=document.getElementById('don-summary-amount');
 const causeOut=document.getElementById('don-summary-cause');
 const previewAmt=document.getElementById('kv-demo-amount');
 const previewCause=document.getElementById('kv-demo-cause');
 const form=document.getElementById('kv-demo-form');
 const output=document.getElementById('kv-receipt-area');
 const msg=document.getElementById('kv-demo-message');
 const fmt=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
 if(!custom||!amtOut||!causeOut||!form||!output)return;
 function amount(){const s=custom.value.trim();if(s!==""){const n=Number(s);return Number.isSafeInteger(n)&&n>=1&&n<=10000000?n:null}const selected=document.querySelector('input[name="amount"]:checked');const n=Number(selected?.value);return Number.isSafeInteger(n)&&n>=1&&n<=10000000?n:null}
 function cause(){return document.querySelector('input[name="cause"]:checked')?.value||'Where most needed'}
 function invalidate(){output.hidden=true;msg.textContent=''}
 function update(){const a=amount();const readable=a?fmt.format(a):'Enter valid amount';amtOut.textContent=readable;previewAmt.textContent=readable;causeOut.textContent=cause();previewCause.textContent=cause()}
 radios.forEach(r=>r.addEventListener('change',()=>{if(!r.checked)return;custom.value='';invalidate();update()}));
 custom.addEventListener('input',()=>{radios.forEach(r=>r.checked=false);invalidate();update()});
 document.querySelectorAll('input[name="cause"]').forEach(r=>r.addEventListener('change',()=>{invalidate();update()}));
 document.getElementById('kv-demo-name')?.addEventListener('input',invalidate);
 document.getElementById('kv-demo-reference')?.addEventListener('input',invalidate);
 form.addEventListener('submit',e=>{e.preventDefault();invalidate();const a=amount();if(a===null){msg.textContent='Choose a valid amount (₹1 to ₹1,00,00,000).';custom.focus();return}if(!form.reportValidity())return;const name=document.getElementById('kv-demo-name').value.trim();if(name.length<2){msg.textContent='Enter a sample name with at least two characters.';return}
  const note=document.getElementById('kv-demo-reference').value.trim();
  const now=new Date();
  const date=now.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'});
  const random=typeof crypto!=='undefined'&&crypto.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0,6):Math.floor(Math.random()*999999).toString().padStart(6,'0');
  const fields={'kv-invoice-ref':`DEMO-KV-${now.getFullYear()}-${random}`,'kv-invoice-date':date,'kv-invoice-donor':name,'kv-invoice-note':note||'No sample note','kv-invoice-line':cause()+' — sample contribution','kv-invoice-price':fmt.format(a),'kv-invoice-total':fmt.format(a)};
  Object.entries(fields).forEach(([id,value])=>{document.getElementById(id).textContent=value});
  output.hidden=false;msg.textContent='Test completed: ₹0 charged. SAMPLE receipt generated below.';output.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 });
 document.getElementById('kv-print-receipt')?.addEventListener('click',()=>{if(!output.hidden)window.print()});
 update();
})();