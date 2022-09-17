import Constants from "expo-constants";

const extra = Constants.manifest?.extra ?? {};

const ENV = {
  dev: {
    apiUrl: 'https://api.ghilliedupqa.com',
    amplitudeApiKey: null,
  },
  qa: {
    apiUrl: 'https://api.ghilliedupqa.com',
    amplitudeApiKey: extra.amplitudeApiKey,
    // Add other keys you want here
  },
  prod: {
    apiUrl: 'https://api.ghilliedup.com',
    amplitudeApiKey: extra.amplitudeApiKey,
    // Add other keys you want here
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

const {apiUrl, amplitudeApiKey} = getEnvVars();

export default {
  // use 10.0.2.2 for Android to connect to host machine
  apiUrl: apiUrl,
  nativeClientId: "",
  // debug mode
  debugMode: __DEV__,
  extra,
  AuthObject: "GhilliedUpAuthObject",
  sentryDsn: extra.sentry.dsn,
  amplitudeApiKey: amplitudeApiKey,
};
