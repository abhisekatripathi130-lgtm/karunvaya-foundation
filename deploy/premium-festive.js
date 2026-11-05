(()=>{
"use strict";
if(window.__kvLuxeInit)return;window.__kvLuxeInit=true;
/* Festivals for New Delhi/India; verify movable dates annually. Display changes at India-local midnight. */
const KV_FESTIVALS=[
{start:"2026-11-05",end:"2026-11-06",theme:"diwali",label:"Dhanteras & Diwali season",title1:"May light inspire.",title2:"May kindness endure.",description:"Warm wishes for Dhanteras and the festival of lights. May learning, care and possibility brighten every community.",tag:"A season of light"},
{start:"2026-11-07",end:"2026-11-10",theme:"diwali",label:"Diwali 2026 · Festival of lights",title1:"A season of light.",title2:"A future of hope.",description:"Wishing every family a joyful Diwali. A brighter tomorrow begins with education, dignity and compassion.",tag:"Diwali greetings"},
{start:"2026-11-11",end:"2026-11-12",theme:"diwali",label:"Bhai Dooj · 2026",title1:"Bonds of love.",title2:"A spirit of care.",description:"Celebrating the bonds that bring families and communities together.",tag:"Warm wishes"},
{start:"2026-11-14",end:"2026-11-14",theme:"general",label:"Children’s Day · India",title1:"Every child deserves",title2:"a world of possibility.",description:"Celebrating curiosity, learning and a brighter future for every child.",tag:"Children’s Day"},
{start:"2026-11-15",end:"2026-11-16",theme:"harvest",label:"Chhath Puja 2026",title1:"Gratitude for life.",title2:"Respect for nature.",description:"Warm Chhath Puja wishes, with hope for health, dignity and community wellbeing.",tag:"Chhath greetings"},
{start:"2026-11-23",end:"2026-11-24",theme:"sikh",label:"Guru Nanak Jayanti · 2026",title1:"Compassion unites.",title2:"Service uplifts.",description:"May the values of equality, kindness and selfless service guide our shared journey.",tag:"Gurpurab greetings"},
{start:"2027-01-14",end:"2027-01-16",theme:"harvest",label:"Makar Sankranti · Pongal · Lohri",title1:"A fresh harvest.",title2:"A shared tomorrow.",description:"Celebrating gratitude, community and the promise of new beginnings.",tag:"Harvest celebrations"},
{start:"2027-02-10",end:"2027-02-12",theme:"harvest",label:"Vasant Panchami 2027",title1:"A season of learning.",title2:"A future in bloom.",description:"Honouring the joy of knowledge, curiosity and creativity.",tag:"Vasant Panchami"},
{start:"2027-03-09",end:"2027-03-11",theme:"eid",label:"Eid al-Fitr · Expected dates",title1:"A season of sharing.",title2:"A spirit of kindness.",description:"Eid greetings to our communities. Dates are subject to local moon-sighting announcements.",tag:"Eid wishes"},
{start:"2027-03-20",end:"2027-03-23",theme:"holi",label:"Holi 2027 · Festival of colours",title1:"Many colours.",title2:"One human family.",description:"May Holi bring colour, friendship and hope to every home. Let's celebrate with care for each other.",tag:"Holi greetings"},
{start:"2027-04-13",end:"2027-04-15",theme:"harvest",label:"Baisakhi · New beginnings",title1:"New beginnings.",title2:"Shared possibilities.",description:"Celebrating the joy of community, harvest and new opportunities.",tag:"Baisakhi greetings"},
{start:"2027-05-16",end:"2027-05-18",theme:"eid",label:"Eid al-Adha · Expected dates",title1:"Giving with heart.",title2:"Living with compassion.",description:"Wishing peace and wellbeing to all. Dates are subject to local moon sighting.",tag:"Eid greetings"},
{start:"2027-08-16",end:"2027-08-18",theme:"general",label:"Raksha Bandhan 2027",title1:"Celebrate every bond.",title2:"Extend every kindness.",description:"A reminder that trust, care and support strengthen our families and communities.",tag:"Raksha Bandhan"},
{start:"2027-08-24",end:"2027-08-26",theme:"diwali",label:"Janmashtami 2027",title1:"Celebrate wisdom.",title2:"Nurture kindness.",description:"Warm wishes for Janmashtami and a joyful season of reflection.",tag:"Janmashtami"},
{start:"2027-09-03",end:"2027-09-05",theme:"harvest",label:"Ganesh Chaturthi 2027",title1:"A little wisdom.",title2:"A brighter path.",description:"Wishing everyone a joyful celebration filled with hope and new beginnings.",tag:"Ganesh Chaturthi"},
{start:"2027-09-11",end:"2027-09-13",theme:"harvest",label:"Onam 2027",title1:"Joy in togetherness.",title2:"Dignity for all.",description:"Warm Onam wishes — celebrating community, gratitude and shared prosperity.",tag:"Onam greetings"},
{start:"2027-09-30",end:"2027-10-09",theme:"diwali",label:"Navratri · Durga Puja · Dussehra",title1:"Celebrate strength.",title2:"Choose compassion.",description:"Wishing every family an uplifting festive season of courage, hope and goodness.",tag:"Festive wishes"},
{start:"2027-10-26",end:"2027-10-27",theme:"diwali",label:"Dhanteras 2027",title1:"A season of light.",title2:"A heart for giving.",description:"Warm Dhanteras wishes. May learning, good health and kindness illuminate the days ahead.",tag:"Dhanteras"},
{start:"2027-10-28",end:"2027-10-30",theme:"diwali",label:"Diwali 2027 · Festival of lights",title1:"Light the future.",title2:"With learning & care.",description:"Wishing all our communities a joyful Diwali, guided by compassion and dignity.",tag:"Diwali greetings"},
{start:"2027-10-31",end:"2027-10-31",theme:"diwali",label:"Bhai Dooj 2027",title1:"Cherish every bond.",title2:"Share every kindness.",description:"A celebration of family, connection and care.",tag:"Bhai Dooj"},
{start:"2027-11-03",end:"2027-11-04",theme:"harvest",label:"Chhath Puja 2027",title1:"Respect for nature.",title2:"Gratitude for life.",description:"Warm Chhath wishes, celebrating the sun, family and shared wellbeing.",tag:"Chhath greetings"},
{start:"2027-11-13",end:"2027-11-14",theme:"sikh",label:"Guru Nanak Jayanti 2027",title1:"Live with equality.",title2:"Serve with heart.",description:"Honouring kindness, equality and selfless service on Gurpurab.",tag:"Gurpurab greetings"}
];
const KV_FIXED=[
{start:"01-01",end:"01-02",theme:"general",label:"Happy New Year",title1:"A fresh beginning.",title2:"A kinder tomorrow.",description:"New year, renewed hope: learning, dignity and care for every community.",tag:"New Year"},
{start:"01-25",end:"01-27",theme:"national",label:"Republic Day · India",title1:"Dignity for all.",title2:"Opportunity for everyone.",description:"Celebrating our Constitution and a shared commitment to education, equality and care.",tag:"Republic Day"},
{start:"03-08",end:"03-09",theme:"general",label:"International Women's Day",title1:"More opportunities.",title2:"For every woman.",description:"Honouring the strength, dignity and contributions of women everywhere.",tag:"Women's Day"},
{start:"04-22",end:"04-22",theme:"harvest",label:"Earth Day",title1:"Care for people.",title2:"Care for our planet.",description:"Thoughtful choices today can build more resilient communities tomorrow.",tag:"Earth Day"},
{start:"08-14",end:"08-16",theme:"national",label:"Independence Day · India",title1:"Freedom to learn.",title2:"Dignity to thrive.",description:"Celebrating the values and possibilities that unite India.",tag:"Independence Day"},
{start:"09-05",end:"09-06",theme:"general",label:"Teachers' Day · India",title1:"Behind every learner.",title2:"An inspiring guide.",description:"Thanking those who open doors through teaching, patience and care.",tag:"Teachers' Day"},
{start:"10-02",end:"10-02",theme:"national",label:"Gandhi Jayanti · India",title1:"Service and dignity.",title2:"In every small act.",description:"Remembering the importance of truth, compassion and peaceful community service.",tag:"Gandhi Jayanti"},
{start:"11-14",end:"11-14",theme:"general",label:"Children's Day · India",title1:"Let curiosity bloom.",title2:"Let every child learn.",description:"Celebrating the potential of every young mind.",tag:"Children's Day"},
{start:"12-23",end:"12-26",theme:"christmas",label:"Christmas season",title1:"The joy of giving.",title2:"The warmth of care.",description:"Warm Christmas wishes to every family. May compassion bring us closer together.",tag:"Christmas"},
{start:"12-30",end:"12-31",theme:"general",label:"New Year season",title1:"Every ending brings",title2:"a new beginning.",description:"Looking ahead with gratitude, courage and a shared hope for a kinder tomorrow.",tag:"Year-end wishes"}
];

const DAY_IN_INDIA=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"});
const fixedDefault={theme:"general",label:"Karunvaya Foundation · Education & Social Welfare",title1:"Every season.",title2:"A reason to care.",description:"Little acts of learning and compassion can create extraordinary possibilities.",tag:"Learning · Compassion · Dignity"};
function inIndia(){
 const p=DAY_IN_INDIA.formatToParts(new Date()),v=Object.fromEntries(p.filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
 return v.year+"-"+v.month+"-"+v.day;
}
function pickFestival(d){
 const scheduled=KV_FESTIVALS.find(f=>d>=f.start&&d<=f.end);
 if(scheduled)return scheduled;
 const md=d.slice(5);
 return KV_FIXED.find(f=>md>=f.start&&md<=f.end)||fixedDefault;
}
function seasonUpdate(){
 const el=document.getElementById("kv-luxe-slide-1"),d=inIndia(),f=pickFestival(d);
 if(document.body.dataset.kvSeasonDate===d)return;
 document.body.dataset.kvSeasonDate=d;
 document.body.dataset.kvSeason=f.theme||"general";
 const ribbon=document.getElementById("kv-luxe-ribbon-text");
 if(ribbon)ribbon.textContent=fixedDefault===f?"Karunvaya Foundation · Learning, compassion and dignity":f.label+" · Warm wishes from Karunvaya Foundation";
 if(!el)return;
 el.dataset.season=f.theme||"general";
 const fields={"kv-festival-kicker":f.label,"kv-festival-top":f.title1,"kv-festival-bottom":f.title2,"kv-festival-description":f.description,"kv-festival-tag":f.tag};
 Object.entries(fields).forEach(([id,value])=>{const node=document.getElementById(id);if(node)node.textContent=value});
}
function carousel(){
 const track=document.getElementById("kv-luxe-track");if(!track)return;
 const slides=Array.from(track.querySelectorAll(".kv-luxe-slide"));
 const dots=Array.from(document.querySelectorAll(".kv-luxe-dot"));
 const prev=document.getElementById("kv-luxe-prev"),next=document.getElementById("kv-luxe-next"),play=document.getElementById("kv-luxe-play"),count=document.getElementById("kv-luxe-count");
 if(!slides.length)return;
 let index=0,paused=false,hover=false,focused=false;
 const media=window.matchMedia("(prefers-reduced-motion: reduce)");
 let timer=0,scrollPending=0;
 function paint(){
  if(count)count.textContent=String(index+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
  dots.forEach((d,i)=>d.setAttribute("aria-current",String(i===index)));
  if(play){play.setAttribute("aria-pressed",String(paused));play.setAttribute("aria-label",paused?"Resume automatic slide changes":"Pause automatic slide changes");play.textContent=paused?"▶":"Ⅱ"}
 }
 function show(i){
  index=(i+slides.length)%slides.length;paint();
  const x=slides[index].offsetLeft-track.offsetLeft;
  track.scrollTo({left:Math.max(0,x),behavior:media.matches?"instant":"smooth"});
 }
 function nearest(){
  let best=0,dist=Infinity;
  slides.forEach((s,i)=>{const dd=Math.abs(s.offsetLeft-track.offsetLeft-track.scrollLeft);if(dd<dist){dist=dd;best=i}});
  if(best!==index){index=best;paint()}
 }
 prev?.addEventListener("click",()=>show(index-1));
 next?.addEventListener("click",()=>show(index+1));
 dots.forEach((d,i)=>d.addEventListener("click",()=>show(i)));
 play?.addEventListener("click",()=>{paused=!paused;paint()});
 track.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();show(index+1)}if(e.key==="ArrowLeft"){e.preventDefault();show(index-1)}});
 track.addEventListener("scroll",()=>{if(scrollPending)return;scrollPending=requestAnimationFrame(()=>{scrollPending=0;nearest()})},{passive:true});
 track.addEventListener("pointerenter",()=>{hover=true});
 track.addEventListener("pointerleave",()=>{hover=false});
 const root=document.getElementById("kv-luxe-carousel");
 root?.addEventListener("focusin",()=>{focused=true});
 root?.addEventListener("focusout",()=>{focused=false});
 timer=window.setInterval(()=>{if(!paused&&!hover&&!focused&&!media.matches&&!document.hidden)show(index+1)},6900);
 window.addEventListener("pagehide",()=>window.clearInterval(timer),{once:true});
 paint();
}
function init(){
 if(/\/(admin|dashboard|account|my-volunteer-panel|login|register)(?:[/.]|$)/i.test(location.pathname))return;
 document.body.classList.add("kv-luxe-public");
 seasonUpdate();
 carousel();
 window.setInterval(seasonUpdate,300000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();