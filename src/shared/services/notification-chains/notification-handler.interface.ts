import {IFirebaseMessageData} from "../push-notification.service";

export interface INotificationHandler {
    handle(message: IFirebaseMessageData): void;
    setNext(handler: INotificationHandler): void;
}
