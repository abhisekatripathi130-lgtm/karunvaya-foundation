(()=>{"use strict";if(window.__kvPanAlwaysV2)return;window.__kvPanAlwaysV2=true;
function boot(){
const form=document.querySelector("#giving-form,.donate-planner,#donation-planner");
if(!form)return;
const amount=document.querySelector("#custom-amount,#don-custom-amount");
const panel=document.getElementById("kv-pan-gate");
if(!panel)return;
const status=panel.querySelector("#kv-pan-status");
const fmt=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
function update(){
let n=null;
if(amount&&amount.value.trim()!==""){n=Number(amount.value);}
else {const checked=document.querySelector('input[name="amount"]:checked');if(checked)n=Number(checked.value);}
const high=Number.isFinite(n)&&n>100000;
if(status)status.textContent=high?("Selected amount: "+fmt.format(n)+". PAN verification is required; checkout is unavailable until authorised verification is connected."):"Current checkout limit: ₹1 to ₹1,00,000. PAN verification is required for amounts above ₹1,00,000.";
panel.classList.toggle("kv-pan-high-value",high);
}
document.querySelectorAll('#custom-amount,#don-custom-amount,input[name="amount"]').forEach(el=>{el.addEventListener("input",update);el.addEventListener("change",update)});
update();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();