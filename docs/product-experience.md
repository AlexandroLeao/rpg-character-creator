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
5. Create a character through four guided steps.
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
- A prominent class illustration in step one.
- Clearly labeled options in each stage.
- Back and Next controls.
- A clear final save action.

Desktop and mobile layouts may arrange these elements differently.

The compact header displays the current step (01 / 04 through 04 / 04) on the left and PT/EN on the right while creating a character.

### 9.3. Four-step structure

The approved creator contains four stages.

| Step | Name | Choices |
|---|---|---|
| 1 | Class & Name | Class, character name |
| 2 | Origins | Ancestry, background |
| 3 | Equipment | Weapon, artifact, companion |
| 4 | Essence & Review | Personality, aura, complete review |

Each stage should show only the options relevant to that stage.

The user must be able to go backward without losing previous selections.

Origins use two side-by-side groups on desktop with a short vertical divider between the option grids.

On mobile, the groups are stacked without the divider.

Equipment uses three equally sized groups (Weapon, Artifact, Companion) on desktop, each with eight consistently sized options and subtle short dividers between their grids.

On mobile, the groups are stacked without those dividers.

The artifact choice is mandatory and excludes `none`.

Only Companion offers `none` as an explicit selection.

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

Selections are held in an editable draft throughout the wizard.

Navigating between stages must not discard those choices.

The user can return to earlier stages and make changes before the final save.

### 9.11. Optional randomization

A randomization action may fill the current draft using valid catalog values.

Randomization must not immediately overwrite a saved character.

Any random result remains editable before saving.

This feature is secondary to the guided creation flow and should not visually dominate the interface.

### 9.12. Review and save

The final step shows the complete character summary.

The user can:

- Review all selected values.
- Return to previous stages.
- Correct information.
- Explicitly save the character.

Validation errors must preserve the current draft.

Saving should show a loading state and prevent duplicate submissions.

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
- Companion.
- Personality.
- Aura.

Use clear labels and avoid unnecessary statistics or fictional gameplay values.

### 10.3. Available actions

The dashboard provides:

- Edit Character.
- Export PDF.
- Delete Character.
- Sign Out.

Account-related options may be included when the corresponding functionality is implemented.

### 10.4. Editing

Editing loads the saved character into the creator.

The user can move between stages and update selections.

Changes must remain a draft until explicitly saved.

If the user cancels editing, the previously saved character must remain unchanged.

### 10.5. Deletion

Deleting a character requires explicit confirmation.

The interface must explain what will be removed.

Deleting the character does not delete the account.

After deletion, the user returns to the no-character state and can create another character.

### 10.6. Returning users

After future logins, users with an existing character should see their saved character.

They should not be forced to repeat the creation flow.

## 11. Screen H — PDF Export

### 11.1. Purpose

PDF export turns the character into a portable, printable document.

It is one of the main outcomes of the application.

### 11.2. Layout

The PDF should contain:

1. The character illustration at the top.
2. The character name as a prominent heading.
3. The character class.
4. The remaining selected character information below.

The document should resemble a simple retro character sheet.

### 11.3. Visual direction

Use:

- Original pixel-art illustration.
- Clear pixel-inspired headings.
- Readable body text.
- Consistent borders.
- A restrained color palette.
- Balanced spacing.

The PDF must be readable when printed.

Avoid elaborate backgrounds, excessive decoration, and tiny text.

### 11.4. Data and privacy

The exported document contains only the fictional character information needed for the sheet.

It must not contain:

- Account passwords.
- Authentication tokens.
- Internal user identifiers.
- Private authentication data.

Client-side PDF generation is preferred for the initial release if it meets the quality and functionality requirements.

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

When feasible, the same class illustrations can be reused in the character dashboard and PDF.

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
- Support PDF export.

Mobile users must have access to the same functional choices as desktop users.

### 13.3. Shared behavior

Both layouts must support:

- Authentication.
- Language selection.
- Character creation.
- Character review.
- Character editing.
- Character deletion.
- PDF export.
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

The product experience described here represents the approved direction.

### Already implemented

- Adventure Files start screen.
- Separate desktop and mobile start-screen artwork.
- "PRESS START" interaction.
- Retro transition into authentication.
- Authentication foundations and PT/EN interface support.
- Basic authenticated character dashboard and simplified empty state.
- Protected backend character API.
- Character creator step 01: class and name.
- Character creator step 02: ancestry and background.
- Character creator step 03: weapon, artifact, and companion.
- Draft selections preserved when navigating backward between implemented steps.
- Responsive layouts for the first three creator stages.
- Frontend lint, build, and automated tests for the implemented stages.

### Still requiring implementation or refinement

- Step 04: personality, aura, full review, and explicit save.
- Alignment of backend/database artifact validation with the revised catalog.
- Frontend character save/edit/delete workflows.
- Final illustrated character dashboard.
- Illustrated PDF export.
- Final responsive and accessibility refinements.
- End-to-end production validation.

The approved artifact catalog contains eight mandatory artifact choices, including Shadow Crown (`shadow-crown`) and Chaos Orb (`chaos-orb`).

`none` remains available only for Companions.

Backend and database compatibility must be verified before enabling character saving with these revised slugs.

Approved designs must not be described as completed features until their implementation is verified.

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
- The four-stage wizard remains easy to navigate.
- Saved characters are easy to view and manage.
- The final PDF feels like a natural extension of the project.
- Desktop and mobile experiences remain coherent.
- The application's creativity supports its technical purpose.

Adventure Files should feel like a small adventure from its first screen to the final character sheet.