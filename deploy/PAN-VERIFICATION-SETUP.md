# Real PAN verification for Karunvaya Foundation

The production PAN endpoint is implemented in the branded Cloudflare Pages proxy. It is **fail closed**: it does not simulate verification, and no PAN collection is enabled until the authorised provider is configured.

Provider: Cashfree Secure ID PAN Sync API.
Production API: POST https://api.cashfree.com/verification/pan
Required Cloudflare Pages **production secrets** (not GitHub, browser JS or chat):
- CASHFREE_PAN_CLIENT_ID — issued for authorised Cashfree Secure ID account.
- CASHFREE_PAN_CLIENT_SECRET — paired live secret.
- PAN_TOKEN_SECRET — random >=32 character signing secret.
- PAN_PROVIDER_MODE — 'live' when account approved and PAN verification product activated.

When credentials are configured, redeploy Pages so bindings take effect. GET /api/pan/config must return enabled:true,mode:'live' only with all four bindings.

Safeguards: Checks signed-in session via /api/auth/me, origin and input validation, live Cashfree response validity, PAN active status and registered-name match. No raw PAN storage or echoing. A signed 10-minute token binds donation amount, donor name, provider reference. High-value payment order requests require a valid signed PAN token and still fail closed until gateway approval.

IMPORTANT: Existing Razorpay backend currently returns enabled:false and caps donations at ₹100,000. Real high-value checkout is **not** active. HIGH_VALUE_CHECKOUT_ENABLED must remain absent/false until the original payment backend is properly updated, merchant KYC approved, and payment/reconciliation controls tested. App frontend currently does not forward the PAN token to the payment order API; this must be integrated when gateway onboarding is completed. Provider integration never implies payment activation.

API docs: https://www.cashfree.com/docs/api-reference/vrs/v2/pan/verify-pan-sync
