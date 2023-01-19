import {INotificationHandler} from "./notification-handler.interface";
import {NotificationType} from "../../models/notifications/notification-type";
import {BaseNotificationHandler} from "./base-notification.handler";
import {IFirebaseMessageData} from "../push-notification.service";
import {navigate} from "../../../navigation/nav-ref";

export class PostHandler extends BaseNotificationHandler implements INotificationHandler {
    private next: INotificationHandler | undefined;

    handle(message: IFirebaseMessageData): void {
        if (NotificationType[message.notificationType] === NotificationType.POST) {
            this.processNotification(message);
        } else {
            this.next!.handle(message);
        }
    }

    setNext(handler: INotificationHandler): void {
        this.next = handler;
    }

    protected processNotification(message: IFirebaseMessageData): void {
        this.markNotificationAsRead(message.notificationId);
        navigate('Posts', {
            screen: "PostDetail",
            params: {
                postId: message.routingId
            }
        });
    }
}

export class PostReactionHandler extends BaseNotificationHandler implements INotificationHandler {
    private next: INotificationHandler | undefined;

    handle(message: IFirebaseMessageData): void {
        if (NotificationType[message.notificationType] === NotificationType.POST_REACTION) {
            this.processNotification(message);
        } else {
            this.next!.handle(message);
        }
    }

    setNext(handler: INotificationHandler): void {
        this.next = handler;
    }

    protected processNotification(message: IFirebaseMessageData): void {
        this.markNotificationAsRead(message.notificationId);
        navigate('Posts', {
            screen: "PostDetail",
            params: {
                postId: message.routingId
            }
        });
    }
}

export class PostCommentHandler extends BaseNotificationHandler implements INotificationHandler {
    private next: INotificationHandler | undefined;

    handle(message: IFirebaseMessageData): void {
        if (NotificationType[message.notificationType] !== NotificationType.POST_COMMENT) {
            this.processNotification(message);
        } else {
            this.next!.handle(message);
        }
    }

    setNext(handler: INotificationHandler): void {
        this.next = handler;
    }

    protected processNotification(message: IFirebaseMessageData): void {
        this.markNotificationAsRead(message.notificationId);
        navigate('Posts', {
            screen: "PostDetail",
            params: {
                postId: message.routingId
            }
        });
    }
}

export class CommentReplyHandler extends BaseNotificationHandler implements INotificationHandler {
    private next: INotificationHandler | undefined;

    handle(message: IFirebaseMessageData): void {
        if (NotificationType[message.notificationType] !== NotificationType.COMMENT_REPLY) {
            this.processNotification(message);
        } else {
            this.next!.handle(message);
        }
    }

    setNext(handler: INotificationHandler): void {
        this.next = handler;
    }

    protected processNotification(message: IFirebaseMessageData): void {
        this.markNotificationAsRead(message.notificationId);
        navigate('Posts', {
            screen: "PostDetail",
            params: {
                postId: message.routingId
            }
        });
    }
}

export class CommentReactionHandler extends BaseNotificationHandler implements INotificationHandler {
    private next: INotificationHandler | undefined;

    handle(message: IFirebaseMessageData): void {
        if (NotificationType[message.notificationType] !== NotificationType.POST_COMMENT_REACTION) {
            this.processNotification(message);
        } else {
            this.next!.handle(message);
        }
    }

    setNext(handler: INotificationHandler): void {
        this.next = handler;
    }

    protected processNotification(message: IFirebaseMessageData): void {
        this.markNotificationAsRead(message.notificationId);
        navigate('Posts', {
            screen: "PostDetail",
            params: {
                postId: message.routingId
            }
        });
    }
}
