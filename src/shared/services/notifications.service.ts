import { axiosInstance as axios } from './api'
import AppConfig from "../../config/app.config";
import {BaseApiResponse} from "../models/base-api-response";
import {BaseNotificationDto} from "../models/notifications/notification.dto";
import {UnreadNotificationsDto} from "../models/notifications/unread-notifications.dto";
import {ReadNotificationsInputDto} from "../models/notifications/read-notifications-input.dto";

const getNotifications = async (page: number, take: number)
    : Promise<BaseApiResponse<BaseNotificationDto[], never>> => {
    return axios.get(`${AppConfig.apiUrl}/notifications?page=${page}&take=${take}`)
        .then(response => {
            return response.data;
        });
}

const markNotificationsAsRead = async (notificationIds: ReadNotificationsInputDto): Promise<BaseApiResponse<void, never>> => {
    return axios.post(`${AppConfig.apiUrl}/notifications/mark-as-read`, notificationIds)
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
