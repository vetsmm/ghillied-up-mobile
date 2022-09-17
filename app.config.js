export default {
  name: "Ghillied Up",
  slug: "ghillied-up",
  owner: "ghilliedup",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "ghilliedup",
  notification: {
    "icon": "./assets/square-logo.png"
  },
  plugins: [
    "sentry-expo",
    [
      "expo-notifications",
      {
        "icon": "./assets/square-logo.png",
        "color": "#1e4c69",
        "sounds": [
          "./assets/notification/notification.wav",
        ]
      }
    ]
  ],
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.vetsmm.ghilliedup"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.vetsmm.ghilliedup"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: "vetsmm",
          project: "ghillied-up-mobile",
          authToken: process.env.SENTRY_EXPO_AUTH_TOKEN
        }
      }
    ]
  },
  extra: {
    amplitudeApiKey: process.env.AMPLITUDE_API_KEY,
    sentry: {
      dsn: process.env.SENTRY_EXPO_DSN
    }
  }
}

