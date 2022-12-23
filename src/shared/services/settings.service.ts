import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {Platform} from "react-native";
import {FlashMessageRef} from "../../app/App";

const addPushTokenToAccount = async (token): Promise<void> => {
  axios.post(`${AppConfig.apiUrl}/settings/device-token`, {
    deviceToken: token,
    phonePlatform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
  })
    .catch(error => {
      FlashMessageRef.current?.showMessage({
        message: 'Error adding push token to account',
        type: 'danger',
        style: {
          justifyContent: 'center',
          alignItems: 'center',
        }
      });
      console.log("Error adding push token to account", error.data.error.context);
      // Sentry.Native.captureException(new Error(error));
    })
}

const settingsService = {
  addPushTokenToAccount
}

export default settingsService;
