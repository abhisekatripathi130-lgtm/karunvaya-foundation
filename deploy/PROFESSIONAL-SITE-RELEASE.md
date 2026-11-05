# Professional Website Live Data & UI (Cloudflare Pages)
This release adds:
- cohesive public-page typography, navigation contrast, form focus, footer and mobile styles;
- homepage trust/verification section and two foundation mission cards;
- a real-data-only public GET /api/site/overview endpoint backed by SITE_DB (D1);
- a live donation-availability indicator backed by the existing /api/payments/config;
- no public names, email, phone or personal application data;
- explicit separation of *applications received* from approved volunteer memberships;
- honest programme reporting pending instead of inventing impact metrics.

Production Pages bindings: SITE_DB -> d1701b89-7ab3-4ae6-b9f7-be64a43ef72b; BACKEND -> karunvaya-foundation Worker. Pages needs a new deployment to pick up binding changes. Original backend authentication, donor gateway and admin data must not be modified.

Not yet covered: PAN verification is not activated (provider credentials absent); online payment gateway currently not available. The existing contact page lists email addresses that have not been independently verified, so avoid claims that they receive messages until actual mailbox delivery is tested.
