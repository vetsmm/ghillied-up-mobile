import {NotificationType} from "./notification-type";
import {ReactionType} from "../reactions/reaction-type";

export interface BaseNotificationDto {
    id: string
    read: boolean
    trash: boolean
    createdDate: Date
    type: NotificationType
    sourceId: string;
    ghillieName?: string;
    ghillieImageUrl?: string | null;
}

export interface PostCommentNotificationDto extends BaseNotificationDto {
    commentContent: string;
    username: string;
    postId: string;
}

export interface PostCommentReactionNotificationDto extends BaseNotificationDto {
    reactionType: ReactionType;
    username: string;
    postId: string;
}

export interface PostReactionNotificationDto extends BaseNotificationDto {
    reactionType: ReactionType;
    username: string;
    postId: string;
}
