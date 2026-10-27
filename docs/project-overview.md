# RPG Character Creator — Project Overview

**Status:** In development  
**Working title:** RPG Character Creator (final product name TBD)  
**Target timeline:** Three focused development days, with flexibility for testing and fixes.

## Vision

Build a small full-stack web application that looks and feels like a classic pixel-art computer program. Users can register, sign in, create a fictional RPG character, and save their selections to a real PostgreSQL database. Returning users can view and edit their saved character.

This is a **character creator, not a playable RPG**. The project emphasizes software engineering, documentation, API design, persistence, security, testing, and CI/CD within a tightly controlled scope.

## MVP Features

- Email/password registration, sign-in, and sign-out.
- One saved character per authenticated account.
- Four character classes: Warrior, Paladin, Mage, and Rogue.
- Character name and optional gender identity: masculine, feminine, non-binary, or unspecified.
- Three additional predefined choices: origin, artifact, and aura (exact option names to be finalized).
- Save, retrieve, and edit the character through a protected REST API.
- Light and dark themes, with an emerald-and-mint retro color palette.
- Four static class illustrations and small original pixel-art icons for choices.
- Responsive interface with keyboard-accessible controls and readable pixel fonts.

## Architecture and Tooling

| Layer | Planned technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| Tests | Vitest, Supertest, API integration tests |
| Version control and planning | GitHub, Issues, branches, pull requests |
| CI/CD | GitHub Actions, Vercel deployments |
| Development environment | GitHub Codespaces |

## Security and Privacy

- Users may access only their own character data.
- The backend validates authentication and allowed choice values; user-supplied IDs are not trusted as authorization.
- Database policies provide per-user isolation where applicable.
- Passwords are managed by the authentication provider and are never stored in the application character table.
- No privileged credentials or private tokens are committed to the repository.
- Before opening registration to the public, provide a concise privacy notice and a process for user data access, correction, and deletion.
- Gender identity is an optional attribute of the **fictional character**, not a required personal profile attribute.

## Out of Scope for the First Release

- Gameplay, combat, leveling, world maps, quests, and multiplayer features.
- Animated or dynamically assembled character sprites.
- Multiple saved characters per account.
- Custom administration dashboard.
- Google sign-in (possible follow-up after the core flow works).
- Complex deployment infrastructure.

## Definition of Done

The MVP is complete when:

1. A user can register, sign in, create a character, and save it successfully.
2. The saved data remains available after a reload, logout, and new login.
3. Changes to character selections are persisted without creating duplicate characters.
4. Unauthorized requests and attempts to access another user's data are rejected.
5. Light and dark themes work on desktop and mobile.
6. Essential automated checks and the GitHub Actions workflow pass.
7. The published frontend and backend work outside GitHub Codespaces.
8. The repository documents setup, architecture, tests, and known limitations.

## Workflow

Track work in GitHub Issues. Implement each task in a short-lived branch, validate it locally, open a pull request, and merge after review and successful checks. Keep the main branch deployable. Add optional features only after the MVP acceptance criteria are met.
