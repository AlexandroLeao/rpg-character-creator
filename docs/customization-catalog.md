# Adventure Files — Customization Catalog

- **Status:** Approved character customization catalog; backend and database alignment for the revised artifact options is pending.
- **Language:** Code, technical documentation, and stored identifiers use English. User-facing labels and messages support Portuguese and English.

## Rules

- Exactly one character per authenticated account.
- All users can combine any class with any ancestry, background, weapon, artifact, personality, aura, or companion.
- No gameplay balancing or class restrictions are implemented.
- Every saved character must have a non-empty name (2–32 characters after trimming) and one valid choice from each field.
- Every customization category requires an explicit selection.
- `None` is a valid option only for companion.
- An artifact must always be selected from the eight available artifacts.
- **No gender, sex, gender identity, or visual-body-selection field exists.** The dual-character class illustration is purely representative.
- Persist stable slugs (e.g., `moon-crystal`) rather than translated labels.
- The catalog defines the approved values for frontend display and server-side validation.
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
| `emerald-amulet` | Emerald Amulet | Amuleto de Esmeralda |
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

None (`none`), Wolf (`wolf`), Owl (`owl`), Cat (`cat`), Fox (`fox`), Raven (`raven`), Turtle (`turtle`), Dragonling (`dragonling`).

The `none` option represents a character who does not have a companion.

Users must explicitly select this option if they do not want a companion.

## Character Creator

The character creator follows four stages.

### Step 01 — Class and Name

Users select one of eight classes and enter a character name.

- Class selection is required.
- Character names must contain 2–32 characters after trimming.
- The default illustration represents all eight classes.
- Selecting a class displays its corresponding illustration.
- The selected class remains active until another class is chosen.

### Step 02 — Origins

Users select:

- One ancestry.
- One background.

Both selections are required.

### Step 03 — Equipment

Users select:

- One weapon.
- One artifact.
- One companion.

All three categories require an explicit selection.

Only the companion category includes `none`.

The interface uses:

- Eight weapon options.
- Eight artifact options.
- Eight companion options.

On desktop, the three categories are presented in separate columns with subtle vertical dividers.

On mobile, the categories are arranged vertically for readability and touch interaction.

The selected options must remain preserved when navigating backward or forward.

### Step 04 — Essence and Review

Users select:

- One personality.
- One aura.

The application then presents the complete character draft for review.

Users must be able to return to earlier steps and modify their selections.

Saving must occur only after explicit confirmation.

## Display and Validation

- Each customization option has a stable English slug.
- Portuguese and English labels are displayed according to the selected interface language.
- Stored values must remain independent of the interface language.
- The backend must independently validate submitted values against the approved catalog.
- The database must enforce compatible constraints.
- The frontend must not be considered the sole source of validation.
- Character illustrations are representative and do not create additional customization fields.
- Draft selections must remain editable until the user explicitly saves the character.

## Implementation Alignment

The approved artifact catalog has been revised.

The following options have been removed from the intended artifact selection:

- `none`
- `forgotten-tome`
- `timeworn-key`

The following options have been added:

- `shadow-crown`
- `chaos-orb`

The frontend character creator uses the revised catalog.

Before enabling character saving with the revised artifacts, the following components must be aligned:

1. Backend artifact allowlist validation.
2. Database constraints and applicable migrations.
3. API validation tests.
4. Database security and compatibility tests.
5. Existing character data compatibility, if applicable.

Existing stored character values must not be deleted or invalidated without reviewing their compatibility and migration requirements.

The API and database changes must be verified before the completed character creator is released.

## Future Considerations

- Optional descriptions may explain the fictional history or meaning of each artifact.
- Additional original pixel-art illustrations may represent selected equipment.
- Character randomization may select only valid catalog options.
- New customization options must be introduced through reviewed, version-controlled changes.
- Future catalog revisions must remain compatible with the application's persistence and validation requirements.