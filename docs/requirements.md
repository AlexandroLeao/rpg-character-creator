# Adventure Files — System Requirements

- **Project:** Adventure Files
- **Document type:** Functional and non-functional requirements
- **Status:** Approved product specification; implementation in progress

## 1. Purpose and Scope

Adventure Files is a personal full-stack web application for creating, managing, and exporting fictional RPG characters.

The application combines:

- Account registration and authentication.
- A minimalist retro game-inspired interface.
- Original pixel-art illustrations.
- A guided character creation experience.
- Persistent character data.
- Secure user-specific API operations.
- PDF character-sheet export.

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
- Export their character as a PDF.
- Sign out.

Each user can access only their own data.

## 3. Functional Requirements

### 3.1. Start Screen and Authentication

| ID | Requirement |
|---|---|
| FR-01 | The first public screen displays the Adventure Files title, original pixel-art adventure artwork, and a blinking "PRESS START" prompt. Authentication fields are not displayed on this screen. |
| FR-02 | Registration collects a display name, email, password, and password confirmation. Unnecessary personal information is not requested. |
| FR-03 | Supabase Auth manages registration, password storage, email confirmation, and authentication sessions. Protected character operations require an authorized session. |
| FR-04 | Users can sign in and sign out. Authentication failures display safe, generic messages that do not disclose whether an account exists. |
| FR-05 | Password recovery uses the authentication provider's managed recovery flow. The request screen provides neutral feedback regardless of whether the email is registered. |
| FR-06 | Protected frontend views require authentication, and protected API endpoints reject missing, invalid, or expired credentials. |
| FR-07 | An authenticated user without a saved character can enter the creator. An authenticated user with an existing character sees their saved character dashboard. |

### 3.2. Character Creation and Management

| ID | Requirement |
|---|---|
| FR-08 | Each authenticated account can store exactly one character at a time. Duplicate creation must not produce a second character row. |
| FR-09 | The character name is mandatory and must contain 2–32 characters after trimming. |
| FR-10 | The class selector provides eight predefined classes, accessible text labels, and original class-specific illustrations that update only on explicit selection. |
| FR-11 | The creator provides ancestry, background, weapon, artifact, personality, aura, and companion selections from the version-controlled customization catalog. |
| FR-12 | No sex or gender field is presented or persisted. Class illustrations show different-looking examples without requiring a separate visual-identity selection. |
| FR-13 | Character creation contains four grouped stages: Class & Name, Origins, Equipment, and Essence & Review. Back/Next navigation preserves draft selections. |
| FR-14 | If character randomization is provided, it modifies only an editable draft and must never silently overwrite a saved character. |
| FR-15 | The final review displays all character selections and requires an explicit Save action. |
| FR-16 | Users can retrieve their saved character and view it in the retro-styled My Character dashboard after subsequent logins. |
| FR-17 | Editing opens the guided creator with the saved values prefilled. Saving updates the existing character rather than creating a second record. |
| FR-18 | Users can delete their own character after explicit confirmation. Their account remains available for creating another character. |
| FR-19 | Export PDF generates a readable character sheet containing the character illustration, name, and all selected character fields. It must not include private account credentials or authentication tokens. |

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

## 4. Approved User Navigation

The primary experience follows this order:

1. Adventure Files start screen.
2. Retro transition into authentication.
3. Sign in or create account.
4. Email verification or password recovery when required.
5. Authenticated character area.
6. Character creation or saved-character dashboard.
7. Character review and explicit save.
8. View, edit, delete, or export the saved character.
9. Sign out when desired.

Account registration and character creation are separate processes.

A user does not create a character as part of the account-registration form.

The user must be authenticated before saving persistent character data.

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

These values correspond to the backend's approved catalog.

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

| Stage | Selections |
|---|---|
| 1 — Class & Name | Class and character name |
| 2 — Origins | Ancestry and background |
| 3 — Equipment | Weapon, artifact, and companion |
| 4 — Essence & Review | Personality, aura, and final review |

Users can:

- Move forward.
- Move backward.
- Change previous choices.
- Review the entire draft.
- Save explicitly.

Navigating between stages must not discard the draft.

Validation errors must preserve entered values.

### 5.4. Editing Existing Characters

Editing must:

1. Load the saved character.
2. Populate the creator with existing values.
3. Allow the user to modify selections.
4. Preserve changes within the draft.
5. Update the saved record only after explicit confirmation.

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

### Business Rules

- **BR-01:** Each authenticated user's `user_id` is unique in the `characters` table and references the authentication provider's user identifier.
- **BR-02:** Class and all seven enumerated customization fields must match approved catalog slugs. Every category requires an explicit selection; only companion supports `none`. An artifact is required.
- **BR-03:** Character name length is validated at the API and database boundaries. Character names are safely rendered.
- **BR-04:** No class and customization combination is prohibited by gameplay restrictions.
- **BR-05:** Character operations derive record ownership from the authenticated session rather than accepting an arbitrary user identifier from the request.
- **BR-06:** Editing updates an existing character instead of creating a duplicate.
- **BR-07:** Randomization, when available, modifies only an unsaved draft until the user explicitly saves.
- **BR-08:** PDF export contains fictional character details and does not require storing PDF bytes on the server.
- **BR-09:** Class illustrations do not determine or persist a sex or gender attribute.
- **BR-10:** Introducing new option slugs requires coordinated catalog, frontend, API validation, and test updates.
- **BR-11:** Translating interface labels must not change database identifiers or break validation.
- **BR-12:** Character deletion does not automatically delete the user's authentication account.

**Implementation alignment:** The frontend uses eight mandatory artifact choices, including `shadow-crown` and `chaos-orb`. The backend allowlist and database constraints must be updated and compatibility-tested before saving these new values is enabled.

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
| NFR-13 — Testability | Include automated checks for authentication, validation, ownership, CRUD, record uniqueness, critical frontend flows, and PDF generation. |
| NFR-14 — CI/CD | Use GitHub Actions to run applicable builds, linting, tests, and configured security checks before integration or deployment. |
| NFR-15 — Production email | Configure suitable production email delivery for account verification and password recovery before public registration. |
| NFR-16 — Security review | Test cross-user access, missing or expired credentials, spoofed identifiers, invalid catalog values, and accidental secret exposure before public release. |
| NFR-17 — Visual consistency | Maintain the approved fixed dark palette, pixel typography, and retro interface design across all application screens. |
| NFR-18 — Motion safety | Respect reduced-motion preferences and prevent transitions or overlays from blocking later interactions. |
| NFR-19 — Localization | Support Portuguese and English for user-facing interface text while retaining stable language-independent stored values. |
| NFR-20 — Original artwork | Use original or appropriately licensed illustration assets and avoid reproducing protected third-party characters, interfaces, and game artwork. |

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
- The creator follows the four approved stages.
- Back/Next preserves the current draft.
- The equipment stage provides eight options per category.
- Every equipment category requires an explicit selection.
- Only companion offers `none`.
- Final review shows every selected value.
- Invalid data is rejected without deleting the user's draft.
- Saving requires an explicit action.

### 8.5. Character Persistence

- Saving creates one character associated with the authenticated account.
- Repeated creation cannot produce multiple rows for the same user.
- A returning user sees their saved character.
- Editing starts with the current saved selections.
- Canceling an edit does not modify the saved record.
- Saving an edit updates the existing character.
- Deleting requires confirmation.
- After deletion, the account remains active and can create another character.

### 8.6. PDF Export

- The exported PDF contains the character illustration.
- The character name is prominently displayed.
- Class and all selected customization fields are included.
- Labels remain readable in the generated document.
- The document uses the project's retro design language.
- The PDF can be downloaded and opened successfully.
- Private account credentials and authentication data are excluded.

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

### 8.9. Production Readiness

- Frontend and API builds succeed.
- Automated tests pass.
- Lint checks pass.
- No credentials or privileged keys are committed.
- Authentication and email verification work in production.
- Password recovery works in production.
- Database authorization works in the deployed environment.
- The character lifecycle and PDF export are validated.
- Documentation accurately reflects the released functionality.

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

### Phase 4 — Character Creator

- Four-stage guided workflow.
- Default eight-class illustration.
- Class-specific illustrations activated by explicit selection.
- Catalog-based selections.
- Draft persistence.
- Final review and save.

### Phase 5 — Character Management

- Final character dashboard.
- Editing.
- Deletion with confirmation.
- Returning-user experience.

### Phase 6 — PDF Export

- Character illustration integration.
- Character sheet layout.
- PDF generation and download.

### Phase 7 — Final Verification

- Responsive review.
- Accessibility checks.
- Security testing.
- Production deployment.
- Final documentation and portfolio presentation.

Previously completed foundations should be reused and refined rather than unnecessarily rebuilt.

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
- The customization catalog.
- Frontend interaction behavior.
- Automated tests.
- Implementation status.

Changes to established scope should be reviewed before implementation.

Adventure Files should prioritize a complete, secure, accessible, and visually coherent character-creation experience over unnecessary feature expansion.