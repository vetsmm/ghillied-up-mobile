import {BaseNotificationDto} from "../models/notifications/notification.dto";
import {NotificationType} from "../models/notifications/notification-type";

export const getNotificationMessage = (notification: BaseNotificationDto): string => {
    switch (notification.type) {
        case NotificationType.POST_COMMENT:
            return `${notification.username} commented on your post`;
        case NotificationType.POST_COMMENT_REACTION:
            return `${notification.username} reacted to your comment`;
        case NotificationType.POST_REACTION:
            return `${notification.username} reacted to your post`;
        default:
            return '';
    }
}
