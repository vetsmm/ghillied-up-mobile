import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {UserPushNotificationSettingsDto} from "../models/settings/user-push-notification-settings.dto";
import {BaseApiResponse} from "../models/base-api-response";
import {UpdateUserInput} from "../models/users/update-user.input";

const updateUser = async (updateUserDto: UpdateUserInput)
    : Promise<BaseApiResponse<UserPushNotificationSettingsDto, never>> => {
    return axios.patch(`${AppConfig.apiUrl}/users/self`, updateUserDto);
}

const userService = {
    updateUser,
}

export default userService;
