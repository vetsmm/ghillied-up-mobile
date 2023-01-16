import * as Device from 'expo-device';
import {ActivityType, PushMessageData} from "../models/types";
import {navigate} from "../../navigation/nav-ref";
import * as Sentry from 'sentry-expo';
import messaging from "@react-native-firebase/messaging";


async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;
    if (Device.isDevice) {
        const authStatus = await messaging().requestPermission({
            announcement: true,
        });
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if(enabled) {
            return await messaging().getToken();
        }
    } else {
        console.warn('Must use physical device for Push Notifications');
    }
}

// TODO: de-thunk this, possibly by using a chain of responsibility pattern
function processPushNotification(notification: Notification) {
    const data: PushMessageData = notification?.request?.content?.data as PushMessageData;
    switch (ActivityType[data.activityType]) {
        case ActivityType.POST_COMMENT_REPLY:
        case ActivityType.POST_COMMENT:
        case ActivityType.POST:
        case ActivityType.POST_COMMENT_REACTION:
        case ActivityType.POST_REACTION:
            navigate('Posts', {
                screen: "PostDetail",
                params: {
                    postId: data.routingId
                }
            });
            break;
        default:
            Sentry.Native.captureMessage(
                `Unhandled activity type: ${ActivityType[data.activityType]}`,
                "warning"
            );
            break;
    }
}


export default {
    registerForPushNotificationsAsync,
    processPushNotification,
}
