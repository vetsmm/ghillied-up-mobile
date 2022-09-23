import axios from "axios";
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {PageInfo} from "../models/pagination/types";
import {NotificationInputDto} from "../models/notifications/notification-input.dto";
import {BaseNotificationDto} from "../models/notifications/notification.dto";
import {UnreadNotificationsDto} from "../models/notifications/unread-notifications.dto";

const getNotifications = async (queryBody?: NotificationInputDto)
    : Promise<BaseApiResponse<BaseNotificationDto[], PageInfo>> => {
    return axios.post(`${AppConfig.apiUrl}/notifications/`, queryBody)
        .then(response => {
            return response.data;
        });
}

const markNotificationsAsRead = async (notificationIds: string[]): Promise<BaseApiResponse<void, never>> => {
    return axios.post(`${AppConfig.apiUrl}/notifications/mark-as-read`, {notificationIds})
        .then(response => {
            return response.data;
        });
}

const getUserUnreadNotificationCount = async (): Promise<BaseApiResponse<UnreadNotificationsDto, never>> => {
    return axios.get(`${AppConfig.apiUrl}/notifications/unread-count`)
        .then(response => {
            return response.data;
        });
}

const markAllNotificationsAsRead = async (): Promise<BaseApiResponse<void, never>> => {
    return axios.post(`${AppConfig.apiUrl}/notifications/mark-all-as-read`)
        .then(response => {
            return response.data;
        });
}

const notificationService = {
    getNotifications,
    markNotificationsAsRead,
    getUserUnreadNotificationCount,
    markAllNotificationsAsRead
}

export default notificationService;
