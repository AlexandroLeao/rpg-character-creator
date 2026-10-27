# RPG Character Creator — System Requirements

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements
for the RPG Character Creator application.

The project is a lightweight full-stack web application focused on
character customization, user authentication, and persistent data
storage.

### 1.2 Scope

Users can register, sign in, create a fictional RPG character,
customize predefined attributes, and save their choices.

The application provides a retro pixel-art interface inspired by
classic computer systems.

The project is a character creator, not a playable RPG.

---

## 2. Actors

### Guest

An unauthenticated visitor who can access the authentication pages.

### Authenticated User

A registered user who can create, view, and update their own character.

---

## 3. Functional Requirements

### FR-01 — User Registration

The system shall allow users to create an account using an email
address and password through Supabase Auth.

### FR-02 — User Authentication

The system shall allow registered users to sign in and sign out.

### FR-03 — Protected Access

The system shall restrict character management operations to
authenticated users.

### FR-04 — Character Creation

The system shall allow authenticated users to create one fictional
RPG character.

### FR-05 — Character Name

The system shall require a character name containing between
2 and 32 characters.

### FR-06 — Character Class

The system shall provide four predefined character classes:

- Warrior
- Paladin
- Mage
- Rogue

Each class shall have a static pixel-art illustration.

### FR-07 — Character Gender Identity

The system shall allow users to optionally select a gender identity
for their fictional character:

- Masculine
- Feminine
- Non-binary
- Unspecified

Character class selection and artwork shall not restrict
gender identity choices.

### FR-08 — Character Attributes

The system shall allow users to select predefined options for:

- Origin
- Artifact
- Aura

Each choice shall be represented by a pixel-art-style icon.

### FR-09 — Persistent Storage

The system shall store character data in a PostgreSQL database.

### FR-10 — Character Retrieval

The system shall allow authenticated users to retrieve their
previously saved character.

### FR-11 — Character Updates

The system shall allow users to modify and save their character
without creating duplicate records.

### FR-12 — Theme Switching

The system shall provide light and dark interface themes.

The visual identity shall use emerald, mint, dark green,
and near-black colors.

### FR-13 — User Feedback

The system shall display appropriate messages for successful
operations, validation errors, and failed requests.

---

## 4. Non-Functional Requirements

### NFR-01 — Security

Authentication shall be handled by Supabase Auth.

The backend shall validate authentication tokens before accessing
protected resources.

Users shall only be able to access their own character data.

### NFR-02 — Data Integrity

The backend shall validate submitted character data before
persisting it.

Character classes and attributes shall accept only predefined
allowed values.

### NFR-03 — Usability

The interface shall be simple, intuitive, and consistent with
the retro pixel-art visual identity.

### NFR-04 — Responsiveness

The application shall support desktop and mobile screen sizes.

### NFR-05 — Accessibility

Interactive controls shall support keyboard navigation.

Text, buttons, and form fields shall remain readable in both themes.

### NFR-06 — Maintainability

The project shall follow a modular architecture with separation
between frontend, backend, and database responsibilities.

### NFR-07 — Testability

Critical authentication, validation, and character persistence
operations shall be covered by automated tests.

### NFR-08 — Continuous Integration

The repository shall use GitHub Actions to validate essential
project checks before deployment.

---

## 5. Business Rules

### BR-01

Each authenticated user may own only one character.

### BR-02

A character must have a valid name and class before being saved.

### BR-03

Character attributes must match predefined valid options.

### BR-04

Users cannot read or modify characters belonging to other users.

### BR-05

Updating an existing character must preserve its ownership
and unique identity.

### BR-06

Gender identity is optional and must not affect class availability.

---

## 6. Out of Scope

The initial release will not include:

- Combat or gameplay mechanics
- Character leveling
- Multiplayer functionality
- Animated character sprites
- Multiple characters per account
- Custom character image generation
- Administrative dashboards
- Google OAuth authentication

These features may be evaluated in future versions.

---

## 7. Acceptance Criteria

The requirements are satisfied when:

1. Users can register, sign in, and sign out.
2. Authenticated users can create a character.
3. Character choices are saved in PostgreSQL.
4. Saved characters remain available after signing in again.
5. Users can update their existing characters.
6. Unauthorized access to character data is rejected.
7. The interface supports light and dark themes.
8. The application works on desktop and mobile devices.
9. Essential automated tests and CI checks pass.

---

## 8. Related Documentation

- [Project Overview](./project-overview.md)
- [System Architecture](./architecture.md)
- [Use Case Diagram](./uml/use-cases.puml)
- [Save Character Sequence](./uml/save-character-sequence.puml)
- [Data Model](./uml/data-model.md)