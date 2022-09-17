import axios from "axios";
import AppConfig from "../../config/app.config";
import * as Sentry from 'sentry-expo';
import {Platform} from "react-native";

const addPushTokenToAccount = async (token): Promise<void> => {
  axios.post(`${AppConfig.apiUrl}/settings/device-token`, {
    deviceToken: token,
    phonePlatform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
  })
    .catch(error => {
      console.log("Error adding push token to account", error);
      // Sentry.Native.captureException(new Error(error));
    })
}

const settingsService = {
  addPushTokenToAccount
}

export default settingsService;
