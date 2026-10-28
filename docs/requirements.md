# RPG Character Creator — System Requirements

**Baseline:** Approved product direction, 2026-10-28.
**Status:** Specification for implementation; features are not necessarily implemented yet.

## 1. Purpose and Scope

The product is a full-stack **fictional RPG character creator**, not a playable RPG. It combines a minimalist retro-computer interface, original pixel art, password-protected accounts, character persistence, and client-side PDF export. All code, UI copy, and documentation are in English.

## 2. Actors

- **Guest:** May visit the public landing page, register, sign in, and initiate password recovery. Cannot create or inspect persistent characters.
- **Unverified account:** May complete email verification but cannot access protected character data until authenticated and confirmed.
- **Authenticated user:** May create, view, update, export, and delete their **own** single character.

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The first public screen shows original RPG pixel art, an email/password login form, **Create Account**, and **Forgot Password?** |
| FR-02 | Registration collects a display name, email, and password (with a password-confirmation input for typing verification); unnecessary personal information is not requested. |
| FR-03 | Supabase Auth handles registration, password storage, and email confirmation; an unverified account cannot use protected character operations. |
| FR-04 | Users can sign in and sign out; failed authentication displays a safe, generic error rather than revealing whether an account exists. |
| FR-05 | Password recovery sends a managed, expiring recovery link. The UI displays the same neutral response for registered and unregistered addresses. |
| FR-06 | Protected pages redirect unauthenticated visitors to sign-in; protected API endpoints reject invalid or expired credentials. |
| FR-07 | A signed-in user with no character enters the guided creator; an existing character opens **My Character**. |
| FR-08 | Exactly one character can be saved per user; duplicate creation is rejected or handled as an explicit update, not a second row. |
| FR-09 | Character name is mandatory and 2–32 characters long after trimming. |
| FR-10 | The class selector offers eight predefined classes with accessible text labels and an original class preview. |
| FR-11 | The character creator provides **ancestry, background, weapon, artifact, personality, aura, and companion** selections from the version-controlled [catalog](./customization-catalog.md). |
| FR-12 | No sex/gender field or gender-based choice restriction is presented or persisted. Class art shows two different-looking examples without requiring a visual identity selection. |
| FR-13 | The creator has four grouped stages: **Class & Name**, **Origins**, **Equipment**, **Essence & Review**; Back/Next preserves draft values. |
| FR-14 | The **Randomize Character** action creates only an editable draft of valid selections and an optional fictional name; it never silently overwrites a saved record. |
| FR-15 | The final review displays all selected fields and requires an explicit save action. |
| FR-16 | Users can retrieve their persisted character and see it on a retro-styled **My Character** dashboard after subsequent logins. |
| FR-17 | **Edit Character** reuses the guided editor, prefilled from the saved record; saving updates the same character ID. |
| FR-18 | A user can explicitly delete their own saved character after a confirmation step and then create a new one. |
| FR-19 | **Export PDF** produces a readable minimalist retro character sheet locally in the browser; it contains character data/artwork but no account email, credentials, or access token. |
| FR-20 | Both light and dark themes use the agreed emerald, mint, cream, dark-green, and near-black visual palette. |
| FR-21 | Interface responses distinguish loading, success, validation errors, missing character, forbidden action, and recoverable failures without leaking internal information. |
| FR-22 | Users can sign out, update applicable account settings through supported authentication-provider flows, and obtain instructions for account data access/deletion. |

### User-Facing Navigation

1. Public Welcome / Sign In
2. Create Account / Confirm Email / Forgot Password / Reset Password
3. Signed-in routing by character existence
4. Four-stage Character Creator
5. My Character (View, Edit, Export PDF, Delete Character, Sign Out / Account Settings)

All guest-to-user transitions must preserve authorization boundaries.

## 4. Catalog and Business Rules

- **BR-01:** An authenticated user's `user_id` is unique in the `characters` table and references the authentication provider's user ID.
- **BR-02:** Class and all seven enumerated fields must match approved slugs. Artifact and companion explicitly support `none`.
- **BR-03:** Name length is validated on the API and database boundary; output is escaped/safely rendered.
- **BR-04:** No class/attribute combination is prohibited by gameplay rules.
- **BR-05:** Every character endpoint derives ownership from the verified session, never from an arbitrary request-supplied user ID.
- **BR-06:** Editing updates the saved record rather than allocating another character.
- **BR-07:** The randomizer never persists without a deliberate Save action.
- **BR-08:** PDF export contains fictional character fields only, and does not require storing PDF bytes on the server.
- **BR-09:** Class imagery is illustrative and not the basis for a gender/sex attribute.
- **BR-10:** New option slugs require coordinated application and validation changes.

## 5. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 — Authentication | Use Supabase Auth for password credentials, verification, sessions, and recovery. Do not implement proprietary password hashing or recovery tokens. |
| NFR-02 — Authorization | Require a verified valid token for character CRUD and enforce user ownership in the API **and** database RLS policies (SELECT/INSERT/UPDATE/DELETE). |
| NFR-03 — Least privilege | Use user-scoped DB access for user operations. Never expose service-role or backend credentials to Vite/public code or Git history. |
| NFR-04 — Abuse prevention | Configure suitable Auth rate limits/CAPTCHA where warranted, and protect public write endpoints from automated abuse. |
| NFR-05 — Safe failure | Use consistent sign-in/recovery messages, generic server error responses, and safe logging without raw passwords or access tokens. |
| NFR-06 — Validation | Validate all API inputs including types, lengths, content, and allowed slugs; use safe HTML rendering to avoid injection/XSS. |
| NFR-07 — Transport | Use HTTPS in production, restrictive CORS, appropriate security headers, and provider-recommended session protections. |
| NFR-08 — Privacy | Minimize collected personal data; document account/character data access, deletion, and privacy information before public registration. |
| NFR-09 — Accessibility | Keyboard navigation, visible focus, labeled inputs, accessible errors, readable fonts, adequate color contrast, and reduced-motion respect. |
| NFR-10 — Responsiveness | Usable on mobile and desktop; avoid nested tiny windows or unreadably small text. |
| NFR-11 — Maintainability | Separate frontend, API, Auth, and persistence; keep stable slugs and clear version-controlled documentation. |
| NFR-12 — Reliability | Loading/error/empty states; no accidental character loss when going Back or when a non-destructive error occurs. |
| NFR-13 — Testability | Automated health, validation, authentication, record ownership, CRUD, uniqueness, and PDF-output smoke checks. |
| NFR-14 — CI/CD | GitHub Actions runs web/API build, lint, tests, and security checks before merging/deployment. |
| NFR-15 — Production email | Configure production-grade email delivery for verification and password reset; the provider's test sender is not sufficient for public signup. |
| NFR-16 — Security review | Test cross-user access attempts, spoofed user IDs, no-token/expired-token requests, invalid option values, and secret leakage before public release. |

## 6. Detailed Acceptance Scenarios

### Account and recovery

- Guest sees the public retro login and cannot open a private character sheet.
- Registration requests only display name, email, and password; a verification email is issued.
- A verified user can log in; invalid email/password does not indicate which component was wrong.
- Forgot Password displays a uniform response whether the address exists or not.
- The recovery flow updates credentials securely without disclosing them to the app.

### Character lifecycle

- First login with no record opens the creator; returning login with a record opens My Character.
- Class preview changes after selecting Warrior, Paladin, Mage, Rogue, Ranger, Druid, Cleric, or Bard.
- Every field has a documented valid value; invalid input is rejected by the server.
- Repeated Save/Update cannot create a second row for the same user.
- Randomization changes the draft only; canceling does not modify persisted data.
- Delete requires confirmation; once deleted, the user is routed to creation.
- Export produces a readable, private character-only PDF.

### Authorization and operations

- User A cannot read, update, or delete User B's character, even by modifying URLs/body data or querying the database.
- Anonymous and expired sessions are denied.
- CI builds and tests pass; responsive UI and both themes remain legible.
- Auth verification and reset emails work in production before public launch.

## 7. Deferred or Excluded Features

- Google OAuth; consider it only after email/password and recovery are stable.
- Multiple characters per account.
- Gameplay, skills, stats, battles, quests, character leveling, multiplayer.
- User-editable appearance/gender/sex fields, composite avatar generation, animation.
- Public sharing, social feed, custom administrator panel.

## 8. Related Documents

- [Project Overview](./project-overview.md)
- [Customization Catalog](./customization-catalog.md)
- [Product Experience](./product-experience.md)
- [Architecture](./architecture.md)
- [Data Model](./uml/data-model.md)
- [Use Case Diagram](./uml/use-cases.puml)
- [Save Character Sequence](./uml/save-character-sequence.puml)
