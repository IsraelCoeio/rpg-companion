# RPG Companion — Roadmap

## NOW

### Security & navigation
- [x] Centralize authentication and membership checks with Route Guards.
- [x] Enforce authorization through Firestore Rules.
- [x] Restrict UI/pages according to authentication and room membership.
- [x] Make `/` intelligently redirect authenticated users to their room.
- [ ] Finish logged-in UI state.
- [x] Validate room existence before allowing the join flow to continue.

### Room / gameplay
- Improve Master player management.
- Fix attribute ordering.
- Refactor HP changes using packets.

### Account
- Logoff.
- Keep-me-logged-in.

## NEXT

- Username validation.
- Portuguese localization.
- Improve project file structure.

## LATER

- Dice roller.
- Multiple-room support / room selection.
- Inventory and equipment.
- Character progression.
- Maps / battle maps.
- Additional RPG session tools.

## Product direction

The room is currently the user's RPG home. Keep the architecture simple until multiple rooms become an actual requirement.

Features should reduce friction during real RPG sessions without replacing the imaginative/social part of the game.
