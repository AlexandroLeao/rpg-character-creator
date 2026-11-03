# Adventure Files — session isolation and safe password recovery

## Application behavior

- Authenticated Supabase sessions are stored in `sessionStorage`, per browser tab. A unique per-page Supabase instance key prevents `BroadcastChannel` events from other tabs from switching the current account; the storage adapter maps these keys to a stable per-tab session key so reloads work.
- Short-lived PKCE code verifiers are stored in `localStorage` so an email callback opened in another tab of the **same browser** can complete. User sessions and refresh tokens are **not** stored there by this client.
- Normal **Sign out** uses the Supabase `local` scope. It does not revoke other independent sessions.
- Successful password recovery uses the `global` scope on purpose: other sessions of the recovered account must reauthenticate.
- Recovery is authorized only after a server-verified recovery token or Supabase's `PASSWORD_RECOVERY` event, with user ID and session checks before `updateUser`.
- **Open a new blank tab and type the URL** for a truly independent login. The browser's **Duplicate Tab** action may copy `sessionStorage`, including the same session/refresh token. Signing out of such a cloned session may cause the original copy to require reauthentication; avoid Duplicate Tab when testing account isolation.
- Existing `localStorage` sessions from older deployments are **not migrated**. A fresh sign-in may be required after this change.

## Required deployment configuration

1. Choose one stable HTTPS staging origin that points to the current tested application build. Avoid Vercel's generated per-deployment preview URLs for email redirects.
2. In Vercel's environment settings for the frontend, set `VITE_AUTH_REDIRECT_ORIGIN` to that origin (origin only, for example `https://YOUR-STABLE-STAGING-DOMAIN`). Redeploy the frontend so Vite includes the value.
3. In **Supabase Dashboard → Authentication → URL Configuration**, change **Site URL** from `http://localhost:3000` to the same public, stable origin. Add both the origin and `https://YOUR-STABLE-STAGING-DOMAIN/reset-password` to **Redirect URLs**. Keep localhost development callback URLs separately when needed.
4. In **Supabase Dashboard → Authentication → Email Templates → Reset Password**, configure the recovery link to point directly to your app using Supabase's hash token (this works across browser tabs and devices, without reliance on the PKCE verifier from the requesting tab):

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Redefinir minha senha</a>
   ```

   The application consumes the `token_hash` with `verifyOtp({ token_hash, type: 'recovery' })`, removes it from the visible URL, and only then enables the password form. Keep the template's other text and branding as desired. Use this template only for the Reset Password email.
5. If the staging hostname is protected by **Vercel Authentication**, an incognito user will see Vercel's login before reaching the app. For external testing, use a permitted, narrowly scoped shareable link or an explicit deployment-protection exception for the chosen staging hostname. Do **not** disable protection for every preview merely to test independent sessions.
6. The Supabase hosted email service rate-limits recovery requests (normally 60 seconds per user). Wait between requests; do not conclude that a link is newest merely by Gmail ordering. The Auth server decides whether a one-time token is valid; client code cannot revoke previously issued tokens by itself.

## Regression checklist (Preview only)

- [ ] New tab A: sign into account A; refresh; characters stay scoped to A.
- [ ] New tab B, opened by entering the URL in the address bar: sign into account B; refresh; characters stay scoped to B.
- [ ] Sign out of tab B; tab A remains authenticated.
- [ ] Sign into A on mobile; signing out of desktop tab A does not sign out the mobile session.
- [ ] Request reset for account B. Open the newest message and ensure the app shows B's address before allowing the change.
- [ ] Use the link once; the same link must not authorize a second password reset.
- [ ] Request another link after the cooldown; verify the earlier link is rejected and the new one succeeds. If the earlier link is accepted, investigate Auth server token issuance; do not attempt to enforce this only in the browser.
- [ ] Try `/reset-password` without a token. It must not accept an ordinary saved login.
- [ ] Verify account A's password still works unchanged; B's old password no longer works.
- [ ] Check Auth audit logs for which account has `user_updated_password`.

Do not merge the PR to `main` until the manual checks above pass.
