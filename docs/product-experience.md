# RPG Character Creator — Product Experience and Visual Direction

## 1. Visual Identity

A simple fictional RPG application that resembles an early desktop computer program blended with an old handheld game screen.

- **Palette:** cream/off-white, mint, muted emerald, dark forest green, near-black; both light and dark themes.
- **Surfaces:** rectangular windows, thin pixel borders, compact title bars, simple dialogs, small icons, restrained shadows.
- **Type:** decorative pixel font for headings/buttons and a highly legible regular font for form values, hints, and errors.
- **Artwork:** original, static 1-bit/few-color pixel illustrations with crisp nearest-neighbor rendering. Avoid copying supplied game logos, characters, or copyrighted screens.
- **Layout:** a single primary window at a time; prefer clear flow to overlapping decorative windows.
- **Accessibility:** labels accompany icons, adequate contrast, focus states, keyboard operation, mobile-friendly hit targets, descriptive alternatives for meaningful art.

## 2. Screen Inventory

### Screen A — Welcome / Sign In (public)

- Header: project logo/working title (final brand TBD).
- Main art: original retro-fantasy ensemble artwork, visually similar in tone to classic game start screens.
- Email and password fields, **Sign In** primary button.
- **Create Account** and **Forgot Password?** links.
- Optional short theme switcher; interface copy in English.
- Generic errors such as `Invalid email or password.` must not reveal whether the account exists.
- Google login intentionally absent from the first release.

### Screen B — Create Account (public)

- Display Name, Email, Password, Confirm Password.
- **Create Account** primary button and **Already have an account? Sign In** link.
- On valid registration: **Check Your Email** confirmation screen.
- Confirmation link returns to a verified sign-in/session flow, per Supabase configuration.

### Screen C — Forgot / Reset Password (public)

- Email address request and generic submission confirmation.
- Recovery link takes the user to a limited password-reset form.
- Use the auth provider's recovery lifecycle; never expose whether an email is registered.

### Screen D — Character Creator (authenticated, no record or editing)

Four connected steps inside the main retro window, with current class illustration retained when appropriate.

1. **Class & Name:** initial ensemble art for all eight classes. Selecting a class swaps the central art to a static pair of different-looking character examples for that class; select class and enter a fictional name. A **Randomize Character** button can fill an editable draft.
2. **Origins:** choose **Ancestry** and **Background** together.
3. **Equipment:** choose **Weapon**, **Artifact** (including None), and **Companion** (including None).
4. **Essence & Review:** choose **Personality** and **Aura**, show a consolidated character summary, then require **Save Character**. If validation fails, keep the selected draft in place.

- Controls: Back/Next, clear progress, persistent valid draft values, informative option labels.
- Options must have independent text labels; icons alone are insufficient.
- No sex/gender selection; the dual character art is representative only.
- Character art is decorative; the user's actual selections determine the textual record.
- In edit mode, load the persisted character first; **Discard Changes** restores saved values and never overwrites without confirmation.
- Randomizing an edit draft may require a confirm dialog if it would discard unsaved changes.

### Screen E — My Character (authenticated)

- Title: **My Character** or **Character Record**.
- Centered class art and a card containing all eight saved character properties (class, ancestry, background, weapon, artifact, personality, aura, companion) plus the fictional name.
- Actions: **Edit Character**, **Export PDF**, **Delete Character** (with confirmation), **Sign Out**, **Account Settings**.
- If data does not exist, redirect to creator. If data is loading or an API error occurs, show an honest state; never flash another user's record.
- One character per account means no gallery or list of saved characters is needed.

## 3. Exported Character Sheet

- A printable and downloadable client-side PDF resembling an old monochrome computer document.
- Original pixel art, readable text, a clear heading, and every fictional character selection.
- Letter/A4-friendly print formatting with no cropped or tiny labels.
- No account email, password, auth token, or private profile data in the PDF.
- Export has no server upload/storage requirement in V1; implementation library may be chosen later.

## 4. Artwork Inventory

| Art | Quantity | Purpose |
|---|---:|---|
| Original welcome/landing RPG art | 1 | Public sign-in identity |
| Ensemble showing the eight classes | 1 | Default creator illustration |
| Class-specific static images, each showing two visual interpretations | 8 | Selected class preview and My Character |
| Small original pixel icons | As needed | Assist labeled controls |

Class art is **not** a selectable male/female avatar; it intentionally avoids linking appearance to a user-provided gender selection. Characters must be recognizable by class and compatible with the same limited palette.

## 5. UX Guardrails

- Limit cognitive load by grouping related options in the same step and using a visible progress indicator.
- Prefer buttons/options with clear text over unlabeled pixel art.
- Default art must fit mobile screens without excessive vertical scrolling before choices.
- Use loading states while checking authentication/character data; prevent double submissions.
- Clearly separate account name from fictional character name.
- Explicit user action is required to persist, delete, or replace a saved character.
- Design security and privacy notices in plain English; do not hide essential controls in decorative menus.

## 6. Non-Goals

No playable RPG, public social profile, avatar-builder with body parts, selectable gender, avatar animations, or more than one saved character in the initial release.
