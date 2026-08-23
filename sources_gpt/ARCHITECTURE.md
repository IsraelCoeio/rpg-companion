# RPG Companion — Architecture

## Stack

Frontend:
- React
- Vite
- React Router
- Zustand

Backend:
- Firebase Authentication
- Firestore
- Firebase Admin SDK where required

Development:
- Firestore Emulator
- Custom backup / restore / purge utilities

## Routing

Current important routes:

/
 /login
 /register
 /Lobby
 /create-room
 /room/:roomCode
 /characters
 /abilities
 /inventory
 /gallery
 /profile
 *

The root route is intended to become a smart entry point:

Unauthenticated:
    / → /login

Authenticated without a room:
    / → create/join flow

Authenticated with a room:
    / → /room/:roomCode

For now the project assumes approximately one room per user.

## Room architecture

There is only one room route:

    /room/:roomCode

There is intentionally no:

    /room/:roomCode/master

RoomPage determines which interface to render using the user's membership.

Conceptually:

    /room/:roomCode
          |
       RoomPage
          |
    membership.role
       /       \
    master    player
      |          |
 Master UI    Player UI

Do not create separate Master/Player routes unless there is a strong architectural reason.

## Authorization

Route Guards are responsible for navigation and UX:

- Authentication
- Membership
- Redirects
- Preventing unnecessary rendering

Firestore Security Rules are responsible for actual authorization.

The frontend is untrusted. Users can manipulate URLs, React state, Zustand, localStorage, JavaScript, DevTools, and Firebase calls.

Never use Route Guards or hidden UI as a security boundary.

Rules must independently enforce:

- Room membership
- Roles
- Ownership
- Read permissions
- Write permissions
- Master-only operations

Mental model:

Route Guard:
"Should this user reach this page?"

Firestore Rules:
"Can this user actually perform this operation?"

## State

Zustand is used for application state.

Global state should contain genuinely shared application state, not every local UI value.

Zustand must never be treated as trusted authorization information.

## Development philosophy

Prefer:

- Simple
- Explicit
- Understandable
- Maintainable

Avoid premature abstractions and future-proofing that adds complexity without immediate value.

Architecture should evolve through:

Prototype → Refactor → Cleaner architecture → Better UX → Professional patterns

Current code is authoritative when it differs from older documentation.