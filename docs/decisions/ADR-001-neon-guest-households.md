# ADR-001: Neon persistence with guest household sessions

## Status

Accepted

## Context

ChoiceGuard needs to retain family profiles, meal logs, grocery plans, pantry lots, and recall actions without forcing sign-in before a food decision. The MVP uses Neon Postgres through the serverless HTTP driver and may later add LINE or account-based identity.

## Decision

Use a Neon Postgres schema with a server-generated household UUID. The browser receives only an `httpOnly`, `secure` in production, `sameSite=lax` cookie containing an HMAC-signed household token. Every persistence query scopes data to that household UUID. `DATABASE_URL` and `HOUSEHOLD_SESSION_SECRET` stay server-only environment variables.

## Consequences

- People can use ChoiceGuard immediately and keep data across visits on one browser.
- Clearing cookies starts a new household until account linking is added.
- The MVP must not use localStorage as an authorization boundary or accept household IDs from clients.
- Database changes ship as ordered SQL migrations through `npm run db:migrate`.
