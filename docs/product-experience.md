# Adventure Files — Product Experience and Visual Direction

- **Project:** Adventure Files
- **Document type:** Product experience and visual design specification
- **Status:** Approved direction; implementation in progress

## 1. Experience Overview

Adventure Files is a full-stack character creator presented through the visual language of a classic adventure game and an early computer interface.

The experience should feel nostalgic, intuitive, and personal.

The website is not a playable game. Its game-inspired presentation turns an otherwise conventional authentication and data-management project into a memorable interactive experience.

The complete journey is:

1. Adventure Files title screen.
2. Retro transition into authentication.
3. Sign in or create an account.
4. Enter the authenticated character area.
5. Create a character through six guided stages.
6. Review and save the character.
7. View, edit, delete, or export the saved character.
8. Return to the saved character after future logins.

Every screen must preserve a consistent visual identity.

## 2. Visual Identity

### 2.1. Overall direction

The visual identity combines:

- Classic adventure and fantasy RPG atmosphere.
- Early handheld video game interfaces.
- Vintage computer windows and dialog boxes.
- Minimalist pixel-art illustrations.
- Intuitive game-menu interaction patterns.

The design should remain simple.

Avoid excessive decorative panels, unnecessary text, large groups of icons, overlapping windows, or visual elements that do not contribute to the experience.

The application should resemble a carefully designed retro game interface rather than a modern dashboard covered in nostalgic decorations.

### 2.2. Color palette

Adventure Files uses a fixed dark visual identity.

Primary colors include:

- Pure black and near-black backgrounds.
- Dark forest green.
- Muted emerald.
- Soft mint green.
- Cream and warm off-white.

The exact color tokens should remain centralized in the frontend styling.

There is no light/dark theme toggle.

Different screens may emphasize different colors from the same palette without changing the overall theme.

### 2.3. Typography

Pixel-style typography is a defining part of Adventure Files.

It should appear in:

- The title screen.
- Buttons and navigation.
- Window headers.
- Character classes.
- Selection labels.
- Progress indicators.
- Character details.

Typography must remain legible.

Very small pixel text should be avoided, especially on mobile devices and in form validation messages.

Form content should prioritize readability while preserving the retro identity.

### 2.4. Window design

Authentication and character-management screens should resemble compact retro computer windows.

Preferred characteristics:

- Slightly rounded rectangular corners.
- Defined pixel-inspired borders.
- Minimal window headers.
- Simple input fields.
- Clear selected and unselected states.
- Small, deliberate interface details.

The borders should not feel excessively sharp or aggressively futuristic.

Avoid excessive gradients, glowing elements, large shadows, and complex decorations.

### 2.5. Glitches and visual imperfections

Subtle visual imperfections may reinforce the illusion of an old computer interface.

However:

- Glitches should remain restrained.
- They should primarily affect the interface window.
- They must not obscure fields, buttons, or important text.
- They must not interfere with typing or keyboard navigation.
- They should respect reduced-motion preferences.

The surrounding black background should remain visually quiet.

### 2.6. Artwork

Artwork must be original and use a limited color palette.

Pixel edges should remain crisp.

Avoid smooth illustration styles, photographic textures, excessive shading, and highly detailed fantasy compositions.

Character silhouettes, recognizable equipment, and a few carefully placed environmental elements should communicate the scene.

The artwork may draw inspiration from supplied references without reproducing copyrighted characters, game logos, or identifiable scenes.

## 3. Screen A — Adventure Files Start Screen

### 3.1. Purpose

The start screen introduces Adventure Files as if it were an old adventure game.

It should create atmosphere before asking the user to interact with account forms.

The screen must remain minimal.

### 3.2. Visible elements

The start screen contains only three main elements:

1. The title: **ADVENTURE FILES**.
2. The original adventure illustration.
3. The prompt: **PRESS START**.

Do not add:

- Login fields.
- Registration links.
- Language controls.
- A theme selector.
- Additional explanatory phrases.
- Decorative arrows beside the start prompt.
- Unnecessary navigation menus.

### 3.3. Main illustration

The approved visual direction is a simplified fantasy landscape.

The composition features:

- A group of eight adventurers.
- A distant fantasy environment.
- A dominant moon or circular light source.
- A distant threatening figure or silhouette.
- Limited environmental details.

The scene should suggest that the characters are preparing to begin an adventure.

The adventurers represent the eight available character classes.

The illustration should communicate the variety of character roles through silhouettes, equipment, and clothing.

The scene must remain more detailed than the application's later interface screens, but still clearly minimalist.

### 3.4. Desktop and mobile artwork

The project uses two distinct artwork compositions:

- Desktop artwork.
- Mobile artwork.

Both represent the same world and visual concept.

They may differ in framing and spacing to preserve the important subjects at different aspect ratios.

The artwork must not contain the interactive title or start prompt as baked-in text.

Instead, the title and prompt are rendered separately by the frontend.

This allows:

- Responsive positioning.
- Independent animation.
- Text adjustments without editing artwork.
- Clearer scaling across devices.

### 3.5. Title animation

The Adventure Files title may have a subtle entrance or reveal animation.

The effect should be simple and consistent with an old video game.

Avoid dramatic motion, elaborate cinematic effects, or continuous visual distractions.

### 3.6. PRESS START behavior

The screen displays a small, centered "PRESS START" prompt.

The prompt:

- Uses pixel-style typography.
- Blinks slowly.
- Has no decorative arrows.
- Has no surrounding button frame.
- Is smaller than the title.
- Remains visually secondary to the illustration.

The established blinking timing is approximately 1.8 seconds per cycle.

Users can start through:

- Mouse click.
- Touch input.
- Enter key.

The interaction should work consistently on desktop and mobile.

### 3.7. Accessibility

The start action must remain keyboard-accessible.

Users with reduced-motion preferences should not be required to watch the full animation.

The illustration should have appropriate accessible treatment depending on whether it conveys information or is purely decorative.

## 4. Screen Transition — Start to Authentication

### 4.1. Concept

The transition imitates the screen-closing effects of classic video games.

It should feel nostalgic and deliberate.

### 4.2. Closing sequence

After the user starts:

1. Input is accepted once.
2. The start screen begins closing toward its center.
3. The visible area gradually becomes smaller.
4. The screen becomes black.

The approved closing duration is approximately 1.6 seconds.

### 4.3. Black-screen pause

After closing, the screen remains black briefly.

The established pause is approximately 0.3 seconds.

This creates separation between the title screen and the authentication interface.

### 4.4. Opening sequence

The authentication interface then opens using the reverse effect.

The visible area expands from the center toward the edges.

The approved opening duration is approximately 1.6 seconds.

The final result reveals the authentication screen.

### 4.5. Technical and interaction requirements

The transition must:

- Avoid duplicate navigation.
- Prevent accidental repeated starts.
- Work on mobile and desktop.
- Keep the interface usable after completion.
- Respect reduced-motion preferences.
- Avoid leaving an invisible overlay blocking later interactions.

The animation should not resemble a modern loading spinner or a conventional page fade.

## 5. Screen B — Sign In

### 5.1. Purpose

The sign-in screen provides a direct, minimal authentication experience.

The user should immediately understand where to enter credentials.

### 5.2. Background

The area behind the login window is black.

It should resemble a dark, inactive computer display.

Avoid decorative artwork behind the authentication window.

The window itself is the visual focus.

### 5.3. Main window

The authentication window should be:

- Compact.
- Centered.
- Slightly rounded.
- Consistent with the project palette.
- Styled as a retro computer interface.

The window should be smaller and simpler than a conventional modern login card.

Its proportions must adapt to narrow screens.

### 5.4. Window header

The upper-left portion identifies the active authentication view.

For example:

- Sign In.
- Create Account.
- Reset Password.

The upper-right portion contains the language selection:

**PT / EN**

The active language must have a clear visual state.

The control should remain small and unobtrusive.

### 5.5. Sign-in elements

The sign-in form contains:

- Email.
- Password.
- Primary sign-in action.
- Create-account option.
- Password-recovery option.

Avoid additional slogans, lengthy descriptions, and unrelated icons.

### 5.6. Form behavior

The interface must provide:

- Clearly identified fields.
- Keyboard navigation.
- Visible input focus.
- Password masking.
- Loading feedback during submission.
- Helpful validation messages.
- Clear failure states.

Authentication errors must not disclose sensitive account information.

### 5.7. Language behavior

Portuguese and English are the supported interface languages.

The language selector appears on the authentication screen and should remain effective throughout the application.

Changing language updates interface labels and messages without changing stored character values.

Backend identifiers remain stable English slugs.

The selected language should persist appropriately as the user navigates through the experience.

The title-screen prompt remains "PRESS START" as part of the approved retro presentation.

### 5.8. Visual effects

Any glitch or interference effect should be subtle and limited to the window.

The effect must never compromise readability or form usability.

## 6. Screen C — Create Account

### 6.1. Purpose

Registration creates a user account.

It does not create a character.

The account and character creation experiences must remain separate.

### 6.2. Fields

The registration form contains:

- Display name.
- Email.
- Password.
- Confirm password.

Do not request unnecessary personal information.

### 6.3. Actions

The user can:

- Create an account.
- Return to sign in.

After successful registration, the interface must explain the required email-confirmation step when applicable.

### 6.4. Visual consistency

Registration uses the same retro window, dark background, typography, palette, and minimal design principles as sign-in.

Switching between sign-in and registration must not introduce an unrelated visual style.

The PT/EN selector remains available.

## 7. Screen D — Password Recovery

Password recovery uses the established authentication window.

The flow includes:

1. Requesting a recovery email.
2. Displaying a generic submission confirmation.
3. Following the authentication provider's recovery link.
4. Entering and confirming a new password.
5. Returning to the appropriate authenticated or sign-in state.

Recovery feedback must not reveal whether an email address belongs to an existing account.

The interface should remain simple and consistent with the other authentication screens.

## 8. Screen E — Authenticated Character Area

### 8.1. First entry

After authentication, the application checks whether the account already owns a character.

If no character exists, the interface shows the uppercase "MY CHARACTER" / "MEU PERSONAGEM" header and the PT/EN selector, followed only by two actions: Create Character and Sign Out.

No explanatory empty-state paragraphs or duplicate page headings are displayed.

The Create Character action is visually primary.

Sign Out uses a subdued dark-green secondary treatment within the approved palette.

If a saved character exists, the user enters the saved-character dashboard with its relevant character-management actions.

### 8.2. Main navigation

The authenticated interface must provide obvious access to:

- Character creation or the saved character.
- Relevant account controls.
- Sign out.

Do not create a complex navigation system for a small application.

A single clearly presented main action should guide users toward the next step.

### 8.3. Loading and error states

The interface must distinguish between:

- Checking the session.
- Loading a character.
- No saved character.
- Successfully loaded character.
- API or network failure.

A temporary network error must not be treated as proof that the user has no saved character.

## 9. Screen F — Character Creator

### 9.1. General concept

Character creation should resemble selecting and configuring a character in an old RPG.

The interface must remain intuitive and visually focused.

The user completes a small number of choices at a time.

In the first stage, a central illustration reinforces the current class selection.

### 9.2. Layout

The creator should contain:

- A compact header.
- A visible current step.
- A prominent class illustration in Step 01.
- Clearly labeled option groups in each customization stage.
- Back and Continue controls.
- A dedicated final review and explicit Save action.

The compact header displays the current step (01 / 06 through 06 / 06) on the left and PT/EN on the right.

The desktop layout prioritizes a balanced, compact composition. Mobile layouts reorganize content vertically without reducing functionality.

### 9.3. Six-stage structure

The approved creator contains six stages:

| Step | Name | Choices |
|---|---|---|
| 01 / 06 | Identity | Class and character name |
| 02 / 06 | Origins | Ancestry and background |
| 03 / 06 | Equipment | Weapon and artifact |
| 04 / 06 | Essence | Personality and aura |
| 05 / 06 | Journey | Companion and motivation |
| 06 / 06 | Final Review | Review all values and explicitly save |

The first five stages have two fields each. The sixth contains no new customization choices.

Stage-specific behavior:

- **Identity:** Preserve the existing eight-class artwork, active selection behavior, and name validation.
- **Origins:** Show the two existing option grids side by side on desktop, with the approved short divider limited to their button area.
- **Equipment:** Show Weapon and Artifact as two equal-width groups on desktop. Move Companion out of this stage. Both categories offer eight options and require a selection.
- **Essence:** Show Personality and Aura as two paired categories, each with eight options.
- **Journey:** Show Companion and Motivation as two paired categories, each with eight options. Companion includes an explicit `none` choice.
- **Final Review:** Show every selected value clearly and allow users to return to previous stages before saving.

For Steps 02–05, desktop displays paired option grids separated by a short, subtle line confined to the option area. The divider must not run through the headings, buttons, or outer window border.

On mobile, the paired groups stack vertically, and desktop divider lines are removed. Preserve the existing mobile visual style.

All option buttons within a category must have consistent dimensions, alignment, spacing, and clear selected states. Long translated labels must not break the grid.

The artifact category excludes `none`, and its approved eight options include Arcane Seal (`arcane-seal`), Shadow Crown (`shadow-crown`), and Chaos Orb (`chaos-orb`).

Companion includes the updated Dragon (`dragon`) option instead of Dragonling (`dragonling`).

Motivation uses eight approved values: Protection, Freedom, Justice, Redemption, Glory, Knowledge, Revenge, and Adventure.

All stage values must use stable language-independent identifiers defined in the customization catalog.

The user must be able to go backward without losing selections.

### 9.4. Class selection

The available classes are:

1. Warrior
2. Paladin
3. Mage
4. Rogue
5. Ranger
6. Druid
7. Cleric
8. Bard

These class names correspond to the canonical backend catalog.

### 9.5. Default class illustration

Before a class is chosen, the creator displays an illustration representing all eight classes together.

This is the default state.

The illustration should remain original, minimalist, and consistent with the title-screen art direction.

### 9.6. Class illustration interaction

Artwork changes only when the user explicitly selects a class with mouse, keyboard, or touch.

Hovering over or focusing an unselected class does not change the illustration or the selected value.

Before selection, the eight-class ensemble illustration remains visible.

### 9.7. Persistent class selection

Clicking or otherwise activating a class selects it.

Once selected:

- The option receives a clear active state.
- The matching class illustration remains visible.
- Moving the pointer away does not remove the selection.
- Selecting another class updates the active option and illustration.

The confirmed selection changes only when the user explicitly activates another class.

### 9.8. Character representation

Each class-specific illustration presents two different-looking examples of that class.

This gives visual variety without adding a separate avatar-customization system.

The user does not select:

- A male or female avatar.
- A gender.
- A body type.
- Individual facial features.

The illustration is representative and decorative.

The actual character record is determined by the selected class and customization fields.

### 9.9. Options and controls

Options should resemble compact retro game-menu selections.

They must have:

- Text labels.
- Clearly visible selection states.
- Consistent spacing.
- Readable typography.
- Keyboard interaction.
- Touch-friendly activation areas.

Avoid unlabeled icon-only choices.

### 9.10. Draft persistence

Selections are held in an editable draft throughout all six stages.

Navigating backward and forward must not discard those choices.

The user can return to earlier stages, change selections, and revisit Final Review before saving.

Changing between Portuguese and English updates visible labels without changing the selected identifiers or losing the draft.

Validation errors and recoverable API failures must preserve entered values.

### 9.11. Optional randomization

A randomization action may fill the current draft using valid catalog values.

Randomization must not immediately overwrite a saved character.

Any random result remains editable before saving.

This feature is secondary to the guided creation flow and should not visually dominate the interface.

### 9.12. Final Review and Save

Step 06 / 06 is exclusively a review and save screen. It must not introduce another customization category.

The summary displays all ten values:

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

The user can:

- Review the complete character.
- Return to previous stages.
- Correct information without losing other selections.
- Explicitly save the character.

The Save action is separate from Continue on earlier stages.

Saving shows a loading state and prevents duplicate submissions.

A failed request must preserve the draft and provide helpful, safe feedback.

A character must not be shown as saved until the API confirms persistence.

## 10. Screen G — My Character

### 10.1. Purpose

The saved-character screen presents the result of the user's choices.

It should resemble a compact character record or retro RPG status screen.

### 10.2. Content

The view contains:

- Character name.
- Character illustration.
- Class.
- Ancestry.
- Background.
- Weapon.
- Artifact.
- Personality.
- Aura.
- Companion.
- Motivation.

Use clear labels and avoid unnecessary statistics or fictional gameplay values.

### 10.3. Available actions

The dashboard provides:

- Edit Character.
- Export Character Sheet.
- Delete Character.
- Sign Out.

The export action offers two formats: PNG Story/Status and PNG Portrait.

Account-related options may be included when the corresponding functionality is implemented.

### 10.4. Editing

Editing loads the saved character into the six-stage creator.

The user can move between stages and update selections.

Changes must remain a draft until explicitly saved in Final Review.

If the user cancels editing, the previously saved character must remain unchanged.

### 10.5. Deletion

Deleting a character requires explicit confirmation.

The interface must explain what will be removed.

Deleting the character does not delete the account.

After deletion, the user returns to the no-character state and can create another character.

### 10.6. Returning users

After future logins, users with an existing character should see their saved character.

They should not be forced to repeat the creation flow.

## 11. Screen H — Character Sheet Export

### 11.1. Purpose

Character-sheet export turns the saved character into a portable, readable, and shareable artifact.

The user chooses a format from the saved-character dashboard. All formats use the same saved character data, with layouts adapted to their intended use.

The application does not publish directly to social networks.

### 11.2. Approved formats

| Format | Dimensions | Intended use |
|---|---|---|
| PNG Story/Status | 1080 × 1920 pixels | Instagram Stories and WhatsApp Status |
| PNG Portrait | 1080 × 1350 pixels | Portrait social posts and sharing |

PDF is excluded from the roadmap by the November 1, 2026 scope decision.

### 11.3. Shared content

Each export includes:

1. Original character illustration.
2. Character name as a prominent heading.
3. Class.
4. Ancestry.
5. Background.
6. Weapon.
7. Artifact.
8. Personality.
9. Aura.
10. Companion.
11. Motivation.

Content must remain faithful to the saved record, including an explicit `none` companion selection.

All layouts preserve the project's dark-green, cream, mint, and pixel-art visual identity.

### 11.4. PNG Story/Status — 1080 × 1920

The vertical image is designed for Instagram Stories and WhatsApp Status.

It should:

- Use the exact dimensions of 1080 × 1920 pixels.
- Present the character illustration prominently.
- Keep the name and class easy to identify.
- Include the complete selected character information.
- Maintain comfortable margins and readable labels.
- Avoid placing essential information against the outer edges.

The image is downloaded as a standard PNG file. Direct social-network integration is not part of the initial release.

### 11.5. PNG Portrait — 1080 × 1350

The portrait image is intended for social-media posts and general sharing.

It should:

- Use the exact dimensions of 1080 × 1350 pixels.
- Preserve the character illustration and complete selected information.
- Use a layout specifically composed for the shorter aspect ratio.
- Maintain readability and consistent visual hierarchy.

The portrait layout must not simply crop the Story/Status image.

### 11.6. Export interaction

The interface should allow the user to:

1. Open the Export Character Sheet action.
2. Choose PNG Story/Status or PNG Portrait.
3. Generate and download the selected file.
4. Return to the saved-character view without losing state.

Provide loading and failure feedback where generation is not immediate.

Do not claim a download succeeded if generation failed.

### 11.7. Data, privacy, and implementation

Exports contain only the fictional information needed for the character sheet.

They must not include:

- Account passwords.
- Authentication tokens.
- Internal user identifiers.
- Private account metadata.

Client-side export generation is preferred for the initial release if it meets quality, accessibility, and device-performance requirements.

Generated PNG bytes do not need to be stored as additional server records.

Changes to the catalog and schema must be compatible with saved-character retrieval before export is enabled.

## 12. Artwork Inventory

The planned artwork system includes:

| Asset | Quantity | Purpose |
|---|---:|---|
| Desktop title-screen artwork | 1 | Landscape start-screen composition |
| Mobile title-screen artwork | 1 | Portrait start-screen composition |
| Eight-class ensemble illustration | 1 | Default creator artwork |
| Class-specific illustration | 8 | Artwork for explicit class selections |
| Retro interface icons | As needed | Support labeled actions |

The start-screen artwork must remain separate from its title and prompt.

Class illustrations should share a consistent style, proportions, and palette.

When feasible, the same class illustrations can be reused in the character dashboard and PNG exports.

## 13. Responsive Behavior

### 13.1. Desktop

The desktop interface may use a wider layout with the main illustration beside character options.

The start-screen composition should preserve the full atmosphere of the scene.

### 13.2. Mobile

The mobile interface should:

- Use the dedicated mobile title-screen artwork.
- Keep the title readable.
- Preserve the blinking "PRESS START" prompt.
- Display authentication forms without horizontal scrolling.
- Keep important buttons within comfortable reach.
- Reorganize class artwork and selection options vertically when necessary.
- Allow the complete creation and editing experience.
- Support both character-sheet export formats.

Mobile users must have access to the same functional choices as desktop users.

### 13.3. Shared behavior

Both layouts must support:

- Authentication.
- Language selection.
- Character creation.
- Character review.
- Character editing.
- Character deletion.
- both PNG exports.
- Sign out.

## 14. Motion and Interaction Guidelines

Animations should be purposeful.

Approved or acceptable motion includes:

- Subtle title entrance.
- Slow "PRESS START" blinking.
- Start-screen iris closing.
- Authentication-screen iris opening.
- Lightweight selection feedback.
- Restrained window effects.

Avoid:

- Constant background movement.
- Excessive glitches.
- Large bouncy transitions.
- Unnecessary loading animations.
- Effects that delay routine form interactions.

The retro aesthetic should feel like an old game, not a heavily animated modern interface.

## 15. Accessibility Requirements

The product must support:

- Keyboard navigation.
- Clear focus indicators.
- Proper form labels.
- Accessible error feedback.
- Adequate color contrast.
- Touch-friendly interactive areas.
- Readable pixel typography.
- Reduced-motion preferences.
- Correct treatment of decorative and meaningful illustrations.

Hover must never be the only way to access important information or confirm a selection.

All important actions should remain available through click, touch, and keyboard activation.

## 16. UX Guardrails

The following rules apply across the entire application:

1. Keep each screen focused on one primary task.
2. Avoid unnecessary text and decorative controls.
3. Prefer clear labels to icon-only interactions.
4. Preserve unsaved choices while navigating the creator.
5. Require explicit confirmation before saving or deleting data.
6. Never confuse account information with fictional character information.
7. Show honest loading, empty, success, and error states.
8. Keep visual effects secondary to usability.
9. Preserve the fixed dark visual identity.
10. Do not add features that turn the project into a playable RPG.

## 17. Implementation Status

The six-stage flow, character management, and both PNG export layouts are implemented on the feature branch. The complete product is still undergoing release validation.

### Implemented on the Development Branch

- Adventure Files start screen, separate desktop/mobile pixel-art compositions, PRESS START, and retro transition.
- Supabase authentication, session restoration, and PT/EN interface.
- All six guided creator stages with the revised catalog, Personality, Aura, Companion, and Motivation.
- Dedicated Final Review, draft preservation, explicit Save, and character persistence.
- Saved-character dashboard using class artwork and showing all customization choices.
- Character editing and confirmation-based deletion.
- Browser downloads of PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350).
- Frontend/API/database automated checks; the latest reported frontend run passed lint, build, and 141 tests in 17 files.

Manual browser checks covered deletion cancellation, editing and saving, both accounts, and re-export after changing a saved character's class and choices.

### Remaining Review and Release Work

1. Negative cross-account security checks for API read, update, delete, and database RLS.
2. Responsive polish, keyboard accessibility, reduced-motion review, and error states.
3. Full production authentication/email, API integration, deployment, and recovery verification.
4. Final documentation review and merge of the draft pull request after all checks pass.

The updated catalog includes Arcane Seal (`arcane-seal`), Shadow Crown (`shadow-crown`), Chaos Orb (`chaos-orb`), and Dragon (`dragon`). Only Companion offers `none` as an explicit selection. Previously saved records and compatibility paths require continued validation.

The project's original eight-class illustrations remain shared by the creator, dashboard, and PNG exports; per-option artwork is deferred. PDF export is not in scope.

## 18. Non-Goals

Adventure Files is not intended to include:

- Playable combat.
- Quests or exploration.
- Character levels.
- Multiplayer.
- Public character sharing.
- Multiple saved characters per account.
- Detailed avatar construction.
- Gender-selection controls.
- A light/dark theme switch.
- Complex desktop-style window management.

The objective is a polished, memorable full-stack character-creation experience.

## 19. Design Success Criteria

The visual and interaction design is successful when:

- The title screen immediately resembles a minimalist old adventure game.
- The start transition feels deliberate and nostalgic.
- Authentication is simple and visually consistent.
- Users can understand the next action without lengthy instructions.
- Explicit class selection and original artwork make character creation more engaging.
- The six-stage wizard remains easy to navigate, with a dedicated final review.
- Saved characters are easy to view and manage.
- both PNG layouts feel like natural extensions of the project.
- Desktop and mobile experiences remain coherent.
- The application's creativity supports its technical purpose.

Adventure Files should feel like a small adventure from its first screen to the final character sheet.