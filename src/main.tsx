import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { isNative } from './lib/platform'
import { applySavedScale } from './lib/settings'
import { applySavedTheme } from './lib/themes'

applySavedScale()
applySavedTheme()

// The Android app ships its files inside the APK, so it doesn't need a service worker.
if (!isNative) registerSW({ immediate: true })

// Ask the browser not to evict our IndexedDB data when storage is low.
navigator.storage?.persist?.().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
