import {NotificationType} from "../models/notifications/notification-type";
import stringUtils from "./string.utils";

const getTitleMessage = (notificationType: NotificationType, username: string): string => {
    switch (notificationType) {
        case NotificationType.POST_COMMENT:
            return `@${username} commented on your post`;
        case NotificationType.POST_COMMENT_REACTION:
            return `@${username} reacted to your comment`;
        case NotificationType.POST_REACTION:
            return `@${username} reacted to your post`;
        default:
            return "";
    }
}

export default {
    getTitleMessage,
}
