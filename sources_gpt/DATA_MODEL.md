# RPG Companion — Firestore Data Model

> This document describes the intended/current structure.
> If it conflicts with the actual code or Firestore emulator, the implementation is authoritative.

## Users

Conceptually:

    users/{userId}

Important fields:

- uid
- username
- createdAt

Users have memberships associated with rooms.

## Memberships

Conceptually:

    users/{userId}/memberships/{roomCode}

Important fields:

- roomCode
- role

Roles currently include:

- player
- master

A membership represents the user's relationship with a room.

## Rooms

Conceptually:

    rooms/{roomCode}

Important fields:

- roomCode
- masterId
- createdAt

A room represents an RPG session/workspace.

## Players

Players belong to a room.

Current player information includes concepts such as:

- userId
- character
- characterId
- nickname
- role
- health
- maxHealth
- attributes
- abilities
- isOnline
- joinedAt
- lastSeenAt

## Attributes

Current attributes:

- strength
- agility
- resistance
- presence
- knowledge

## Abilities

Abilities currently have the conceptual structure:

    {
        name: string,
        description: string
    }

Example:

    {
        name: "Investida Brutal",
        description: "Avança e faz ataque com vantagem."
    }

## Security considerations

Authorization must never depend solely on client-side membership or role data.

Firestore Security Rules must independently verify whether the authenticated user is allowed to access or modify the requested resource.

## Schema evolution

The database is still evolving.

Before changing the schema:

1. Check current code.
2. Check Firestore Rules.
3. Check emulator data.
4. Consider existing production data.
5. Consider indexes.
6. Consider migration/backup requirements.