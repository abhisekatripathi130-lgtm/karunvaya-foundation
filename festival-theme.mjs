// The calendar is evaluated in India Standard Time on every HTML request.
// Movable holidays use dated entries. Confirm moon-sighting dates locally.
const annual = {
  '01-01': ['New Year', 'gold'],
  '01-26': ['Republic Day', 'tricolor'],
  '08-15': ['Independence Day', 'tricolor'],
  '10-02': ['Gandhi Jayanti', 'green'],
  '12-25': ['Christmas', 'green', 'Merry Christmas'],
};
const dates = {
  '2026-11-04': ['Diwali season', 'gold', 'The festival of lights is around the corner'],
  '2026-11-05': ['Diwali season', 'gold', 'The festival of lights is around the corner'],
  '2026-11-06': ['Dhanteras', 'gold'],
  '2026-11-07': ['Diwali season', 'gold', 'The festival of lights is around the corner'],
  '2026-11-08': ['Diwali', 'lights'],
  '2026-11-09': ['Diwali', 'lights'],
  '2026-11-10': ['Govardhan Puja', 'green'],
  '2026-11-11': ['Bhai Dooj', 'rose'],
  '2026-11-15': ['Chhath Puja', 'gold'],
  '2026-11-24': ['Guru Nanak Jayanti', 'gold'],
  '2027-01-14': ['Lohri', 'lights'],
  '2027-01-15': ['Pongal, Makar Sankranti & Magh Bihu', 'green'],
  '2027-02-11': ['Vasant Panchami', 'gold'],
  '2027-03-06': ['Maha Shivaratri', 'rose'],
  '2027-03-10': ['Eid al-Fitr', 'green', 'Eid Mubarak'],
  '2027-03-21': ['Holika Dahan', 'lights'],
  '2027-03-22': ['Holi', 'color'],
  '2027-03-26': ['Good Friday', 'rose', 'Wishing you a peaceful Good Friday'],
  '2027-03-28': ['Easter', 'green'],
  '2027-04-07': ['Ugadi, Gudi Padwa & Cheti Chand', 'green'],
  '2027-04-14': ['Vaisakhi & Vishu', 'gold'],
  '2027-04-15': ['Bohag Bihu & Ram Navami', 'rose'],
  '2027-04-19': ['Mahavir Jayanti', 'green'],
  '2027-05-17': ['Eid al-Adha', 'green', 'Eid Mubarak'],
  '2027-05-20': ['Buddha Purnima', 'gold'],
  '2027-06-16': ['Muharram', 'rose', 'Wishing you a peaceful Muharram'],
  '2027-07-05': ['Rath Yatra', 'gold'],
  '2027-08-15': ['Independence Day, Milad un-Nabi & Parsi New Year', 'tricolor', 'Warm wishes from Karunvaya Foundation'],
  '2027-08-17': ['Raksha Bandhan', 'rose'],
  '2027-08-25': ['Janmashtami', 'rose'],
  '2027-09-04': ['Ganesh Chaturthi', 'gold'],
  '2027-09-12': ['Onam', 'green'],
  '2027-09-30': ['Navratri', 'rose'],
  '2027-10-05': ['Durga Puja', 'rose'],
  '2027-10-06': ['Durga Puja', 'rose'],
  '2027-10-07': ['Durga Puja', 'rose'],
  '2027-10-08': ['Durga Puja', 'rose'],
  '2027-10-09': ['Dussehra', 'gold'],
  '2027-10-18': ['Karwa Chauth', 'rose'],
  '2027-10-27': ['Dhanteras', 'gold'],
  '2027-10-28': ['Choti Diwali', 'lights'],
  '2027-10-29': ['Diwali', 'lights'],
  '2027-10-30': ['Govardhan Puja', 'green'],
  '2027-10-31': ['Bhai Dooj', 'rose'],
  '2027-11-04': ['Chhath Puja', 'gold'],
  '2027-11-14': ['Guru Nanak Jayanti', 'gold'],
};
const themes = {
  gold: ['#17203d', '#674017', '#ffdc91', '✦'],
  lights: ['#171438', '#67242e', '#ffdc91', '🪔'],
  color: ['#43206b', '#82164c', '#ffe0a1', '✿'],
  green: ['#07382e', '#18533a', '#ffe4a4', '❋'],
  rose: ['#342049', '#702243', '#ffdfab', '✺'],
  tricolor: ['#522c13', '#12463a', '#ffdda0', '✦'],
};
const indiaDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Kolkata' });

export function applyFestivalTheme(html, now = new Date()) {
  const date = indiaDate.format(now);
  const event = dates[date] || annual[date.slice(5)];
  if (!event || !/<body\b[^>]*>/i.test(html)) return html;
  const [name, theme, greeting = 'Happy ' + name] = event;
  const [dark, bright, accent, motif] = themes[theme];
  const diwali = /diwali|dhanteras/i.test(name);
  const style = `<style id="krf-festival-style">
    .krf-festival{box-sizing:border-box;width:100%;grid-column:1/-1;flex:0 0 100%;min-width:0;position:relative;isolation:isolate;overflow:hidden;text-align:center;padding:clamp(.7rem,2vw,1.15rem) 1rem;color:#fffaf1;background:radial-gradient(ellipse at 12% 0%,${bright},transparent 56%),linear-gradient(110deg,${dark},${bright},${dark});border-bottom:2px solid ${accent};font-family:system-ui,sans-serif;line-height:1.3}
    .krf-festival::before{content:"";position:absolute;inset:0;z-index:-1;opacity:.32;background:radial-gradient(circle,${accent} 1px,transparent 2px) 0 0/29px 23px;pointer-events:none}
    .krf-festival-label{display:block;color:${accent};font-size:.68rem;letter-spacing:.13em;text-transform:uppercase;font-weight:750}
    .krf-festival-message{display:flex;align-items:center;justify-content:center;gap:.65rem;margin-top:.2rem;font-size:clamp(.95rem,2.5vw,1.35rem);font-weight:750;overflow-wrap:anywhere}
    .krf-festival-motif{color:${accent};flex:none}
    body:has(>.krf-festival) .story{box-shadow:inset 0 4px 0 ${accent}}
    ${diwali ? `
    body{background-color:#fffaf0}
    .krf-festival{padding:30px 150px 26px;background:radial-gradient(ellipse at 50% 130%,#a55920 0,transparent 65%),linear-gradient(110deg,#111c36,#342039,#111c36);border-bottom:3px solid #e4b65e}
    .krf-festival-label{font-size:11px;letter-spacing:.22em}
    .krf-festival-message{font-family:Georgia,serif;font-size:clamp(24px,3.5vw,42px);font-weight:400;margin-top:9px}
    .krf-festival-sub{display:block;font-size:13px;line-height:1.6;color:#ffe9be;margin-top:8px}
    .krf-diya{position:absolute;bottom:12px;width:115px;height:110px;left:5%;pointer-events:none}
    .krf-diya.right{left:auto;right:5%;transform:scaleX(-1)}
    .krf-festival::after{content:"";position:absolute;top:0;left:0;right:0;height:15px;background:radial-gradient(ellipse at center top,#ffe9a8 0 3px,transparent 5px) 0 0/38px 16px;filter:drop-shadow(0 2px 5px #ffc754);pointer-events:none}
    body:has(.krf-diya) header{background:#fffcf5;border-bottom:1px solid #dfbf79}
    body:has(.krf-diya) .hero{background:radial-gradient(ellipse at 94% 10%,#ffe3a966,transparent 50%),linear-gradient(120deg,#fffdf8,#fff7e8)}
    body:has(.krf-diya) .story{background:radial-gradient(ellipse at bottom,#784020,#142440 70%);box-shadow:inset 0 4px #e5b65f}
    body:has(.krf-diya) footer{border-top:3px solid #d8ac52}
    @media(max-width:600px){.krf-festival{padding:26px 48px 22px}.krf-diya{width:45px;height:65px;left:1%;bottom:10px}.krf-diya.right{right:1%}.krf-festival-sub{font-size:11px}.krf-festival-message{gap:5px}.krf-festival-motif{display:none}}
    ` : ''}
    @media print{.krf-festival{display:none}}
  </style>`;
  const icon = `<span class="krf-festival-motif" aria-hidden="true">${motif}</span>`;
  const diya = '<svg class="krf-diya" viewBox="0 0 120 110" aria-hidden="true"><ellipse cx="60" cy="94" rx="49" ry="8" fill="#ffbd4c" opacity=".15"/><path d="M12 64 Q60 111 108 64Z" fill="#d78b30" stroke="#ffda85" stroke-width="2"/><ellipse cx="60" cy="64" rx="48" ry="9" fill="#81341f" stroke="#e6b965" stroke-width="2"/><path d="M60 61 C26 43 60 13 62 4 C61 31 88 39 60 61" fill="#ffc95b"/><path d="M60 59 Q46 48 61 30 Q73 48 60 59" fill="#fff3bb"/><path d="M30 76 Q60 93 90 76" fill="none" stroke="#ffe1a2" stroke-width="2"/></svg>';
  const decoration = diwali ? diya + diya.replace('krf-diya"', 'krf-diya right"') : '';
  const title = diwali ? (name === 'Dhanteras' ? 'Shubh Dhanteras' : 'Celebrate the light of Diwali') : greeting;
  const subtitle = diwali ? '<span class="krf-festival-sub">May every home shine with hope, learning and kindness.<br>Warm wishes from Karunvaya Foundation</span>' : '';
  const banner = `<aside class="krf-festival" aria-label="Festival greeting"><span class="krf-festival-label">${name.replace(/&/g, '&amp;')}</span><strong class="krf-festival-message">${icon}<span>${title.replace(/&/g, '&amp;')}</span>${icon}</strong>${subtitle}${decoration}</aside>`;
  return html.replace(/<\/head>/i, style + '</head>')
    .replace(/<body\b[^>]*>(\s*<a\b[^>]*class=["']skip["'][^>]*>[^<]*<\/a>)?/i, opening => opening + banner);
}
