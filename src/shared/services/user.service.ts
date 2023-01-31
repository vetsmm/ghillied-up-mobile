import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {UserPushNotificationSettingsDto} from "../models/settings/user-push-notification-settings.dto";
import {BaseApiResponse} from "../models/base-api-response";
import {UpdateUserInput} from "../models/users/update-user.input";
import {UserOutput} from "../models/users/user-output.dto";

const updateUser = async (updateUserDto: UpdateUserInput)
    : Promise<BaseApiResponse<UserPushNotificationSettingsDto, never>> => {
    return axios.patch(`${AppConfig.apiUrl}/users/self`, updateUserDto);
}

const deactivateUser = async (): Promise<void> => {
    return axios.post(`${AppConfig.apiUrl}/users/deactivate`);
}

const updatePhoneNumber = async (phoneNumber: string): Promise<void> => {
    return axios.put(`${AppConfig.apiUrl}/users/change-phone-number`, { phoneNumber });
}

const checkPhoneNumberVerificationCode = async (code: string): Promise<void> => {
    return axios.post(`${AppConfig.apiUrl}/users/check-verification-code`, { code });
}

const resendPhoneNumberVerificationCode = async (): Promise<void> => {
    return axios.post(`${AppConfig.apiUrl}/users/resend-verification-code`);
}

const deletePhoneNumber = async (): Promise<UserOutput> => {
    return axios.delete(`${AppConfig.apiUrl}/users/phone-number`)
        .then(response => response.data);
}

const userService = {
    updateUser,
    deactivateUser,
    checkPhoneNumberVerificationCode,
    updatePhoneNumber,
    resendPhoneNumberVerificationCode,
    deletePhoneNumber
}

export default userService;
