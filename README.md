# RPG Companion

Sprint 1 foundation for a mobile-first dark fantasy React app.

## Stack

- Vite + React (JavaScript)
- Tailwind CSS v4
- shadcn/ui base setup
- React Router
- Zustand

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

```text
src/
  components/
  pages/
  hooks/
  services/
  store/
  firebase/
  assets/
  data/
  utils/
```

## Sprint 1 scope

- Complete app shell
- Responsive mobile header
- Bottom navigation
- Full route map
- Placeholder screens for all pages
- Theme, fonts, colors, spacing tokens
- Static character templates in `public/data/characters.json`

## Firebase setup

1. Copy `.env.example` to `.env`.
2. Fill all `VITE_FIREBASE_*` variables with your Firebase Web App credentials.
3. Restart the dev server after updating environment variables.
