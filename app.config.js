export default {
    name: "Ghillied Up",
    slug: "ghillied-up",
    owner: "ghilliedup",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logos/logo-square.png",
    scheme: "ghilliedup",
    notification: {
        "icon": "./assets/logos/notification/Icon-1024.png"
    },
    plugins: [
        "sentry-expo",
        [
            "expo-notifications",
            {
                "icon": "./assets/logos/notification/Icon-96.png",
                "color": "#1e4c69"
            }
        ]
    ],
    splash: {
        image: "./assets/logos/splash.png",
        resizeMode: "contain",
        backgroundColor: "#1E4C69"
    },
    updates: {
        fallbackToCacheTimeout: 0,
        url: "https://u.expo.dev/975262d5-696e-4258-a256-1b9cbd12ff53"
    },
    runtimeVersion: {
        policy: "sdkVersion"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.ghilliedup",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/logos/ic_launcher.png",
            backgroundColor: "#1E4C69"
        },
        package: "com.ghilliedup"
    },
    web: {
        favicon: "./assets/logos/favicon.png"
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
        eas: {
            projectId: "975262d5-696e-4258-a256-1b9cbd12ff53"
        },
        amplitudeApiKey: process.env.AMPLITUDE_API_KEY,
        sentry: {
            dsn: process.env.SENTRY_EXPO_DSN,
        },
        idme: {
            redirectUri: "com.ghilliedup.auth.app://idme",
            clientId: process.env.IDME_CLIENT_ID,
            clientSecret: process.env.IDME_CLIENT_SECRET
        }
    }
}

