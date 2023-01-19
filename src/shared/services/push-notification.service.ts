import * as Device from 'expo-device';
import {ActivityType} from "../models/types";
import {navigate} from "../../navigation/nav-ref";
import * as Sentry from 'sentry-expo';
import messaging, {FirebaseMessagingTypes} from "@react-native-firebase/messaging";
import notifee, {AndroidImportance, Event, EventType} from '@notifee/react-native';
import {NotificationType} from "../models/notifications/notification-type";
import {
    ChainBuilder,
    CommentReactionHandler,
    CommentReplyHandler,
    PostCommentHandler, PostHandler,
    PostReactionHandler
} from "./notification-chains";

export interface IFirebaseMessageData {
    [key: string]: any;

    notificationType: NotificationType;
    notificationId?: string;
    performSilent?: boolean;
}

export interface IFirebaseMessageDataRouting extends IFirebaseMessageData {
    routingId: string;
    activityId: string;
    notificationId: string;
}

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    await notifee.createChannel({
        id: 'gu-alerts',
        name: 'Alerts',
        lights: false,
        vibration: true,
        importance: AndroidImportance.DEFAULT,
    });

    if (Device.isDevice) {
        const authStatus = await messaging().requestPermission({
            announcement: true,
        });
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            return await messaging().getToken();
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }
}

const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const {notification, data} = remoteMessage;

    if (data && data.performSilent) {
        await notifee.incrementBadgeCount(1);
        return;
    }

    let additional = {
        ios: {
            foregroundPresentationOptions: {
                badge: true,
                sound: true,
                banner: true,
                list: true,
            },
        },
    };

    if (data && data["fcm_options"] && data["fcm_options"]["image"]) {
        additional["android"] = {
            channelId: 'gu-alerts',
            largeIcon: data["fcm_options"]["image"],
        }
        additional.ios["attachments"] = [{
            url: data["fcm_options"]["image"],
            typeHint: "public.png",
        }]

    }

    await notifee.displayNotification({
        title: notification?.title,
        body: notification?.body,
        data,
        ...additional,
    });
}

async function handlePushNotification({ type, detail }: Event) {
    if (type !== EventType.PRESS) {
        return;
    }
    if (!detail.notification?.data) {
        return;
    }

    const {data} = detail.notification;
    const pushMessage: IFirebaseMessageData = data as IFirebaseMessageData;
    await processPushNotification(pushMessage);
}

const processPushNotification = async (notification: IFirebaseMessageData) => {
    const chain = new ChainBuilder()
        .add(new PostHandler())
        .add(new PostReactionHandler())
        .add(new PostCommentHandler())
        .add(new CommentReplyHandler())
        .add(new CommentReactionHandler())
        .build();

    chain.handle(notification);

    Sentry.Native.captureMessage(
        `Unhandled activity type: ${ActivityType[notification.notificationType]}`,
        "warning"
    );
}


export default {
    registerForPushNotificationsAsync,
    onMessageHandler,
    handlePushNotification,
}
