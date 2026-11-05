# Adventure Files — session isolation and safe password recovery

## Application behavior

- Authenticated Supabase sessions are stored in `sessionStorage`, per browser tab. A unique per-page Supabase instance key prevents `BroadcastChannel` events from other tabs from switching the current account; the storage adapter maps these keys to a stable per-tab session key so reloads work.
- Short-lived PKCE code verifiers are stored in `localStorage` so an email callback opened in another tab of the **same browser** can complete. User sessions and refresh tokens are **not** stored there by this client.
- Normal **Sign out** uses the Supabase `local` scope. It does not revoke other independent sessions.
- Successful password recovery uses the `global` scope on purpose: other sessions of the recovered account must reauthenticate.
- Recovery is authorized only after Supabase verifies the one-time recovery code (`email` + `token`, `type: 'recovery'`), a compatible legacy `token_hash`, or a verified `PASSWORD_RECOVERY` event. User ID and recovery-session checks are required before `updateUser`.
- **Open a new blank tab and type the URL** for a truly independent login. The browser's **Duplicate Tab** action may copy `sessionStorage`, including the same session/refresh token. Signing out of such a cloned session may cause the original copy to require reauthentication; avoid Duplicate Tab when testing account isolation.
- Existing `localStorage` sessions from older deployments are **not migrated**. A fresh sign-in may be required after this change.

## Required deployment configuration

1. Choose a stable HTTPS environment alias for staging (for example, `https://adventure-files-staging.vercel.app`), not a generated per-deployment Vercel preview URL. The alias must point to the intended tested frontend build.
2. In Vercel's **Preview** environment set `VITE_AUTH_REDIRECT_ORIGIN` to that origin only. Redeploy after changes. Production must use its own reviewed origin and API/database configuration when public release is approved.
3. In **Supabase Dashboard → Authentication → URL Configuration**, set **Site URL** to the intended stable app origin. Allow both the origin and its `/reset-password` path in **Redirect URLs**. Retain only development callback URLs that are still needed.
4. In **Supabase Dashboard → Authentication → SMTP Settings**, configure a sender that can deliver recovery and confirmation messages. A dedicated Gmail account with an app password can be used for small staging tests; it is not a production email-delivery guarantee. Keep SMTP passwords in Supabase only, never in Vercel `VITE_*` variables or Git.
5. In **Supabase Dashboard → Authentication → Emails → Reset password**, use the currently approved **one-time recovery code (OTP)** email. The user opens the app and enters the email address and code; the email link must not itself consume or verify the code. Example body:

   ```html
   <h2>Adventure Files — Recuperação de senha</h2>
   <p>Seu código temporário:</p>
   <p><strong>{{ .Token }}</strong></p>
   <p><a href="{{ .RedirectTo }}">Abrir recuperação</a></p>
   <p>Digite seu e-mail e o código na página para definir uma nova senha.</p>
   ```

   **Do not use `{{ .ConfirmationURL }}`** in this template: following an auto-verifying link could consume the single-use proof before the person enters it. The application checks `email + code` using Supabase `verifyOtp({ email, token, type: 'recovery' })`, binds the verified session to that account, and only then enables the new-password form. Preserve the approved OTP template while it is working.
6. If the stable staging hostname is protected by Vercel Authentication, external testers need an explicitly permitted staging access path. Do not turn off protection for every Preview to test independent sessions.
7. Observe Supabase's email/request rate limits and cooldowns. The Auth server decides token validity, expiry, and one-time use; client-side checks cannot replace server verification.

### Older recovery-link compatibility

The code still accepts previously issued `token_hash` recovery links and Supabase-verified recovery events where applicable. This is a compatibility path, **not** the template currently recommended for new emails. Do not switch the working OTP template back to a hash-link template without a separately reviewed decision.

### November 3–4, 2026 staging evidence

- The developer reported successful dedicated Gmail SMTP recovery emails, email/code/password reset, used/invalid code rejection, independent browser tabs, and desktop/mobile checks.
- The developer subsequently reported successful hosted negative cross-account character tests and a guarded `/reset-password` route. The Render/Vercel `/api/health` and unauthorized `/api/characters/me` checks also passed.
- Read-only hosted database checks confirmed the two expected migration versions, four owner-scoped RLS policies, and a snapshot of 2 characters with 0 missing Motivation.
- Latest CI at `c115039` passed frontend (167 tests), API (97 tests, 2 opt-in local integrations skipped by default), lint/builds and isolated database security.
- These are developer-reported browser tests and SQL screenshots. They do **not** establish unlimited external email deliverability, absence of automated signup abuse, or a finished public-release security audit.
- Before public open registration, confirm Supabase Auth rate limits, suitable bot protection, stable Vercel/Auth redirect origin, and a data/account deletion notice. The single free Gmail SMTP account can be throttled or blocked if abused. See [the free portfolio runbook](./free-portfolio-release.md).

## Regression checklist (Preview only)

- [ ] In a new browser tab A, sign into account A, refresh, and verify its own character remains visible.
- [ ] Open a separate blank tab B by entering the app URL (not Duplicate Tab); sign into account B and verify its own character after reload.
- [ ] Sign out of tab B and confirm tab A remains authenticated.
- [ ] Check independent login on mobile and tab-specific sign-out behavior.
- [ ] Request recovery for account B. The email must contain the one-time code and a link to the recovery screen; following the link must not consume the code.
- [ ] Enter B's email and valid newest code. Confirm the app identifies the correct account before updating its password.
- [ ] Verify that an incorrect, expired, previously used, or older superseded code cannot authorize another password update.
- [ ] Request a fresh code after the cooldown and confirm the new code works without altering account A.
- [ ] Visit `/reset-password` without valid proof. An ordinary saved login must not authorize a password update.
- [ ] Confirm account A's password still works, while B's old password no longer does after the update.
- [ ] Review Supabase Auth audit logs for the recovered account and sign-out scope.

**Historical release note:** PR #23 was merged and release Issue #24 was subsequently closed following owner acceptance. The checklist above remains useful when changing authentication/recovery behavior; use disposable accounts and never run destructive checks against existing production characters.
