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

## Android app (Huawei etc.)
Every push builds an APK with GitHub Actions (`.github/workflows/android.yml`) and
publishes it as the **apk-latest** release. On the phone: open the repo's Releases page,
download `hlakis-planner.apk`, tap it, and allow "install unknown apps".
Updates install over the top and keep your data (the APK is always signed with the
same key, `android/app/hlaki-planner.keystore` - personal use only, not for Play Store).

The Android app adds scheduled reminders that fire while the app is closed and
alarms handed to the phone's Clock app (`ClockPlugin.java`).

**Huawei:** Settings -> Battery -> App launch -> Hlaki's Planner -> Manage manually,
and turn on all three switches, or reminders may be blocked.

Local Android build (needs Android SDK): `npm run build && npx cap sync android && cd android && ./gradlew assembleDebug`

## Web / PWA
Host `dist/` anywhere with HTTPS, open it in a browser, then "Add to Home screen"
(or "Install app" in Edge/Chrome on Windows).

## Build stages
- [x] 1. App shell, pink/black theme, navigation, IndexedDB, shared XP/streaks, settings, JSON backup, PWA
- [x] 2. Android app + Today (2-minute starter, Pomodoro, reminders, alarms)
- [~] 3. Study: Maths, Afrikaans EAT, EGD, IT, English (62 lessons, 340 questions), hearts, review deck done; other subjects, own content + Mistral next
- [x] 4. Planner (auto week, drag edit, planned vs done, auto-reschedule)
- [ ] 5. Self-Care
- [ ] 6. Play
- [ ] 7. Exercise
- [~] 8. Profile & Goals (About me done; goals next)
- [ ] 9. Homework Checker
- [ ] 10. Windows app
