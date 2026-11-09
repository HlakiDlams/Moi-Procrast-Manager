import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'za.hlaki.planner',
  appName: "Hlaki's Planner",
  webDir: 'dist',
  backgroundColor: '#0D0D0D',
  android: {
    backgroundColor: '#0D0D0D',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_planner',
      iconColor: '#FF2E93',
    },
    // Use native HTTP so Mistral API calls aren't blocked by CORS inside the app
    CapacitorHttp: { enabled: true },
  },
}

export default config
