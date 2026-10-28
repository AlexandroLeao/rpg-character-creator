# RPG Character Creator — Customization Catalog

**Status:** Approved initial catalog; labels and artistic descriptions may be polished without changing the data contract.
**Language:** All option labels, stored slugs, UI messages, and code use English.

## Rules

- Exactly one character per authenticated account.
- All users can combine any class with any ancestry, background, weapon, artifact, personality, aura, or companion. No gameplay balancing or class restrictions are implemented.
- Every saved character has a non-empty name (2–32 characters after trimming) and one valid choice from each field below.
- `None` is a valid option for artifact and companion.
- **No gender, sex, gender identity, or visual-body-selection field exists.** The dual-character class illustration is purely representative.
- Persist stable **slugs** (e.g., `moon-crystal`) rather than English labels. Use the catalog for frontend display and server-side allowlist validation.
- The catalog can be extended via version-controlled configuration and reviewed database constraints. Never accept arbitrary option strings simply because the client displays them.

## Classes (8)

| Slug | Label | Theme |
|---|---|---|
| `warrior` | Warrior | Armor, courage, front-line adventure |
| `paladin` | Paladin | Oaths, shields, radiant power |
| `mage` | Mage | Arcane spells and old tomes |
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

## Artifact (9)

None (`none`), Emerald Amulet (`emerald-amulet`), Ancient Ring (`ancient-ring`), Moon Crystal (`moon-crystal`), Runic Compass (`runic-compass`), Forgotten Tome (`forgotten-tome`), Phoenix Feather (`phoenix-feather`), Timeworn Key (`timeworn-key`), Sun Relic (`sun-relic`).

## Personality (8)

Brave (`brave`), Curious (`curious`), Loyal (`loyal`), Cunning (`cunning`), Kind (`kind`), Stoic (`stoic`), Rebellious (`rebellious`), Mysterious (`mysterious`).

## Aura (8)

Fire (`fire`), Ice (`ice`), Nature (`nature`), Shadow (`shadow`), Light (`light`), Storm (`storm`), Arcane (`arcane`), Void (`void`).

## Companion (8)

None (`none`), Wolf (`wolf`), Owl (`owl`), Cat (`cat`), Fox (`fox`), Raven (`raven`), Turtle (`turtle`), Dragonling (`dragonling`).

## Display and Validation

- Each option has a stable slug, English label, and optional short descriptive helper text or accessible icon.
- Class art displays two different-looking examples of that class in a single static illustration. It is not a gameplay attribute and is never stored in the database.
- The frontend uses a shared data-driven catalog. The backend independently validates submitted values against its approved catalog version.
- Draft randomization selects a valid value per field and may suggest a fictional character name. It must not use or alter the user's account display name, email, or password.
- The editor allows manual changes to every randomized choice before saving.
- If a new option is added in a later release, update validation, documentation, and database compatibility in one reviewed change.
