# RPG Character Creator — Project Overview

**Status:** In development
**Working title:** RPG Character Creator (final product name TBD)
**Product type:** Full-stack character creator, not a playable RPG
**Development environment:** Google Cloud Shell Editor (migrated from GitHub Codespaces)

## Vision

Create a safe, accessible, small-scale full-stack web experience inspired by the look of classic Macintosh software and minimalist fantasy pixel-art games. Visitors start at a public sign-in screen. Registered users create and keep **one** fictional RPG character, then return to view, edit, or export a printable character sheet.

The project demonstrates frontend and backend engineering, managed authentication, PostgreSQL authorization, product documentation, automated testing, GitHub workflows, and CI/CD.

## Approved User Journey

1. A guest sees a retro RPG welcome screen with **Sign In**, **Create Account**, and **Forgot Password?**
2. Registration collects a display name, email, and password; email confirmation is required.
3. A verified user signs in. If no character exists, the application opens the guided character creator.
4. The creator uses four grouped stages: **Class & Name**, **Origins**, **Equipment**, and **Essence & Review**.
5. Class selection changes the central original pixel-art preview. A **Randomize Character** action fills a draft, which can be edited before saving.
6. After saving, **My Character** shows the personal character sheet, with **Edit Character**, **Export PDF**, and account controls.
7. Subsequent logins open **My Character** when a record already exists.
8. Password recovery uses Supabase Auth's email-based recovery flow; responses must not disclose whether an address is registered.

## MVP Feature Set

- Email/password registration and login, email verification, sign-out, and password recovery.
- Display name only; do not request full legal name, phone, birth date, or sex/gender information.
- Exactly one saved character per user, enforced in PostgreSQL.
- Eight classes: Warrior, Paladin, Mage, Rogue, Ranger, Druid, Cleric, Bard.
- Character name and **seven** additional customizable fields: ancestry, background, weapon, artifact, personality, aura, companion. See [Customization Catalog](./customization-catalog.md).
- No sex, gender, or gender-identity field on the character form or stored character record.
- An introductory ensemble illustration of all eight classes and one static illustration per class showing two different-looking adventurers. Illustration is decorative; it does not restrict choices or assign an identity.
- Four grouped creator stages, navigation with retained selections, review, and draft randomization.
- Protected REST API for creating/updating, retrieving, and deleting the user's single character.
- Dashboard with editing, logout, account settings, and **client-side export of a minimalist retro PDF** containing character details only.
- Responsive light/dark themes, emerald/mint/cream/near-black palette, crisp pixel artwork, and accessible form controls.
- Hosted production frontend/backend with working authentication email delivery and PostgreSQL persistence.

## Technology and Delivery

| Concern | Selection |
|---|---|
| Frontend | React, Vite, TypeScript, CSS |
| API | Node.js, Express, TypeScript |
| Auth | Supabase Auth (email/password first) |
| Data | Supabase PostgreSQL with Row Level Security |
| Tests | Vitest, Supertest, browser-facing checks where practical |
| Version control and planning | GitHub Issues, feature branches, pull requests |
| CI/CD | GitHub Actions and deployment checks |
| Hosting | Vercel frontend; backend deployment mode to be validated in deployment phase |
| Developer workspace | Google Cloud Shell Editor |

## Security and Privacy Baseline

- Supabase Auth manages passwords, tokens, confirmation, and reset links; application tables never store passwords.
- The API validates the caller's access token and derives ownership from that authenticated identity.
- All character operations are isolated by RLS and server-side authorization checks; use a user-scoped database context rather than bypassing RLS with privileged credentials.
- Minimize collected personal data. Never put backend secrets in public Vite variables or Git.
- Generic authentication/recovery errors, abuse protections, input validation, safe output encoding, HTTPS, restricted CORS, and authorization regression tests are release requirements.
- Offer character deletion, user data access/correction, and a documented account-deletion process.
- Complete a security and privacy review before opening public sign-ups.

## Out of Scope for the Initial Release

- Gameplay, combat, levels, quests, inventory mechanics, multiplayer, or world simulation.
- Multiple saved characters per account.
- Dynamic sprite composition, user-generated artwork, or customization by body/sex/gender.
- Google OAuth (explicitly deferred until after the email/password release).
- Public character sharing or a community feed.
- A custom administration dashboard.

## Definition of Done

1. An unauthenticated visitor cannot read or modify characters.
2. A user can register, verify email, sign in, reset password, and sign out.
3. A new account enters the four-stage editor and saves one character.
4. A returning user sees the saved sheet and can edit/export it, without duplicate rows.
5. The randomization tool changes only the draft until Save is confirmed.
6. A user cannot access another account's character through API requests or direct database access.
7. Both themes and the responsive interface support keyboard navigation and readable text.
8. Tests and GitHub Actions checks pass; secrets are not committed.
9. Frontend, API, and email flows function in the deployed production environment.
10. Setup, limits, security decisions, and maintenance instructions are documented.

## Working Agreement

Keep code, UI copy, commit messages, and documentation **in English**. Track changes through GitHub Issues and short-lived branches. Use pull requests to review changes before merging to `main`. The detailed [Requirements](./requirements.md), [Architecture](./architecture.md), [Catalog](./customization-catalog.md), and [Product Experience](./product-experience.md) documents are the implementation baseline.
