import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Platform} from "react-native";
import {Notification} from "expo-notifications/src/Notifications.types";
import {ActivityType, ExpoPushMessageData} from "../models/types";
import {navigate} from "../../navigation/nav-ref";
import AppConfig from "../../config/app.config";
import * as Sentry from 'sentry-expo';


async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            experienceId: AppConfig.experienceId
        })).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

// TODO: de-thunk this, possibly by using a chain of responsibility pattern
function processPushNotification(notification: Notification) {
    const data: ExpoPushMessageData = notification?.request?.content?.data as ExpoPushMessageData;
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
