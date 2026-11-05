(()=>{
"use strict";
if(window.__kvProfessionalInit)return;window.__kvProfessionalInit=true;
const publicPath=!/^\/(?:admin|dashboard|account|my-volunteer-panel|login|register|receipt|api)(?:[/.]|$)/i.test(location.pathname);
if(!publicPath)return;
function init(){
document.body.classList.add("kv-professional-public");
const main=document.getElementById("main")||document.querySelector("main");
if(!main)return;
const link=Array.from(document.querySelectorAll("header .header-cta")).find(x=>/donate now|support us/i.test(x.textContent||""));
if(link){link.textContent="Support our mission";link.setAttribute("aria-label","Explore ways to support Karunvaya Foundation");}
const app=document.getElementById("kv-pro-applications");
const payment=document.getElementById("kv-pro-payments");
const timestamp=document.getElementById("kv-pro-timestamp");
let loading=false;
async function sync(){
 if(loading)return;loading=true;
 try{
  const [stats,gateway]=await Promise.allSettled([
   fetch("/api/site/overview",{credentials:"same-origin",cache:"no-store",headers:{"Accept":"application/json"}}).then(async r=>{if(!r.ok)throw Error("metrics offline");return r.json()}),
   fetch("/api/payments/config",{credentials:"same-origin",cache:"no-store",headers:{"Accept":"application/json"}}).then(async r=>{if(!r.ok)throw Error("gateway offline");return r.json()})
  ]);
  if(app){app.textContent=stats.status==="fulfilled"&&Number.isSafeInteger(stats.value.applicationsReceived)?String(stats.value.applicationsReceived):"Unavailable";}
  if(payment){const status=gateway.status==="fulfilled"?gateway.value:null;
   payment.textContent=status?.enabled===true&&status?.environment==="live"?"Available":status?.enabled===false?"Not currently available":"Status unavailable";
  }
  if(timestamp){timestamp.textContent=stats.status==="fulfilled"?"Application figures updated "+new Date(stats.value.asOf).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"})+" · No personal data displayed":"Live figures temporarily unavailable. Please check again.";}
 }catch{if(timestamp)timestamp.textContent="Live status temporarily unavailable."}
 finally{loading=false}
}
sync();
const ticker=setInterval(()=>{if(!document.hidden)sync()},60000);
window.addEventListener("pagehide",()=>clearInterval(ticker),{once:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();