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

Route protection is centralized through nested Route Guards:

RequireAuth
    |
    +-- /Lobby
    +-- /create-room
    |
    +-- AppShell
          |
          +-- RequireJoinContext → /characters
          +-- RequireMembership → /room/:roomCode

Route Guards are responsible for navigation and UX:

- Authentication
- Membership
- Redirects
- Preventing unnecessary rendering

Protected pages assume their required guards have already passed.

The root route is a smart entry point:

- Authentication restoration is awaited before making a routing decision.
- Unauthenticated → `/login`
- Authenticated without a membership → `/Lobby`
- Authenticated with a membership → `/room/:roomCode`

The redirect currently uses the first membership returned by `getUserMemberships()`.
Multiple-room selection is not implemented yet.

## Room architecture

There is only one room route:

    /room/:roomCode

There is intentionally no:

    /room/:roomCode/master

RoomPage receives verified membership from the routing layer and determines which interface to render.

Conceptually:

    /room/:roomCode
          |
       RoomPage
          |
    membership.role
       /           master    player
      |          |
 Master UI    Player UI

Do not create separate Master/Player routes unless there is a strong architectural reason.

## Authorization

Route Guards are responsible for navigation and UX.

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
