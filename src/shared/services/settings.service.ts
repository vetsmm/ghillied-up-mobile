import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {Platform} from "react-native";
import * as Sentry from 'sentry-expo';
import {FlashMessageRef} from "../../components/flash-message/index";

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
      Sentry.Native.captureException(new Error(error));
    })
}

const settingsService = {
  addPushTokenToAccount
}

export default settingsService;
