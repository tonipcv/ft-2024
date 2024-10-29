import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: "ft-app-react",
  slug: "ft-app-react",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#121214"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.ftappreact",
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#121214"
    },
    package: "com.ftappreact"
  },
  plugins: [
    "expo-router",
    [
      "onesignal-expo-plugin",
      {
        mode: "development"
      }
    ]
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true
  },
  extra: {
    oneSignalAppId: process.env.ONE_SIGNAL_APP_ID,
    eas: {
      projectId: "your-project-id"
    }
  }
};

export default config;
