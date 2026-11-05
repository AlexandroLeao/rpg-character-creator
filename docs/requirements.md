# Adventure Files — System Requirements

- **Project:** Adventure Files
- **Document type:** Functional and non-functional requirements
- **Status:** Approved functional specification implemented on the feature branch; final public-release gates pending.

## 1. Purpose and Scope

Adventure Files is a personal full-stack web application for creating, managing, and exporting fictional RPG characters.

The application combines:

- Account registration and authentication.
- A minimalist retro game-inspired interface.
- Original pixel-art illustrations.
- A guided six-stage character creation experience.
- Persistent character data.
- Secure user-specific API operations.
- Character-sheet export in PNG Story/Status and PNG Portrait formats.

Adventure Files is not a playable RPG.

The project should demonstrate frontend and backend development while maintaining a recognizable visual identity inspired by classic adventure games and early computer interfaces.

The application supports Portuguese and English.

Code, technical documentation, Git commit messages, and pull-request descriptions use English.

## 2. Actors

### Guest

A guest can:

- View the public Adventure Files start screen.
- Access the authentication interface.
- Select the interface language.
- Register an account.
- Sign in.
- Request password recovery.

A guest cannot access protected character data.

### Unverified Account

An account awaiting required email confirmation can complete the authentication provider's verification flow.

Protected character operations require a valid, authorized session.

### Authenticated User

An authenticated user can:

- Access the character area.
- Create one character.
- View their saved character.
- Edit their character.
- Delete their character.
- Export their character as PNG Story/Status.
- Export their character as PNG Portrait.
- Sign out.

Each user can access only their own data.

## 3. Functional Requirements

### 3.1. Start Screen and Authentication

| ID | Requirement |
|---|---|
| FR-01 | The first public screen displays the Adventure Files title, original pixel-art adventure artwork, and a blinking "PRESS START" prompt. Authentication fields are not displayed on this screen. |
| FR-02 | Registration collects an email, password, and password confirmation. Unnecessary personal information is not requested. A bilingual, expandable Terms of Use and Privacy Notice is presented exclusively during signup; the terms checkbox starts unchecked and must be accepted before the frontend submits. |
| FR-03 | Supabase Auth manages registration, password storage, email confirmation, and authentication sessions. Protected character operations require an authorized session. |
| FR-04 | Users can sign in and sign out. Authentication failures display safe, generic messages that do not disclose whether an account exists. |
| FR-05 | Password recovery uses the authentication provider's managed recovery flow. The request screen provides neutral feedback regardless of whether the email is registered. |
| FR-06 | Protected frontend views require authentication, and protected API endpoints reject missing, invalid, or expired credentials. |
| FR-07 | An authenticated user without a saved character can enter the creator. An authenticated user with an existing character sees their saved character dashboard. |

### 3.2. Character Creation and Management

| ID | Requirement |
|---|---|
| FR-08 | Each authenticated account can store at most one character at a time. Duplicate creation must not produce a second character row. |
| FR-09 | The character name is mandatory and must contain 2–32 characters after trimming. |
| FR-10 | The class selector provides eight predefined classes, accessible text labels, and original class-specific illustrations that update only on explicit selection. |
| FR-11 | The creator provides ancestry, background, weapon, artifact, personality, aura, companion, and motivation selections from the version-controlled customization catalog. |
| FR-12 | No sex or gender field is presented or persisted. Class illustrations show different-looking examples without requiring a separate visual-identity selection. |
| FR-13 | Character creation contains six stages: Identity, Origins, Equipment, Essence, Journey, and Final Review. Back/Next navigation preserves draft selections. |
| FR-14 | If character randomization is provided, it modifies only an editable draft and must never silently overwrite a saved character. |
| FR-15 | The sixth stage is exclusively dedicated to reviewing all selections. Saving requires an explicit Save action and does not occur automatically when entering the review stage. |
| FR-16 | Users can retrieve their saved character and view it in the retro-styled My Character dashboard after subsequent logins. |
| FR-17 | Editing opens the guided creator with the saved values prefilled. Saving updates the existing character rather than creating a second record. |
| FR-18 | Users can delete their own character after explicit confirmation. Their account remains available for creating another character. |
| FR-19 | The application generates downloadable character sheets containing the character illustration, name, and all selected fields in the two approved PNG export formats. Private account credentials and authentication tokens must never be included. |

### 3.3. Visual Experience and Interaction

| ID | Requirement |
|---|---|
| FR-20 | The application uses one consistent dark retro visual identity with black, dark-green, emerald, mint, and cream tones. A light/dark theme switch is not provided. |
| FR-21 | The interface distinguishes loading, success, validation errors, missing character, unauthorized access, and recoverable failures without exposing sensitive internal information. |
| FR-22 | Users can sign out and access applicable account-management or data-deletion procedures supported by the authentication provider and project scope. |
| FR-23 | The authentication interface includes a compact PT/EN language selector in its upper-right area. The selected language affects user-facing interface labels and messages without changing stored catalog identifiers. |
| FR-24 | The start screen supports mouse click, touch, and Enter. Its title and "PRESS START" prompt are rendered separately from the illustration. Desktop and mobile use appropriately composed artwork. |
| FR-25 | Starting the experience triggers a retro iris-closing transition, a brief black-screen pause, and a reverse iris-opening transition that reveals authentication. Reduced-motion preferences must be respected. |
| FR-26 | Before class selection, the creator displays an eight-class ensemble illustration. Hover and focus do not change the displayed artwork. Activating a class selects it and displays the corresponding illustration until another class is explicitly selected. |
| FR-27 | All important interactions remain accessible through keyboard, mouse, and touch. Hover is not the only way to access or confirm information. |

### 3.4. Character Creator Layout and Exports

| ID | Requirement |
|---|---|
| FR-28 | The creator header displays progress from 01 / 06 through 06 / 06 on the left, with the PT/EN language selector on the right. |
| FR-29 | Customization stages organize their fields into pairs. Desktop layouts use side-by-side categories with subtle visual dividers. Mobile layouts stack categories vertically without those dividers. |
| FR-30 | The available export formats are PNG Story/Status at 1080 × 1920 pixels and PNG Portrait at 1080 × 1350 pixels. |
| FR-31 | All export formats use the authenticated user's saved character data as their source. Each format may use its own layout while preserving the complete character information. |
| FR-32 | The export interface allows users to select and download a format. Direct publishing to Instagram, WhatsApp, or other social platforms is not required. |
| FR-33 | Character creation requires an explicit valid selection for every customization category. Companion supports the explicit value `none`, while artifact does not. |
| FR-34 | Invalid or failed save operations preserve the user's draft and provide recoverable feedback. A failed request must not silently create duplicate records. |

### 3.5. Dashboard Extras and Account Lifecycle

| ID | Requirement |
|---|---|
| FR-35 | The empty authenticated dashboard displays Create Character, Extras, Delete Account, and Sign Out in that exact order, with the established visual styling. |
| FR-36 | A saved-character dashboard displays Sign Out, Edit, Export, Delete, and Extras in that order, with five aligned desktop actions and an accessible mobile layout. |
| FR-37 | Export preserves the two existing PNG formats; Delete offers distinct Delete Character and Delete Account options, each with independent confirmation. |
| FR-38 | Delete Account is available with or without a saved character. It requires fresh password verification and an explicit irreversible confirmation; only a trusted backend may delete the verified Auth user. The saved character is removed by the database cascade. |
| FR-39 | The bilingual Extras panel gives concept, creative-direction and development credit to Alexandro Milhomes Leão, briefly describes the project and artistic inspirations, and provides the support email and GitHub profile. AI-assistance details belong in the project documentation, not the in-app Extras panel. |

## 4. Approved User Navigation

The primary experience follows this order:

1. Adventure Files start screen.
2. Retro transition into authentication.
3. Sign in or create account.
4. Email verification or password recovery when required.
5. Authenticated character area.
6. Six-stage character creation or saved-character dashboard.
7. Final character review and explicit save.
8. View, edit, delete, or export the saved character.
9. Sign out when desired.

Account registration and character creation are separate processes.

A user does not create a character as part of the account-registration form.

The user must be authenticated before saving persistent character data.

The creator must preserve draft selections when navigating between stages.

## 5. Character Creation Requirements

### 5.1. Class Selection

The available classes are:

1. Warrior
2. Paladin
3. Mage
4. Rogue
5. Ranger
6. Druid
7. Cleric
8. Bard

These values correspond to the approved customization catalog.

### 5.2. Class Illustration Behavior

The creator uses two visual states.

**Default state**

No class is selected.

The illustration shows a group representing all eight classes.

Hovering or focusing a class does not change the artwork or select a class.

**Confirmed selection**

The user activates a class option using mouse, keyboard, or touch.

That class becomes the selected value and its illustration remains visible until another class is explicitly chosen.

Each class-specific illustration shows two different-looking adventurers.

These illustrations are representative only and do not introduce gender, body-type, or avatar-selection fields.

### 5.3. Guided Stages

The approved character creator contains six stages.

| Stage | Name | Selections |
|---|---|---|
| 01 / 06 | Identity | Class and character name |
| 02 / 06 | Origins | Ancestry and background |
| 03 / 06 | Equipment | Weapon and artifact |
| 04 / 06 | Essence | Personality and aura |
| 05 / 06 | Journey | Companion and motivation |
| 06 / 06 | Final Review | Review and explicit save |

The first five stages define the character.

The sixth stage introduces no new customization categories.

Users can:

- Move forward.
- Move backward.
- Change previous choices.
- Review the entire draft.
- Save explicitly.

Navigating between stages must not discard the draft.

Validation errors must preserve entered values.

The final review must display:

1. Character name.
2. Class.
3. Ancestry.
4. Background.
5. Weapon.
6. Artifact.
7. Personality.
8. Aura.
9. Companion.
10. Motivation.

The user must be able to return to previous stages before saving.

### 5.4. Stage Validation

The following rules apply:

- A class must be explicitly selected.
- Character names contain 2–32 characters after trimming.
- Ancestry is required.
- Background is required.
- Weapon is required.
- Artifact is required.
- Personality is required.
- Aura is required.
- Companion requires an explicit selection.
- Motivation is required.

Companion may use the explicit identifier `none`.

Artifact must use one of its eight approved artifact identifiers.

The creator must not automatically assign an equipment selection simply to satisfy validation.

The Continue button may remain disabled until the current stage is valid.

### 5.5. Editing Existing Characters

Editing must:

1. Load the saved character.
2. Populate the creator with existing values.
3. Allow the user to modify selections.
4. Preserve changes within the draft.
5. Display the updated draft in Final Review.
6. Update the saved record only after explicit confirmation.

Canceling the edit must leave the previously saved character unchanged.

## 6. Catalog and Business Rules

The authoritative option identifiers are defined in [Customization Catalog](./customization-catalog.md).

| Category | Number of options |
|---|---:|
| Class | 8 |
| Ancestry | 6 |
| Background | 6 |
| Weapon | 8 |
| Artifact | 8 |
| Personality | 8 |
| Aura | 8 |
| Companion | 8 |
| Motivation | 8 |

The character also has a user-defined name.

### 6.1. Approved Catalog Changes

The following changes are part of the approved six-stage specification:

| Category | Previous value | Approved value | Approved identifier |
|---|---|---|---|
| Artifact | Emerald Amulet / Amuleto de Esmeralda | Arcane Seal / Selo Arcano | `arcane-seal` |
| Companion | Dragonling / Filhote de Dragão | Dragon / Dragão | `dragon` |

Previously approved artifact replacements remain:

- Shadow Crown / Coroa Sombria — `shadow-crown`.
- Chaos Orb / Orbe do Caos — `chaos-orb`.

The artifact category contains eight options.

The artifact `none` option is not available.

The companion category retains eight options, including `none`.

### 6.2. Motivation Catalog

Motivation is a new required customization category introduced in Step 05 — Journey.

Its approved options are:

| Identifier | English | Portuguese |
|---|---|---|
| `protection` | Protection | Proteção |
| `freedom` | Freedom | Liberdade |
| `justice` | Justice | Justiça |
| `redemption` | Redemption | Redenção |
| `glory` | Glory | Glória |
| `knowledge` | Knowledge | Conhecimento |
| `revenge` | Revenge | Vingança |
| `adventure` | Adventure | Aventura |

Motivation describes the character's primary reason for beginning an adventure.

It does not introduce combat mechanics, statistics, or gameplay restrictions.

### 6.3. Business Rules

- **BR-01:** Each authenticated user's `user_id` is unique in the `characters` table and references the authentication provider's user identifier.
- **BR-02:** Class and all eight enumerated customization fields must match approved catalog slugs. Every category requires an explicit selection; only companion supports `none`.
- **BR-03:** Character name length is validated at the API and database boundaries. Character names are safely rendered.
- **BR-04:** No class and customization combination is prohibited by gameplay restrictions.
- **BR-05:** Character operations derive record ownership from the authenticated session rather than accepting an arbitrary user identifier from the request.
- **BR-06:** Editing updates an existing character instead of creating a duplicate.
- **BR-07:** Randomization, when available, modifies only an unsaved draft until the user explicitly saves.
- **BR-08:** Character-sheet exports contain fictional character details and do not require storing generated PNG files on the server.
- **BR-09:** Class illustrations do not determine or persist a sex or gender attribute.
- **BR-10:** Introducing new option slugs requires coordinated catalog, frontend, API validation, database compatibility, and test updates.
- **BR-11:** Translating interface labels must not change database identifiers or break validation.
- **BR-12:** Character deletion does not automatically delete the user's authentication account.
- **BR-13:** The final review does not create or update a character until the user explicitly saves.
- **BR-14:** The complete character record must include motivation after the new data model is deployed.
- **BR-15:** Previously saved records must be handled safely when catalog identifiers or required fields change.
- **BR-16:** Export generation must use saved character data rather than unsaved creator drafts.
- **BR-17:** Character export formats may use different presentation layouts but must preserve the same underlying character information.

### 6.4. Implementation Alignment

The revised catalog, shared types, API input validation, and Motivation field are implemented in the feature branch and supported by automated tests. The protected create, read, update, and delete paths have been exercised manually.

Before release:

1. Verify that the target Supabase environment has the reviewed migrations and current catalog constraints.
2. Confirm older saved records remain readable and safely editable.
3. Run negative cross-account checks for read, update, and delete at both API and RLS boundaries.
4. Repeat authentication, integration, and migration checks in the production-like environment.

Existing records must not be deleted or silently overwritten because a catalog identifier changed.

## 7. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 — Authentication | Use Supabase Auth for password handling, verification, sessions, and recovery. Do not implement proprietary password storage or recovery tokens. |
| NFR-02 — Authorization | Require authenticated access for character operations and enforce ownership in API logic and database Row Level Security policies. |
| NFR-03 — Least privilege | Use user-scoped database access for ordinary character operations. Never expose privileged credentials through frontend code or Git history. |
| NFR-04 — Abuse prevention | Configure suitable authentication rate limits and additional automated-abuse protections where warranted. |
| NFR-05 — Safe failure | Use safe authentication messages, generic server errors, and logs that exclude raw passwords and authentication tokens. |
| NFR-06 — Validation | Validate API inputs, including types, lengths, character names, and allowed option slugs. Render user-provided content safely. |
| NFR-07 — Transport | Require HTTPS in production, appropriately restrictive CORS, suitable security headers, and recommended session protections. |
| NFR-08 — Privacy | Minimize personal data collection and document account-data access, correction, and deletion procedures before public registration. |
| NFR-09 — Accessibility | Support keyboard navigation, visible focus, labeled inputs, readable fonts, adequate contrast, accessible error messages, and reduced motion. |
| NFR-10 — Responsiveness | Provide a complete usable experience on desktop and mobile without horizontal scrolling or unreadably small controls. |
| NFR-11 — Maintainability | Keep frontend, API, authentication, and persistence concerns separated. Maintain stable identifiers and accurate documentation. |
| NFR-12 — Reliability | Support loading, empty, success, and error states. Avoid accidental draft or saved-character loss. |
| NFR-13 — Testability | Include automated checks for authentication, validation, ownership, CRUD, record uniqueness, the six-stage creator, critical frontend flows, and both PNG export formats. |
| NFR-14 — CI/CD | Use GitHub Actions to run applicable builds, linting, tests, and configured security checks before integration or deployment. |
| NFR-15 — Production email | Configure suitable production email delivery for account verification and password recovery before public registration. |
| NFR-16 — Security review | Test cross-user access, missing or expired credentials, spoofed identifiers, invalid catalog values, and accidental secret exposure before public release. |
| NFR-17 — Visual consistency | Maintain the approved fixed dark palette, pixel typography, and retro interface design across all application screens and exported sheets. |
| NFR-18 — Motion safety | Respect reduced-motion preferences and prevent transitions or overlays from blocking later interactions. |
| NFR-19 — Localization | Support Portuguese and English for user-facing interface text while retaining stable language-independent stored values. |
| NFR-20 — Original artwork | Use original or appropriately licensed illustration assets and avoid reproducing protected third-party characters, interfaces, and game artwork. |
| NFR-21 — Export quality | Generate PNG files at the exact approved pixel dimensions with readable text and artwork. |
| NFR-22 — Export privacy | Exclude authentication tokens, passwords, account identifiers, and unrelated personal information from every export format. |
| NFR-23 — Data compatibility | Apply catalog and schema changes through reviewed migrations that protect existing character records. |
| NFR-24 — Draft preservation | Preserve current creator selections during stage navigation, language changes, validation failures, and recoverable save failures. |

## 8. Detailed Acceptance Scenarios

### 8.1. Start Screen

- A new visitor sees the Adventure Files title screen before authentication.
- The start screen displays the title, illustration, and "PRESS START" only.
- The title and prompt are independent of the illustration asset.
- Desktop and mobile artwork preserve the intended composition.
- The "PRESS START" prompt blinks at the approved relaxed speed.
- Clicking, tapping, or pressing Enter initiates the experience.
- Repeated input does not trigger duplicate transitions.

### 8.2. Screen Transition

- The start screen closes toward the center.
- A brief black-screen pause follows.
- Authentication is revealed by an iris opening from the center outward.
- The transition works on desktop and mobile.
- Reduced-motion users are not forced through the complete animation.
- No invisible animation layer blocks the authentication form afterward.

### 8.3. Authentication

- The login window appears against a black background.
- The interface uses the approved compact retro styling.
- Email and password fields are clearly identified.
- The user can switch between sign-in and registration.
- The PT/EN selector is available in the authentication window.
- Registration requests only the approved account fields.
- Email confirmation works according to the configured provider flow.
- Invalid login credentials receive safe feedback.
- Password-recovery requests do not reveal whether an email exists.
- Unauthenticated users cannot access protected character data.

### 8.4. Character Creation

- An authenticated user without a character can enter the creator.
- The default class illustration shows all eight classes.
- Hovering or focusing Mage does not change the illustration or selected value.
- Activating Mage displays its class-specific illustration.
- Moving the pointer away does not change the confirmed choice.
- Selecting another class updates the confirmed choice and artwork.
- All eight approved classes are available.
- All catalog options use valid backend identifiers.
- The creator follows the six approved stages.
- The progress indicator displays the correct stage out of six.
- Back/Next preserves the current draft.
- Switching between Portuguese and English does not discard selections.
- Step 02 provides ancestry and background.
- Step 03 provides weapon and artifact.
- Step 04 provides personality and aura.
- Step 05 provides companion and motivation.
- The sixth stage is exclusively dedicated to final review.
- Every required category has an explicit selected value.
- The artifact category provides eight options and does not include `none`.
- The companion category includes the selectable value `none`.
- The motivation category provides eight approved options.
- Invalid data is rejected without deleting the user's draft.
- Saving requires an explicit action.
- Failed save requests provide recoverable feedback.

### 8.5. Character Persistence

- Saving creates one character associated with the authenticated account.
- Repeated creation cannot produce multiple rows for the same user.
- A returning user sees their saved character.
- Editing starts with the current saved selections.
- Canceling an edit does not modify the saved record.
- Saving an edit updates the existing character.
- The saved record contains the motivation field.
- Previously stored data is handled safely during catalog and schema changes.
- Deleting requires confirmation.
- After deletion, the account remains active and can create another character.

### 8.6. Character Sheet Export

The application supports two downloadable PNG formats.

**PNG Story/Status**

- The image dimensions are exactly 1080 × 1920 pixels.
- The layout is optimized for vertical social-media stories.
- It can be used for Instagram Stories and WhatsApp Status.
- Important character information remains visible and readable.
- The image can be downloaded as a valid PNG file.

**PNG Portrait**

- The image dimensions are exactly 1080 × 1350 pixels.
- The layout is optimized for portrait social-media posts.
- Important character information remains visible and readable.
- The image can be downloaded as a valid PNG file.

**Shared export requirements**

- All formats use the same saved character data.
- All ten character values are represented.
- The approved illustration is included.
- Export generation does not modify saved character data.
- Private account credentials and authentication data are excluded.
- Direct social-media publishing integrations are not required.

### 8.7. Authorization

- User A cannot read User B's character.
- User A cannot update User B's character.
- User A cannot delete User B's character.
- Modifying request URLs or payload identifiers does not bypass ownership checks.
- Anonymous requests to protected endpoints are rejected.
- Invalid or expired authentication tokens are rejected.
- Database Row Level Security enforces record isolation.

### 8.8. Responsive and Accessible Interaction

- All primary flows work on desktop and mobile.
- Users can navigate forms and the character creator with a keyboard.
- Focus indicators are visible.
- Hover-only information has an accessible alternative.
- Touch controls remain usable on narrow screens.
- Pixel typography remains readable.
- Reduced-motion settings are respected.
- The interface remains usable when animations are disabled.
- Paired customization groups appear side by side on desktop.
- Desktop dividers remain subtle and do not interfere with controls.
- Mobile customization groups stack vertically without desktop dividers.
- Export controls remain accessible on mobile devices.

### 8.9. Production Readiness

- Frontend and API builds succeed.
- Automated tests pass.
- Lint checks pass.
- No credentials or privileged keys are committed.
- Authentication and email verification work in production.
- Password recovery works in production.
- Database authorization works in the deployed environment.
- New catalog identifiers are accepted by the API and database.
- Existing character data remains compatible with approved migrations.
- The complete six-stage creator works with the backend.
- Saved-character creation, editing, and deletion are validated.
- Both PNG export formats are generated successfully.
- Documentation accurately reflects the released functionality.

### 8.10. Dashboard Extras and Account-Deletion Acceptance

- Empty state: Create / Extras / Delete Account / Sign Out, PT/EN, in the intended visual order.
- Saved state: Sign Out / Edit / Export / Delete / Extras, with equal-width desktop actions and readable keyboard/touch navigation on mobile.
- Extras opens and closes by button and Escape, restores focus, and shows four compact sections: about, creator credits, inspirations, and support email/GitHub (no LinkedIn and no in-app AI section). On desktop, fit these without vertical scrolling while retaining accessible scrolling on short/mobile viewports.
- Export still produces only Story and Portrait PNGs; character deletion still requires its existing confirmation and does not remove the account.
- Account deletion requires the current password and confirmation phrase, rejects invalid/expired tokens and wrong identities, uses only the authenticated user ID on the server, and exposes no privileged key or secret.
- With isolated test accounts, verify successful removal of both Auth user and saved character, unsuccessful attempts leave both unchanged, and failure paths never misreport success.
- Public release must remain blocked while the Render-only secret or hosted account-deletion verification is missing.

## 9. Implementation and Delivery Priorities

The intended delivery sequence is:

### Phase 1 — Technical Foundation

- Frontend and backend structure.
- Authentication integration.
- PostgreSQL schema.
- Row Level Security.
- Character API.
- Automated test foundations.

### Phase 2 — Start Experience

- Adventure Files branding.
- Original desktop and mobile artwork.
- "PRESS START" interaction.
- Retro closing and opening transition.

### Phase 3 — Authentication Redesign

- Minimalist retro window.
- Fixed black background.
- Consistent pixel typography.
- Registration and recovery styling.
- PT/EN localization.

### Phase 4 — Six-Stage Character Creator

- Update the approved catalog identifiers.
- Implement the six-stage guided workflow.
- Preserve the existing class illustrations and selection behavior.
- Reorganize Equipment into Weapon and Artifact.
- Implement Essence with Personality and Aura.
- Implement Journey with Companion and Motivation.
- Implement a separate Final Review stage.
- Preserve selections across stage navigation.
- Integrate explicit character saving.
- Validate the complete workflow on desktop and mobile.

### Phase 5 — Backend and Data Alignment

- Update API validation.
- Update shared character types.
- Add the motivation field.
- Align database constraints with the approved catalog.
- Review existing saved character data.
- Apply safe database migrations.
- Verify ownership and record uniqueness.
- Extend frontend and backend tests.

### Phase 6 — Character Management

- Final illustrated character dashboard.
- Display all saved customization fields.
- Edit character.
- Delete character with confirmation.
- Returning-user experience.

### Phase 7 — Character Sheet Export

- Shared export data preparation.
- Character illustration integration.
- PNG Story/Status 1080 × 1920 generation and download.
- PNG Portrait 1080 × 1350 generation and download.
- Export readability and privacy tests.

### Phase 8 — Final Verification and Zero-Budget Public Demo

**Verified:** Developer-reported staged desktop/mobile QA, keyboard/reduced-motion checks, email/code recovery, six-stage creator, character CRUD, PT/EN and both PNG exports; local automated tests and hosted migration/RLS inspection also passed. The November 3–4 hosted snapshot showed both migrations, four owner-only RLS policies and 2 characters with 0 missing Motivation.

**Still required before making registration public:** dependency/secret-history checks, suitable security headers, public URL/HTTPS/Auth origin review, abuse protection/rate-limit decision, minimal account-data correction/deletion information, PR review, and final deployed smoke tests. These gates are tracked in [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24) and the [free portfolio release runbook](./free-portfolio-release.md).

The delivery objective is a personal, free-to-access **portfolio demonstration**, not a paid product or an uptime-guaranteed service. Vercel Hobby, Render Free, and Supabase Free may be reused in one deliberately documented demo environment; a second paid production environment is not an MVP requirement. Existing limits and provider terms remain applicable.

**Scope freeze:** Do not reintroduce PDF, Google OAuth, playable RPG features, additional character slots, new artworks, or monetization into this release. Previously completed product/security tests should be referenced rather than needlessly repeated.

## 10. Deferred or Excluded Features

The initial release excludes:

- Playable RPG gameplay.
- Combat.
- Quests.
- Level progression.
- Skills and stat-management systems.
- Multiplayer.
- Multiple saved characters per account.
- Public character sharing.
- Direct social-media publishing integrations.
- PDF character-sheet export (removed from scope on November 1, 2026).
- Social profiles or feeds.
- Composite avatar generation.
- Detailed body or facial customization.
- Selectable sex or gender attributes.
- A light/dark theme switch.
- A custom administration dashboard.

Google OAuth and additional account enhancements may be reconsidered after the initial email/password experience is stable.

These features must not be introduced into the initial scope without an explicit product decision.

## 11. Related Documents

- [Project Overview](./project-overview.md)
- [Product Experience](./product-experience.md)
- [Customization Catalog](./customization-catalog.md)
- [Architecture](./architecture.md)
- [Data Model](./uml/data-model.md)
- [Use Case Diagram](./uml/use-cases.puml)
- [Save Character Sequence](./uml/save-character-sequence.puml)

## 12. Requirements Management

Requirements should remain synchronized with:

- Approved product decisions.
- Existing backend validation.
- Database constraints and migrations.
- The customization catalog.
- Frontend interaction behavior.
- Automated tests.
- Implementation status.
- Character export specifications.

Changes to established scope should be reviewed before implementation.

The six-stage creator and two PNG export formats are implemented on the feature branch. Local manual functional, responsive, keyboard-accessibility, reduced-motion, and error-state homologation was completed on November 2, 2026 with no reported issues; that day's local checks passed 146 frontend and 97 API tests. The latest November 3 GitHub Actions checks passed **167 frontend tests in 18 files, 97 API tests, ESLint/builds, and local database security tests**. The developer reported successful staging recovery email/OTP and mobile checks; deployed API ownership isolation, migration history, production email, monitoring, dependency auditing, and final review remain release gates (see [issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24)).

Adventure Files should prioritize a complete, secure, accessible, and visually coherent character-creation experience over unnecessary feature expansion.