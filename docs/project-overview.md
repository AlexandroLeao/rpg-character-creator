# Adventure Files — Project Overview

- **Status:** In development
- **Product name:** Adventure Files
- **Product type:** Full-stack RPG-inspired character creator
- **Development environment:** Google Cloud Shell Editor
- **Repository:** AlexandroLeao/rpg-character-creator

## 1. Project Vision

Adventure Files is a personal full-stack development project that combines practical software engineering with the visual identity of classic adventure games and early computer interfaces.

The application allows users to create an account, design a fictional RPG character, save their selections, and export a character sheet as a PDF.

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
- PDF generation.
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

The visual palette should remain consistent across the title screen, authentication interface, character creator, dashboard, and PDF design.

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

The initial product supports exactly one saved character per account.

### Stage 5 — Character Creation

Character creation uses a guided, four-stage interface.

The goal is to make customization approachable, visual, and easy to review.

Only a small group of decisions appears at each stage.

#### Step 1 — Class and Name

The user chooses a class and enters a character name.

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
- Hovering over or focusing a class temporarily previews its artwork.
- Each class preview represents two different-looking adventurers rather than forcing a single character appearance.
- Moving away without selecting a class restores the group illustration.
- Clicking or otherwise confirming a class keeps that class selected.
- The chosen class remains visible as the active selection.
- Selecting another class replaces the previous selection.

The illustration is a visual representation of the class, not a separate avatar or gender-selection system.

#### Step 2 — Origins

The user chooses:

- Ancestry.
- Background.

These options establish the character's fictional origin and history.

#### Step 3 — Equipment

The user chooses:

- Weapon.
- Artifact.
- Companion.

Optional "none" values are available where defined in the customization catalog.

#### Step 4 — Essence and Review

The user chooses:

- Personality.
- Aura.

The application then presents a review of the complete character.

The user can navigate backward, change previous decisions, and return to the review without losing the current draft.

Saving occurs only after an explicit confirmation.

### Stage 6 — Saved Character Dashboard

After saving, the character becomes available in the authenticated dashboard.

The dashboard presents:

- Character name.
- Character class.
- Character illustration.
- All saved customization fields.
- Edit character.
- Delete character.
- Export PDF.
- Sign out.

Editing opens the existing character data for modification.

Deleting requires explicit confirmation.

Signing out must not delete the saved character.

### Stage 7 — PDF Export

Users can export their saved character as a printable PDF.

The document should contain:

1. The character's pixel-art-inspired illustration near the top.
2. The character's name.
3. The selected class.
4. Ancestry.
5. Background.
6. Weapon.
7. Artifact.
8. Companion.
9. Personality.
10. Aura.

The PDF should share the visual identity of Adventure Files while remaining readable and suitable for printing.

PDF generation must not expose private account credentials or unrelated personal information.

## 4. Character Customization Scope

The backend customization catalog defines the accepted values and stored identifiers.

The initial release includes:

| Category | Available options |
|---|---:|
| Class | 8 |
| Ancestry | 6 |
| Background | 6 |
| Weapon | 8 |
| Artifact | 9 |
| Personality | 8 |
| Aura | 8 |
| Companion | 8 |

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
| Development environment | Google Cloud Shell Editor |

Production hosting and deployment details must be validated during the deployment phase.

## 7. Current Implementation Status

The repository already includes several working foundations.

### Implemented foundations

- React and TypeScript frontend.
- Express and TypeScript backend.
- Supabase authentication integration.
- Authentication session handling.
- Protected character API routes.
- PostgreSQL character storage and Row Level Security.
- Character validation.
- Basic authenticated character dashboard.
- Adventure Files start screen.
- Separate desktop and mobile start-screen artwork.
- Animated "PRESS START" interaction.
- Retro transition into authentication.
- Automated frontend and backend test foundations.
- GitHub Actions workflows.

### Planned or incomplete product features

- Final compact authentication-window redesign.
- Consistent PT/EN localization throughout the interface.
- Character creation wizard.
- Class illustration previews.
- Character draft management.
- Character editing and deletion controls in the frontend.
- Final illustrated character dashboard.
- Illustrated PDF export.
- End-to-end production deployment validation.

The existing backend API provides a foundation for character operations, but the corresponding frontend experience still needs to be completed.

This distinction is important: approved designs and documented requirements do not necessarily mean that their implementations are finished.

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
- Full access to navigation, editing, and PDF export.

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
5. The complete four-stage character creator is functional.
6. Class previews behave correctly before and after selection.
7. Users can review and revise their draft before saving.
8. Each account can store no more than one saved character.
9. Users can view, edit, and delete their own character.
10. The exported PDF includes the character illustration and complete character details.
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

- Four-stage creator.
- Class previews and illustrations.
- Catalog-based option selection.
- Draft navigation and review.
- Character save integration.

### Phase 5 — Character Management

- Illustrated dashboard.
- Edit character.
- Delete character.
- Persistent user-specific data.

### Phase 6 — PDF Export

- Character sheet layout.
- Illustration integration.
- PDF generation and download.

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