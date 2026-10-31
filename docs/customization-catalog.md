# Adventure Files — Customization Catalog

- **Status:** Approved target catalog and six-step character creation flow; implementation alignment pending.
- **Language:** Code, technical documentation, and stored identifiers use English. User-facing labels and messages support Portuguese and English.

## Rules

- Each authenticated account can have at most one saved character.
- All users can combine any class with any ancestry, background, weapon, artifact, personality, aura, companion, or motivation.
- No gameplay balancing or class restrictions are implemented.
- Every saved character must have a non-empty name (2–32 characters after trimming).
- Every customization category requires an explicit selection.
- `None` is a valid option only for companion.
- An artifact must always be selected from the eight available artifacts.
- A motivation must be selected from the eight approved motivations.
- **No gender, sex, gender identity, or visual-body-selection field exists.** The dual-character class illustrations are purely representative.
- Persist stable English slugs rather than translated labels.
- The catalog defines the approved target values for frontend display and server-side validation.
- Never accept arbitrary option strings simply because the client displays them.

## Classes (8)

| Slug | Label | Theme |
|---|---|---|
| `warrior` | Warrior | Armor, courage, front-line adventure |
| `paladin` | Paladin | Oaths, shields, radiant power |
| `mage` | Mage | Arcane spells and ancient magic |
| `rogue` | Rogue | Stealth, agility, clever tricks |
| `ranger` | Ranger | Wilderness, bows, scouting |
| `druid` | Druid | Nature, plants, transformation motifs |
| `cleric` | Cleric | Healing, sacred symbols |
| `bard` | Bard | Music, storytelling, charisma |

## Ancestry (6)

Human (`human`), Elf (`elf`), Dwarf (`dwarf`), Orc (`orc`), Fae (`fae`), Construct (`construct`).

## Background (6)

Noble (`noble`), Scholar (`scholar`), Wanderer (`wanderer`), Guardian (`guardian`), Artisan (`artisan`), Outlaw (`outlaw`).

## Weapon (8)

Sword (`sword`), Bow (`bow`), Staff (`staff`), Dagger (`dagger`), Axe (`axe`), Spear (`spear`), Hammer (`hammer`), Wand (`wand`).

## Artifact (8)

An artifact is required. There is no `none` option in this category.

| Slug | English label | Portuguese label |
|---|---|---|
| `arcane-seal` | Arcane Seal | Selo Arcano |
| `ancient-ring` | Ancient Ring | Anel Antigo |
| `moon-crystal` | Moon Crystal | Cristal Lunar |
| `runic-compass` | Runic Compass | Bússola Rúnica |
| `shadow-crown` | Shadow Crown | Coroa Sombria |
| `phoenix-feather` | Phoenix Feather | Pena de Fênix |
| `chaos-orb` | Chaos Orb | Orbe do Caos |
| `sun-relic` | Sun Relic | Relíquia Solar |

## Personality (8)

Brave (`brave`), Curious (`curious`), Loyal (`loyal`), Cunning (`cunning`), Kind (`kind`), Stoic (`stoic`), Rebellious (`rebellious`), Mysterious (`mysterious`).

## Aura (8)

Fire (`fire`), Ice (`ice`), Nature (`nature`), Shadow (`shadow`), Light (`light`), Storm (`storm`), Arcane (`arcane`), Void (`void`).

## Companion (8)

| Slug | English label | Portuguese label |
|---|---|---|
| `none` | None | Nenhum |
| `wolf` | Wolf | Lobo |
| `owl` | Owl | Coruja |
| `cat` | Cat | Gato |
| `fox` | Fox | Raposa |
| `raven` | Raven | Corvo |
| `turtle` | Turtle | Tartaruga |
| `dragon` | Dragon | Dragão |

The `none` option represents a character who does not have a companion.

Users must explicitly select this option if they do not want a companion.

## Motivation (8)

Motivation represents the character's primary reason for beginning an adventure.

It is distinct from background and personality:

- Background describes the character's past.
- Personality describes the character's behavior.
- Motivation describes the character's purpose.

| Slug | English label | Portuguese label |
|---|---|---|
| `protection` | Protection | Proteção |
| `freedom` | Freedom | Liberdade |
| `justice` | Justice | Justiça |
| `redemption` | Redemption | Redenção |
| `glory` | Glory | Glória |
| `knowledge` | Knowledge | Conhecimento |
| `revenge` | Revenge | Vingança |
| `adventure` | Adventure | Aventura |

Motivation is required.

No motivation option grants gameplay bonuses, restrictions, or mechanical advantages.

## Character Creator

The approved character creator follows six stages.

Five stages contain character customization choices.

The sixth stage is dedicated exclusively to reviewing and saving the character.

Each customization stage contains two fields or selection categories.

### Step 01 / 06 — Identity

Users select:

- One character class.
- One character name.

Rules:

- Class selection is required.
- Character names must contain 2–32 characters after trimming.
- The default illustration represents all eight classes.
- Selecting a class displays its corresponding illustration.
- The selected class remains active until another class is chosen.
- Hovering does not change the selected class or artwork.

### Step 02 / 06 — Origins

Users select:

- One ancestry.
- One background.

Both selections are required.

On desktop, the categories appear side by side with a subtle vertical divider between their option grids.

On mobile, the categories are arranged vertically without the divider.

### Step 03 / 06 — Equipment

Users select:

- One weapon.
- One artifact.

Both selections are required.

The artifact category does not include `none`.

The companion category is no longer part of this stage.

On desktop, the two categories are displayed side by side with a subtle vertical divider.

On mobile, the categories are arranged vertically.

### Step 04 / 06 — Essence

Users select:

- One personality.
- One aura.

Both selections are required.

The interface follows the established responsive character-selection design.

### Step 05 / 06 — Journey

Users select:

- One companion.
- One motivation.

Both selections require an explicit choice.

The companion category includes `none`.

The motivation category does not include `none`.

Companion and motivation choices are independent of the character's class, ancestry, background, and equipment.

### Step 06 / 06 — Final Review

This stage does not introduce any new customization fields.

The application displays the complete character draft, including:

1. Name.
2. Class.
3. Ancestry.
4. Background.
5. Weapon.
6. Artifact.
7. Personality.
8. Aura.
9. Companion.
10. Motivation.

Users can return to previous stages to modify selections.

All existing draft values must remain preserved.

Saving requires an explicit action.

The application must not save a character automatically when the user enters the review stage.

Validation errors and failed save requests must preserve the current draft.

## Character Creator Navigation

The character creator displays the current stage in the upper-left corner.

The Portuguese/English language selector appears in the upper-right corner.

Progress indicators follow this sequence:

- `01 / 06`
- `02 / 06`
- `03 / 06`
- `04 / 06`
- `05 / 06`
- `06 / 06`

Navigation between stages must preserve the character draft.

Changing the interface language must not modify stored identifiers or selected values.

## Display and Validation

- Each customization option has a stable English slug.
- Portuguese and English labels are displayed according to the selected interface language.
- Stored values remain independent of the interface language.
- The frontend validates required selections before allowing users to continue.
- The backend must independently validate submitted values against the approved catalog.
- The database must enforce compatible constraints.
- The frontend must not be considered the sole source of validation.
- Character illustrations are representative and do not create additional customization fields.
- Draft selections must remain editable until the user explicitly saves the character.

## Implementation Alignment

This document defines the newly approved target catalog.

The current frontend implementation still follows the previous four-stage structure.

The six-stage structure and the newly approved catalog changes must be implemented before enabling the complete character-saving workflow.

### Artifact Changes

The following legacy artifact identifiers are not available in the approved new-character selection interface:

- `none`
- `emerald-amulet`
- `forgotten-tome`
- `timeworn-key`

The approved artifact identifiers include:

- `arcane-seal`
- `shadow-crown`
- `chaos-orb`

The existing artifact identifiers that remain valid must be preserved.

### Companion Changes

The previous companion identifier:

- `dragonling`

Is replaced in the approved catalog by:

- `dragon`

### New Motivation Field

The character model must include a motivation field.

The field must accept exactly one of the eight approved motivation identifiers.

### Required Backend and Database Alignment

Before enabling character saving with the revised catalog, the following components must be aligned:

1. Frontend character data types.
2. Backend request and response types.
3. Backend catalog allowlist validation.
4. Database schema and applicable migrations.
5. API validation tests.
6. Database security and compatibility tests.
7. Existing character data compatibility.
8. Saved-character display and editing behavior.

Existing stored character values must not be deleted or invalidated without reviewing their compatibility and migration requirements.

Legacy values may require compatibility handling or guided user reselection.

New values must not be accepted only through frontend validation.

The API and database changes must be verified before the completed character creator is released.

## Character Export

Character export becomes available after the character has been successfully saved.

The approved export formats are:

| Format | Dimensions | Intended use |
|---|---|---|
| PDF | A4 | Archiving and printing |
| PNG Story/Status | 1080 × 1920 | Instagram Stories and WhatsApp Status |
| PNG Portrait | 1080 × 1350 | Social posts and general sharing |

Each format may use a dedicated visual layout.

All formats must use the saved character data.

Exports must not include authentication credentials, tokens, or internal account identifiers.

Direct publishing integrations with Instagram or WhatsApp are not required for the initial release.

## Future Considerations

- Optional descriptions may explain the fictional history or meaning of each artifact.
- Additional original pixel-art illustrations may represent selected equipment.
- Character randomization may select only valid catalog options.
- New customization options must be introduced through reviewed, version-controlled changes.
- Future catalog revisions must remain compatible with the application's persistence and validation requirements.
- Additional export templates may be considered after the initial three formats are implemented.