// Karunvaya Foundation: mascot for existing auth-theme-update.mjs pages.
// Apply after auth-theme-update.mjs has populated FILES.
// Add the uploaded mascot to FILES['/assets/karunvaya-auth-mascot.png']
// as binary image/png in the Worker asset bundle before deploying.
const mascotPath='/assets/karunvaya-auth-mascot.png';
const mascotMarkup='<img class="karunvaya-auth-mascot" src="'+mascotPath+'" alt="Friendly Karunvaya Foundation education mascot" loading="eager" decoding="async">';
for(const path of ['/login.html','/register.html','/account.html']){
  if(!FILES[path]) continue;
  FILES[path]=FILES[path].replace('<div class="story-bottom">',mascotMarkup+'<div class="story-bottom">');
}
FILES['/auth-theme.css'] += `
.story{isolation:isolate}
.story-content{position:relative;z-index:2;padding-bottom:220px}
.karunvaya-auth-mascot{position:absolute;right:3%;bottom:70px;width:min(49%,320px);max-height:54vh;object-fit:contain;object-position:bottom;z-index:1;pointer-events:none;filter:drop-shadow(0 18px 26px rgba(0,0,0,.18))}
@media(max-width:850px){.story-content{padding-bottom:100px;padding-right:115px}.karunvaya-auth-mascot{width:128px;max-height:185px;right:3%;bottom:6px}.story h2{font-size:clamp(26px,7vw,34px)}}
@media(max-width:420px){.story-content{padding-right:92px}.karunvaya-auth-mascot{width:100px;max-height:145px}.story h2{font-size:26px}}
`;
