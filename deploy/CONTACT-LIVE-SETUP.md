# Karunvaya Foundation — secure contact + owner inbox
- Real submission: POST /api/site/contact validates Origin, JSON size, consent, field lengths and honeypot. Stored in Cloudflare SITE_DB, a D1 database, with a unique reference number. **No email is sent** and the UI says so.
- Admin-only inbox: GET /api/admin/enquiries and POST /api/admin/enquiries/status first validate the existing session via the original backend's GET /api/admin/summary. Fail closed (401/503) on invalid or unavailable admin auth. No public PII endpoint.
- Client renders enquiries with textContent only; no untrusted HTML. Own passwords, PAN, or payment details must never be entered in the general contact form.
- Limits: 4 messages per email per day; 100 total per hour, DB-based, plus honeypot. For heavy traffic add Cloudflare WAF/rate limiting and a managed bot challenge.
- Enquiry fields: id, created_epoch, created_at, name, email, category, message, consent, status. Index by date and email.
- Privacy wording is appended to /privacy.html. The website's existing contact email addresses were not verified and should be checked independently.
- Live delivery proof: save a real enquiry through contact form and check that it appears in admin dashboard > Contact enquiries. Do not submit fake enquiries to production purely for testing. Tests can use preproduction environment.
