# Adventure Files — Project Overview

- **Status:** In development
- **Product name:** Adventure Files
- **Product type:** Full-stack RPG-inspired character creator
- **Development environment:** GitHub Codespaces (browser-based); Cloud Shell optional
- **Repository:** AlexandroLeao/rpg-character-creator

## 1. Project Vision

Adventure Files is a personal full-stack development project that combines practical software engineering with the visual identity of classic adventure games and early computer interfaces.

The application allows users to create an account, design a fictional RPG character, save their selections, and export a character sheet in two PNG formats: Story/Status and Portrait.

Although its presentation resembles a retro video game, Adventure Files is not a playable RPG.

The experience is intentionally designed to feel like entering an old adventure game: a title screen introduces the world, a compact computer-inspired interface handles authentication, and a guided character creator allows users to assemble their own adventurer.

The project demonstrates:

- Frontend development with React and TypeScript.
- Backend development with Node.js and Express.
- Authentication and session management.
- REST API integration.
- PostgreSQL data persistence.
- User-specific authorization and data protection.
- Responsive interface design.
- Pixel-art-inspired visual design.
- Character customization.
- PNG Story/Status and Portrait export.
- Automated testing and GitHub workflows.

The final result should be technically meaningful, visually distinctive, intuitive, and small enough to remain maintainable as a personal portfolio project.

## 2. Core Design Philosophy

Adventure Files follows five principles.

### 2.1. Minimalism

The application should contain only the interface elements necessary for each task.

Avoid unnecessary descriptions, oversized forms, excessive decorative elements, and competing visual effects.

Users should understand what to do without reading lengthy instructions.

### 2.2. Retro game identity

The visual experience draws inspiration from classic handheld adventures, early fantasy RPGs, and vintage computer interfaces.

Its defining elements include:

- Original, simplified pixel-art illustrations.
- Pixel-style typography.
- A predominantly black and dark-green visual environment.
- Cream and mint-green interface accents.
- Compact retro computer windows.
- Slightly rounded rectangular borders.
- Minimal, deliberate animations.
- Clear selections and readable controls.

References should inspire the original visual language without reproducing copyrighted artwork or identifiable game assets.

### 2.3. Fixed visual identity

Adventure Files uses one carefully designed dark theme.

A light/dark theme switch is not part of the product.

The visual palette should remain consistent across the title screen, authentication interface, character creator, dashboard, and exported character sheets.

### 2.4. Accessibility and responsiveness

The experience must work on desktop and mobile devices.

Retro styling must not prevent users from reading text, navigating with a keyboard, or understanding interactive controls.

Touch targets, focus indicators, error messages, and readable text are essential.

Animations should respect reduced-motion preferences.

### 2.5. Personality through interaction

The project should feel like a small adventure rather than a conventional account-management application.

However, its visual identity must support usability instead of adding complexity to simple actions.

## 3. Approved User Journey

The approved experience follows this sequence:

### Stage 1 — Start Screen

Visitors first see the Adventure Files title screen.

The screen contains:

- The Adventure Files title.
- An original fantasy pixel-art scene.
- A small, blinking "PRESS START" prompt.

The main illustration shows a group of eight adventurers facing a distant fantasy environment.

The scene establishes the project's adventurous atmosphere without making the screen visually crowded.

The title and "PRESS START" must be separate interface elements from the background illustration so they can be styled and animated independently.

Desktop and mobile use appropriately composed artwork.

Users can continue by:

- Clicking or tapping the screen.
- Pressing Enter.

The title screen does not contain authentication forms, a theme switch, or a language selector.

### Stage 2 — Retro Screen Transition

After starting, the title screen transitions into the authentication interface.

The approved animation uses an old-game-inspired iris effect:

1. The visible title screen closes toward the center.
2. The screen becomes briefly black.
3. The authentication screen opens from the center outward.

The animation should feel deliberate and nostalgic rather than abrupt.

Reduced-motion preferences must be respected.

### Stage 3 — Authentication

The authentication interface resembles a compact window on an old computer screen.

The surrounding background is black.

The window uses:

- A minimal layout.
- Slightly rounded borders.
- Pixel-style text.
- The established green, cream, and dark palette.
- Small, restrained visual imperfections inside the window.

The interface provides:

- Sign in.
- Create account.
- Password recovery.
- Portuguese/English language selection.

The PT/EN control is located in the upper-right area of the authentication interface.

It does not appear on the title screen.

Account creation and character creation are separate processes.

Registration collects the minimum required account information:

- Display name.
- Email address.
- Password and password confirmation.

Authentication is managed by Supabase Auth.

Email confirmation and password recovery follow the configured authentication flow.

### Stage 4 — Authenticated Character Area

After signing in, the application checks whether the user already has a saved character.

If no character exists, the user can begin creating one.

If a character exists, the user sees their saved character dashboard.

The authenticated area must provide a clear way to sign out.

The initial product supports at most one saved character per account.

### Stage 5 — Character Creation

Character creation follows the implemented six-stage guided flow.

Five stages contain the character's customization fields. The sixth stage is reserved for reviewing and saving the character.

The frontend implements all six stages, including Essence, Journey, and a dedicated Final Review with explicit Save.

The compact creator header displays progress (01 / 06 through 06 / 06) on the left and PT/EN on the right.

On desktop, paired selection categories use the approved compact layout with subtle dividers between option grids. On mobile, categories stack vertically without those dividers.

#### Step 01 / 06 — Identity

The user chooses one class and enters a character name.

The available classes are:

1. Warrior
2. Paladin
3. Mage
4. Rogue
5. Ranger
6. Druid
7. Cleric
8. Bard

The class-selection illustration follows these interaction rules:

- Before any class is selected, the illustration shows the complete group of eight adventurers.
- Each class-specific illustration represents two different-looking adventurers.
- Hovering over a class does not change the displayed illustration.
- Keyboard focus alone does not change the selected class.
- Clicking or activating a class selects it and displays its corresponding illustration.
- The selected class remains active until another class is explicitly chosen.
- Selecting another class updates the active option and illustration.

Character names contain 2–32 characters after trimming.

The illustration represents the selected class, not an avatar or gender-selection system.

#### Step 02 / 06 — Origins

The user chooses:

- One ancestry.
- One background.

Both selections are required. These options describe the character's fictional past.

#### Step 03 / 06 — Equipment

The user chooses:

- One weapon.
- One artifact.

Both selections are required. No artifact `none` option is offered.

The approved artifact catalog includes Arcane Seal (`arcane-seal`), Shadow Crown (`shadow-crown`), and Chaos Orb (`chaos-orb`).

Companion is moved out of this stage.

#### Step 04 / 06 — Essence

The user chooses:

- One personality.
- One aura.

Both selections are required.

#### Step 05 / 06 — Journey

The user chooses:

- One companion.
- One motivation.

Both selections require an explicit choice.

Companion includes `none`, representing a character without a companion. Dragon (`dragon`) replaces Dragonling (`dragonling`) in the approved catalog.

Motivation describes why the character starts an adventure. Eight short motivations are defined in the customization catalog.

#### Step 06 / 06 — Final Review

This stage does not introduce any new customization fields.

The review displays all ten values: name, class, ancestry, background, weapon, artifact, personality, aura, companion, and motivation.

Users can return to any previous stage to revise their choices without losing the draft.

Saving occurs only after an explicit confirmation. Failed requests preserve the draft and must not silently create duplicates.

### Stage 6 — Saved Character Dashboard

After saving, the character becomes available in the authenticated dashboard.

The dashboard presents:

- Character name and class illustration.
- All saved customization fields, including motivation.
- Edit character.
- Delete character.
- Export character sheet.
- Sign out.

Editing reopens the saved values in the creator. Deleting requires explicit confirmation and does not delete the user account. Signing out does not delete the character.

### Stage 7 — Character Sheet Export

Users can export their saved character in two formats:

| Format | Size | Purpose |
|---|---|---|
| PNG Story/Status | 1080 × 1920 | Instagram Stories and WhatsApp Status |
| PNG Portrait | 1080 × 1350 | Social posts and general sharing |

PDF export was removed from the product roadmap by the November 1, 2026 scope decision.

Each format may use a dedicated layout, but all derive from the same saved character data.

The exported character sheet includes the illustration, name, class, ancestry, background, weapon, artifact, personality, aura, companion, and motivation.

Exports must not reveal passwords, authentication tokens, internal identifiers, or unrelated account information.

Direct social-media publishing integrations are not required for the initial release.

## 4. Character Customization Scope

The customization catalog defines the supported values and stable stored identifiers. Frontend, API, and database changes for the six-stage flow have been implemented; production compatibility and security verification remain release checks.

The initial release includes:

| Category | Available options |
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

The character also has a user-provided name.

See [Customization Catalog](./customization-catalog.md) for the canonical values.

Stored identifiers must remain stable and consistent with backend validation.

The interface may translate display labels into Portuguese or English without changing their database identifiers.

The product does not require users to choose a sex, gender, or gender identity.

Character illustrations should represent visual variety without making identity assumptions or restricting customization choices.

## 5. Authentication and Data Ownership

Adventure Files distinguishes between an account and its saved character.

### User account

The account manages:

- Authentication credentials.
- Login sessions.
- Email confirmation.
- Password recovery.
- Ownership of application data.

Supabase Auth manages passwords and authentication tokens.

### Character record

The character record contains only the fictional character information required by the application.

Each authenticated account may own one saved character.

A user can:

- Create their character.
- Retrieve their saved character.
- Update their selections.
- Delete their character.
- Export their character data.

Deleting a character must not automatically delete the account.

The account remains available for creating another character afterward.

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS |
| Backend API | Node.js, Express, TypeScript |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Authorization | Row Level Security and authenticated API checks |
| Frontend tests | Vitest and React Testing Library |
| API tests | Vitest and Supertest |
| Version control | Git and GitHub |
| Continuous integration | GitHub Actions |
| Development environment | GitHub Codespaces (browser-based); Cloud Shell optional |

Production hosting and deployment details must be validated during the deployment phase.

## 7. Current Implementation Status

Adventure Files is in active development on a feature branch. Core character creation, management, and both exports are implemented. Local manual UX/accessibility/security-flow homologation is complete; controlled staging authorization, operational, and production checks remain.

### Implemented

- React/TypeScript frontend, Express/TypeScript API, Supabase Auth, PostgreSQL storage, and RLS.
- Responsive Adventure Files start screen with original desktop/mobile artwork and retro transitions.
- Email/password account flows, session handling, and PT/EN localization.
- All six creator stages with required selections, the revised artifact/companion catalog, Personality, Aura, and Motivation.
- Dedicated Final Review, explicit Save, draft preservation, and authenticated character persistence.
- Illustrated My Character dashboard, saved-character editing, and confirmation-based deletion.
- Browser-generated PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350) downloads using the saved record and class artwork.
- Automated frontend, API, and database security checks with GitHub Actions.

On November 2, 2026, local manual QA reported no issues across the start screen, authentication, six-stage flow, saved-character CRUD, PNG exports, responsive layouts, PT/EN, keyboard accessibility, reduced-motion behavior, and recoverable errors. Two test accounts were exercised without observed cross-account mixing. Local checks passed **146 frontend tests (17 files)** and **97 API tests (8 files)**, plus lint and builds. The two opt-in Express/Supabase integration tests are intentionally skipped in the standard API suite and were run previously against isolated local Supabase.

**November 3 update:** the most recent feature-branch CI passed **167 frontend tests (18 files)**, 97 API tests, lint/builds, and local database RLS tests. Vercel reported the latest staging deployment as ready, and the developer reported successful recovery email/OTP and responsive QA. These are staging/CI observations, not an independently verified deployed API authorization or production-readiness assessment.

### Remaining Release Validation

1. Recheck negative cross-account API/RLS behavior and migration/legacy-data compatibility in the intended staging environment, using disposable users.
2. Verify the configured Vercel `/api` rewrite to the Render staging backend, HTTPS, restricted CORS, monitoring, and separate production routing; configure production-ready Auth/email settings before public release.
3. Repeat complete sign-up/confirmation/recovery, save/edit/delete, and both PNG export flows on the hosted preview.
4. Review dependency security and deployment documentation, rerun CI, and merge draft PR #23 only after the release gates pass (tracked in [issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24)).

The approved scope no longer includes a PDF download. Additional illustration variants for individual customization choices remain deferred.

Implemented screens and passing tests do not replace production authorization or deployment verification.

## 8. Security and Privacy Requirements

Security is part of the project scope from the beginning.

The application must:

- Use managed authentication rather than storing passwords in application tables.
- Validate authentication tokens on protected API requests.
- Derive character ownership from the authenticated user.
- Enforce user isolation with database Row Level Security.
- Validate character inputs against the approved catalog.
- Avoid exposing Supabase service-role credentials in the browser.
- Keep environment secrets outside version control.
- Restrict cross-origin API access appropriately.
- Avoid revealing account existence through password-recovery responses.
- Provide clear confirmation before destructive user actions.
- Prevent users from accessing or modifying another user's character.
- Support appropriate account-data management and deletion procedures.

Public deployment requires a review of authentication, error handling, abuse prevention, and data protection.

## 9. Responsive Experience

Desktop and mobile share the same functionality and design language.

However, layouts may adapt to available screen space.

### Desktop

- A spacious title-screen composition.
- Original landscape-oriented illustration.
- Centered retro interface windows.
- Character preview and options arranged for comfortable navigation.

### Mobile

- A dedicated, vertically composed title-screen illustration.
- Readable title and "PRESS START" prompt.
- Compact authentication forms.
- Touch-friendly character options.
- Character preview adapted to narrow screens.
- Full access to navigation, editing, and both PNG exports.

The mobile experience must remain fully functional rather than acting as a simplified demo.

## 10. Out of Scope

The initial release will not include:

- Playable combat.
- Character levels or experience progression.
- Quests or exploration mechanics.
- Multiplayer.
- Multiple saved characters per account.
- A public character gallery.
- Social features.
- Dynamic sprite composition.
- Detailed avatar customization.
- A gender-selection system.
- A light/dark theme switch.
- A custom administrative dashboard.

Additional authentication providers, advanced account settings, and optional enhancements can be considered after the initial release.

## 11. Definition of Done

Adventure Files is ready for its initial completed release when:

1. The start screen works correctly on desktop and mobile.
2. The retro transition works smoothly and respects reduced-motion preferences.
3. Account registration, verification, sign-in, recovery, and sign-out work.
4. Users can select Portuguese or English in the interface.
5. The complete six-stage character creator is functional.
6. Class artwork and selection states respond correctly to explicit user choices.
7. Users can review and revise their draft before saving.
8. Each account can store no more than one saved character.
9. Users can view, edit, and delete their own character.
10. Both approved PNG exports include the character illustration and complete character details.
11. Users cannot access another account's character.
12. Responsive layouts and keyboard accessibility are verified.
13. Automated tests and CI checks pass.
14. Production authentication, API, database, and deployment flows work correctly.
15. Documentation accurately describes the implemented application and its limitations.

## 12. Development Roadmap

The project should advance through small, reviewable stages.

### Phase 1 — Foundation

- Repository structure.
- Frontend and backend setup.
- Authentication and database foundations.
- Automated testing.

### Phase 2 — Adventure Files Start Screen

- Product title and visual identity.
- Responsive title-screen artwork.
- "PRESS START" interaction.
- Retro transition into authentication.

### Phase 3 — Authentication Experience

- Minimal retro login window.
- Registration and password recovery.
- PT/EN localization.
- Responsive and accessible styling.

### Phase 4 — Character Creation

- Six-stage creator with a review-only final step.
- Class-specific illustrations and persistent selection.
- Catalog-based option selection.
- Draft navigation and review.
- Character save integration.

### Phase 5 — Character Management

- Illustrated dashboard.
- Edit character.
- Delete character.
- Persistent user-specific data.

### Phase 6 — Character Sheet Export

- Shared character-sheet data and original illustration integration.
- PNG Story/Status 1080 × 1920 generation and download.
- PNG Portrait 1080 × 1350 generation and download.

### Phase 7 — Finalization

- Responsive refinements.
- Accessibility checks.
- Security review.
- Integration testing.
- Production deployment.
- Portfolio documentation.

The project must prioritize completed, working features over unnecessary expansion.

## 13. Working Agreement

Code, technical documentation, commit messages, pull-request titles, and pull-request descriptions should use English.

The user-facing application will support both Portuguese and English.

Approved visual decisions should remain consistent unless explicitly reconsidered.

Development should use:

- Focused Git branches.
- Small commits.
- Pull-request reviews.
- Automated checks.
- Clear documentation updates.

The implementation should be guided by:

- [Requirements](./requirements.md)
- [Product Experience](./product-experience.md)
- [Customization Catalog](./customization-catalog.md)
- [Architecture](./architecture.md)

Adventure Files should remain a focused, technically sound, and visually memorable full-stack portfolio project.