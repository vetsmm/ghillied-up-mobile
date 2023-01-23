const getProperties = () => {
    switch (process.env.APP_ENV) {
        case 'development':
            return {
                appName: `Ghillied Up (DEV)`,
                icon: "./assets/app-icons/dev.png",
                bundleIdentifier: 'com.ghilliedup.dev',
                package: 'com.ghilliedup.dev',
                googleServicesFileIos: './firebase/dev-client/GoogleService-Info.plist',
                googleServicesFileAndroid: "./firebase/dev-client/google-services.json",
            }
        case 'staging':
            return {
                appName: `Ghillied Up`,
                icon: "./assets/app-icons/beta.png",
                bundleIdentifier: 'com.ghilliedup',
                package: 'com.ghilliedup',
                googleServicesFileIos: './firebase/store-bundles/GoogleService-Info.plist',
                googleServicesFileAndroid: "./firebase/store-bundles/google-services.json",
            }
        case 'production':
            return {
                appName: `Ghillied Up`,
                icon: "./assets/app-icons/prod.png",
                bundleIdentifier: 'com.ghilliedup',
                package: 'com.ghilliedup',
                googleServicesFileIos: './firebase/store-bundles/GoogleService-Info.plist',
                googleServicesFileAndroid: "./firebase/store-bundles/google-services.json",
            }
        default:
            return {
                appName: `Ghillied Up`,
                icon: "./assets/app-icons/prod.png",
                bundleIdentifier: 'com.ghilliedup',
                package: 'com.ghilliedup',
                googleServicesFileIos: './firebase/store-bundles/GoogleService-Info.plist',
                googleServicesFileAndroid: "./firebase/store-bundles/google-services.json",
            }
    }
}

export default {
    name: getProperties().appName,
    slug: "ghillied-up",
    owner: "ghilliedup",
    originalFullName: '@ghilliedup/ghillied-up',
    version: "1.1.8",
    orientation: "portrait",
    icon: getProperties().icon,
    scheme: "ghilliedup",
    plugins: [
        "sentry-expo",
        "@react-native-firebase/app",
        "@notifee/react-native",
        [
            "expo-image-picker",
            {
                "photosPermission": "The app accesses your photos when creating ghillies."
            }
        ],
        [
            "expo-build-properties",
            {
                "ios": {
                    "useFrameworks": "static"
                },
                "android": {
                    "compileSdkVersion": 33,
                },
            }
        ],
    ],
    splash: {
        image: "./assets/logos/splash.png",
        resizeMode: "contain",
        backgroundColor: "#1E4C69"
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: getProperties().bundleIdentifier,
        googleServicesFile: getProperties().googleServicesFileIos,
        infoPlist: {
            UIBackgroundModes: [
                "fetch",
                "remote-notification"
            ]
        },
        associatedDomains: [
            "applinks:ghilliedup.com",
            "applinks:ghilliedup.com.*",
            "webcredentials:ghilliedup.com",
            "webcredentials:ghilliedup.com.*",
            "activitycontinuation:ghilliedup.com",
            "activitycontinuation:ghilliedup.com.*"
        ],
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/logos/ic_launcher.png",
            backgroundColor: "#1E4C69"
        },
        package: getProperties().package,
        googleServicesFile: getProperties().googleServicesFileAndroid,
        intentFilters: [
            {
                action: "MAIN",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "ghilliedup.com",
                },
                category: [
                    "LAUNCHER"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/ghillies/detail"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/ghillies/invite"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/posts/detail"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/auth/activate/*"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/auth/password-reset/*"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
            {
                action: "VIEW",
                autoVerify: true,
                data: {
                    scheme: "https",
                    host: "*.ghilliedup.com",
                    pathPrefix: "/auth/confirm-subnet/*"
                },
                category: [
                    "BROWSABLE",
                    "DEFAULT"
                ]
            },
        ]
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
            projectId: "975262d5-696e-4258-a256-1b9cbd12ff53",
            experienceId: "@ghilliedup/ghillied-up",
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

