# Karunvaya Foundation — Premium Seasonal UI
## How it works
The Cloudflare Pages production proxy serves assets \`/__kv-festive.css\` and \`/__kv-festive.js\`. The homepage receives an accessible 3-slide carousel, and public pages receive a restrained seasonal greeting ribbon. Old Diwali static greeting markup is removed so banners never double up.
The first slide and ribbon update on page load using Asia/Kolkata local date, with a 5-minute active-page refresh. Slides rotate every ~7 seconds unless paused, hovered, focused, reduced-motion preference active, or the tab is hidden. Mobile uses horizontal snap scrolling. The other two slides remain mission-focused (Education and Social Welfare). No paid donation claims, event impact claims or new payments are introduced.

## Festival dates and upkeep
The schedule of movable Hindu, Sikh, regional and Islamic festival campaigns is curated in \`deploy/premium-festive.js\` for 2026–2027. Fixed-date campaigns (Republic Day, Independence Day, Teachers' Day, Christmas, etc.) recur each year. The site returns to the neutral Foundation identity when no festival window is active.
**Dates for lunar festivals must be reviewed and extended annually**, and Islamic dates may shift depending on moon sighting. No API or app currently provides a guaranteed universal/accurate all-India lunar holiday date indefinitely. The schedule is designed to update itself at each programmed date — but future years need the schedule extended to cover every movable festival. Do not promise fully hands-free dates forever.

Sources cross-checked against Drik Panchang (New Delhi) and Time and Date:
- https://www.drikpanchang.com/panchang/month-panchang.html?year=2026
- https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2027
- https://www.timeanddate.com/holidays/india/2027

## Deployment
Change source in GitHub and redeploy Pages proxy using Cloudflare API (this repository's \`deploy/karunvaya-pages-worker.js\` is the source of the deployed Pages _worker.js). Existing payment/volunteer/admin backend service binding \`BACKEND\` is preserved.
Only the branded URL \`karunvaya-foundation.pages.dev\` has the new presentation layer; the original \`workers.dev\` hostname has not been modified.
