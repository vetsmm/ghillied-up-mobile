import {IFirebaseMessageData} from "../push-notification.service";
import {store} from "../../../store";
import {markNotificationAsRead} from "../../reducers/notifications.reducer";

export abstract class BaseNotificationHandler {

    protected markNotificationAsRead(notificationId?: string): void {
        if (!notificationId) {
            return;
        }
        store.dispatch(markNotificationAsRead(notificationId));
    }

    protected abstract processNotification(notification: IFirebaseMessageData): void;
}
