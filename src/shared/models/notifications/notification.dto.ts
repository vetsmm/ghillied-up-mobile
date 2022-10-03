import {NotificationType} from "./notification-type";
import {ReactionType} from "../reactions/reaction-type";

export interface BaseNotificationDto {
    id: string
    read: boolean
    trash: boolean
    createdDate: Date
    type: NotificationType
    username: string;
    sourceId: string;
    ghillieName?: string;
    ghillieImageUrl?: string | null;
    notificationId?: string;
}

export interface PostCommentNotificationDto extends BaseNotificationDto {
    commentContent: string;
    postId: string;
}

export interface PostCommentReactionNotificationDto extends BaseNotificationDto {
    reactionType: ReactionType;
    postId: string;
}

export interface PostReactionNotificationDto extends BaseNotificationDto {
    reactionType: ReactionType;
    postId: string;
}
