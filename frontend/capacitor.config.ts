import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.toni.moodtracker',
  appName: 'MoodTracker',
  webDir: 'dist/moodtracker/browser', // <- angepasster Pfad!
  server: {
    androidScheme: 'https'
  }
};

export default config;
