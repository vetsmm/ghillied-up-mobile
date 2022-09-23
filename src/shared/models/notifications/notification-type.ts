export const NotificationType = {
    POST_COMMENT: 'POST_COMMENT',
    POST: 'POST',
    POST_REACTION: 'POST_REACTION',
    POST_COMMENT_REACTION: 'POST_COMMENT_REACTION'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]
