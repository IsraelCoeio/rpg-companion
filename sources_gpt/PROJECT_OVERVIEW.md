# RPG Companion — Project Overview

## What is RPG Companion?

RPG Companion is a mobile-first web app designed to let a group, including complete tabletop RPG beginners, start playing quickly.

Its philosophy is:

> Remove bureaucracy, not imagination.

The app replaces fragile paper character sheets with persistent digital player hubs and gives the Master an interface for managing the essential game state.

The app should simplify RPGs without replacing storytelling, improvisation, social interaction, or imagination.

## Current state

RPG Companion is a working prototype already used in real RPG sessions with friends.

It is currently system-agnostic. There is no fixed D&D/Pathfinder/etc. ruleset. The Master decides the rules and can keep things as simple as necessary.

## Current flow

1. User registers/logs in.
2. User enters the lobby.
3. Master creates a room using a room code; creator automatically becomes Master through an atomic Firestore write.
4. Other users enter an existing room code; the client checks that the room exists before proceeding.
5. Players choose a predefined character.
6. Users enter the room.
7. Master controls essential information such as player HP.
8. Players access their attributes and abilities.

## Current features

- Authentication
- Lobby
- Room creation
- Room joining with room-existence validation
- Master/player roles
- Character selection
- Room interface
- Player attributes
- Player abilities
- Master HP control
- Firestore authorization rules for room, membership, and player operations

## Product direction

RPG Companion should progressively become the player's RPG hub.

Potential future features:

- Inventory
- Equipment / armor
- Character progression
- Leveling
- Attribute upgrades
- Maps
- Battle maps
- Additional session tools

Do not add complexity merely because other RPG systems have it.

## UX direction

Mobile-first.

Desired aesthetic:

- Dark
- Modern fantasy
- Minimalist
- Elegant
- Readable
- Immersive
- Subtle decoration

Avoid pixel art, hand-drawn aesthetics, excessive cartoon styling, clutter, and unnecessary animation.

The Player should feel like they have an RPG hub, not a database.
