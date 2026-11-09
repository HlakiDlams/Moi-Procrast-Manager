# Hlaki's Planner (Moi-Procrast-Manager)
Usually for me... Cause eish, the procrastination is real

A mobile-first study + life planner PWA. React + Vite + TypeScript, all data stored
locally in IndexedDB (Dexie), works offline, installable on your phone.

## Run it
```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the build (service worker + install prompt work here)
```

## Install on your phone
Host `dist/` anywhere with HTTPS (GitHub Pages, Netlify, Vercel), open it in Chrome
(Android) or Safari (iPhone), then "Add to Home screen".

## Build stages
- [x] 1. App shell, pink/black theme, navigation, IndexedDB, shared XP/streaks, settings, JSON backup, PWA
- [ ] 2. Today (2-minute starter, Pomodoro, reminders)
- [ ] 3. Study (skill trees, lessons, review deck, Mistral)
- [ ] 4. Planner
- [ ] 5. Self-Care
- [ ] 6. Play
- [ ] 7. Exercise
- [ ] 8. Profile & Goals
- [ ] 9. Homework Checker
