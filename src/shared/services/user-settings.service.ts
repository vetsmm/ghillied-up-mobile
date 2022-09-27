import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {UserPushNotificationSettingsDto} from "../models/settings/user-push-notification-settings.dto";
import {BaseApiResponse} from "../models/base-api-response";
import {UserPushNotificationsInputDto} from "../models/settings/user-push-notifications-input.dto";

const getPushNotificationSettings = async (): Promise<BaseApiResponse<UserPushNotificationSettingsDto, never>> => {
    const response = await axios.get(`${AppConfig.apiUrl}/settings/push-notifications`);
    return response.data;
}

const updatePushNotificationSettings = async (settings: UserPushNotificationsInputDto): Promise<BaseApiResponse<UserPushNotificationSettingsDto, never>> => {
    const response = await axios.put(`${AppConfig.apiUrl}/settings/push-notifications`, settings);
    return response.data;
}

const userSettingsService = {
    getPushNotificationSettings,
    updatePushNotificationSettings
}

export default userSettingsService;
