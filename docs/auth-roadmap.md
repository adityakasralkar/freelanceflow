# Auth Roadmap

This document tracks the authentication and account-management features that
are **shipped today**, the ones **explicitly deferred**, and the rationale for
each. Treat this as the canonical source when planning future auth work.

---

## Shipped (current build)

- **Freelancer self-signup** — public registration form
- **Email verification** — token link sent on signup, account inactive until
  the link is clicked
- **Resend verification email** — for users who lose the original
- **Password reset** — "forgot password" → email link → set new password
- **Invitation-based client onboarding** — freelancer creates a client record,
  triggers an invite email; client clicks the link, sets a password, and lands
  in their portal pre-linked to the right client record. No public client
  signup.
- **Resend / revoke invitations** — freelancer can re-issue or cancel a pending
  invite from the client record
- **Rate limiting** — strict limits on login (`5 / 15min`), forgot-password
  (`3 / hour`), and general auth endpoints (`10 / 5min`)
- **Password validation rules** — minimum 8 characters, at least one
  uppercase, one lowercase, one digit, one special character. Enforced by a
  shared Zod schema on both backend and frontend.
- **Email service abstraction** — Resend in production, console fallback in
  dev so flows are testable without setting up a real provider

---

## Deferred (not built — revisit later)

These are intentional gaps. Each one is noted with the reason it was skipped
and the rough cost of adding it later.

### Refresh tokens (access + refresh split)

Today we issue a single JWT that lives for 7 days. The industry-standard
pattern is a 15-minute access token plus a long-lived refresh token stored
server-side, allowing fast revocation. We'll add this when:

- We need session revocation ("log out everywhere")
- We need to rotate tokens silently in the background

**Estimated cost:** `refresh_tokens` table + new endpoint + frontend interceptor
to refresh on 401 → ~4 hours.

### 2FA / TOTP

Optional second factor (Google Authenticator / Authy). Standard for B2B SaaS
once paid plans appear. Skip until we have paid users or sensitive data flows.

**Estimated cost:** `speakeasy` library + `user_totp_secrets` table + setup +
verify endpoints + frontend QR flow → ~6 hours.

### OAuth / social login

"Sign in with Google" and similar. Skip until we have real user demand or a
specific audience that prefers it.

**Estimated cost:** Passport.js or NextAuth-style config + Google OAuth setup
+ account-linking flow → ~4 hours per provider.

### Session management UI

"View your active sessions, log out other devices." Depends on refresh tokens
being in place.

**Estimated cost:** Builds on refresh-token work, ~2 hours additional.

### Password strength meter (zxcvbn)

Live UI feedback while the user types ("weak / fair / strong"). We chose
**rules-based validation only** for now — clear pass/fail messages, no live
meter. Add zxcvbn later if signup conversion data shows users struggle with
the rules.

**Estimated cost:** `zxcvbn` library + meter component + visual indicator → ~2
hours.

### Account lockout after repeated failures

Currently we have **rate limiting**, which throttles requests but doesn't lock
accounts. Account lockout (e.g. "too many failed logins → account locked for
30 minutes") is a stricter alternative. Skip until we see actual brute-force
attacks in logs.

**Estimated cost:** `failed_login_attempts` column + check on login + unlock
flow → ~3 hours.

---

## Notes for future contributors

- Password rules live in `server/src/utils/passwordValidator.js`. Keep the
  frontend mirror in sync (`client/src/utils/passwordRules.ts`).
- Email templates live in `server/src/services/email.service.js`. They're
  inline HTML strings on purpose — no template engine to keep the dependency
  surface small. If we add more than ~5 templates, switch to MJML or React
  Email.
- Tokens are stored in plaintext today. Acceptable for MVP since we don't have
  PII at rest. Hash them (`bcrypt` or `crypto.timingSafeEqual` over `sha256`)
  when we move to production volume.
