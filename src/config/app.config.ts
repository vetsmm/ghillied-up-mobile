import Constants from "expo-constants";
import {Platform} from "react-native";

const extra = Constants.manifest?.extra ?? {};

const ENV = {
    dev: {
        appUrl: 'exp://192.168.0.210:19000/--/',
        apiUrl: 'http://192.168.0.210:3333',
        amplitudeApiKey: null,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentryEnvironment: 'development',
    },
    qa: {
        appUrl: 'ghilliedup://',
        apiUrl: 'https://api.ghilliedupqa.com',
        amplitudeApiKey: extra.amplitudeApiKey,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentryEnvironment: 'qa'
    },
    prod: {
        appUrl: 'ghilliedup://',
        apiUrl: 'https://api.ghilliedup.com',
        amplitudeApiKey: extra.amplitudeApiKey,
        idme: {
            authorizationEndpoint: 'https://api.id.me/oauth/authorize',
            tokenEndpoint: 'https://api.id.me/oauth/token',
        },
        sentryEnvironment: 'prod'
    },
};

const getEnvVars = (env = Constants.manifest?.releaseChannel) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else if (env === 'qa') {
        return ENV.qa;
    } else if (env === 'prod') {
        return ENV.prod;
    }

    return ENV.qa;
};

const {apiUrl, amplitudeApiKey, idme, sentryEnvironment, appUrl} = getEnvVars();

export default {
    // use 10.0.2.2 for Android to connect to host machine
    apiUrl: apiUrl,
    appUrl: appUrl,
    nativeClientId: "",
    // debug mode
    debugMode: __DEV__,
    extra,
    AuthObject: "GhilliedUpAuthObject",
    CredentialsObject: "GhilliedUpCredentialsObject",
    sentryDsn: "https://2d1a539e23db489fba7b6ef7ad1382ba@o228030.ingest.sentry.io/6615776",
    sentryEnvironment: sentryEnvironment,
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
    }
};
