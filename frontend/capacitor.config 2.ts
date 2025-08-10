import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.toni.moodtracker',
  appName: 'MoodTracker',
  webDir: 'dist/frontend', // relativ zu frontend/
  server: {
    androidScheme: 'https'
  }
};

export default config;