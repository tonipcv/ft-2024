export default {
  expo: {
    name: "seu-app-name",
    slug: "seu-app-slug",
    version: "1.0.0",
    scheme: "myapp",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.seuapp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.seuapp"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      eas: {
        projectId: "SEU_PROJECT_ID"
      }
    }
  }
};