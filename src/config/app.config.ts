import Constants from "expo-constants";
import {Platform} from "react-native";

const extra = Constants.manifest?.extra ?? {};

const ENV = {
    dev: {
        appUrls: ['exp://127.0.0.1:19000/--/', "https://ghilliedup.com", 'ghilliedup://', 'exp://192.168.0.210:8081/--/',],
        apiUrl: 'http://192.168.0.210:3333',
        amplitudeApiKey: null,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentry: {
            dsn: "https://2d1a539e23db489fba7b6ef7ad1382ba@o228030.ingest.sentry.io/6615776",
            env: 'development',
            enableInExpoDevelopment: false,
            enableNative: false,
            enableDebug: false,
            enableNativeCrashHandling: false,
            enableAutoPerformanceTracking: false,
            enableOutOfMemoryTracking: false,
        }
    },
    qa: {
        appUrls: ['ghilliedup://', "https://ghilliedup.com"],
        apiUrl: 'https://api.ghilliedupqa.com',
        amplitudeApiKey: extra.amplitudeApiKey,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentry: {
            dsn: "https://2d1a539e23db489fba7b6ef7ad1382ba@o228030.ingest.sentry.io/6615776",
            env: 'qa',
            enableInExpoDevelopment: false,
            enableNative: true,
            enableDebug: false,
            enableNativeCrashHandling: true,
            enableAutoPerformanceTracking: true,
            enableOutOfMemoryTracking: true,
        }
    },
    prod: {
        appUrls: ['ghilliedup://', "https://ghilliedup.com"],
        apiUrl: 'https://api.ghilliedup.com',
        amplitudeApiKey: extra.amplitudeApiKey,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentry: {
            dsn: "https://2d1a539e23db489fba7b6ef7ad1382ba@o228030.ingest.sentry.io/6615776",
            env: 'prod',
            enableInExpoDevelopment: false,
            enableNative: true,
            enableDebug: false,
            enableNativeCrashHandling: true,
            enableAutoPerformanceTracking: true,
            enableOutOfMemoryTracking: true,
        }
    },
};

const getEnvVars = (appEnv = Constants.manifest?.extra?.appEnv) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else if (appEnv === 'staging') {
        return ENV.qa;
    } else if (appEnv === 'production') {
        return ENV.prod;
    }

    return ENV.qa;
};

const {apiUrl, amplitudeApiKey, idme, sentry, appUrls} = getEnvVars();

export default {
    // use 10.0.2.2 for Android to connect to host machine
    apiUrl: apiUrl,
    appUrls: appUrls,
    nativeClientId: "",
    experienceId: extra.eas.experienceId,
    debugMode: __DEV__,
    extra,
    AuthObject: "GhilliedUpAuthObject",
    CredentialsObject: "GhilliedUpCredentialsObject",
    sentry: sentry,
    amplitudeApiKey: amplitudeApiKey,
    useExpoAuthProxy: Platform.select({ web: false, default: true }),
    oauth: {
        idme: {
            redirectUrl: extra.idme.redirectUri,
            clientId: extra.idme.clientId,
            clientSecret: extra.idme.clientSecret,
            scopes: ["military"],
            additionalHeaders: { Accept: "application/json" },
            serviceConfiguration: {
                authorizationEndpoint: idme.authorizationEndpoint,
                tokenEndpoint: idme.tokenEndpoint,
            }
        }
    },
    timeouts: {
        reportDialogs: 5000
    },
    links: {
        privacyPolicy: "https://ghilliedup.com/privacy",
        termsOfService: "https://ghilliedup.com/terms",
        contactUs: "https://ghilliedup.com/contact-us",
        faq: "https://ghilliedup.com/faq",
        aboutUs: "https://ghilliedup.com/about",
        facebook: "https://facebook.com/ghilliedupapp",
        instagram: "https://instagram.com/ghilliedupapp",
        twitter: "https://twitter.com/ghilliedupapp",
        linkedin: "https://linkedin.com/company/ghilliedup",
        discord: "https://discord.gg/4yYFgZVeaH",
        supportEmail: "mailto:support@ghilliedup.com",
        ghillieOwnershipEmail: "request.ghillie@ghilliedup.com",
    }
};

export const APP_DATE_FORMAT = 'MM/DD/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'MM/DD/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'MM/DD/YYYY';

export const APP_LOCAL_DATE_FORMAT_FULL = 'MMMM D, YYYY';
export const APP_TIMESTAMP_FORMAT_MM_DD_YY = 'MM/DD/YY HH:mm';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
