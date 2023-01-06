import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../store";
import React from "react";
import {getAccount} from "../shared/reducers/authentication.reducer";
import {ActivityIndicator, AppState} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {isReadyRef, navigationRef} from "./nav-ref";
import ApplicationTabBar from "../components/tab-bar/application-tab-bar";
import notificationService from "../shared/services/push-notification.service";
import * as Notifications from "expo-notifications";
import settingsService from "../shared/services/settings.service";
import {getUnreadNotifications} from "../shared/reducers/notifications.reducer";
import {usePolling} from "../shared/hooks";
import NotFoundScreen from '../screens/not-found-screen';
import * as Linking from "expo-linking";
import {colorsVerifyCode} from "../components/colors";
import {LinkingOptions} from "@react-navigation/native/lib/typescript/src/types";
import AppConfig from "../config/app.config";
import {getFeedScreenRoutes} from "./stacks/feed-stack";
import {getPostScreenRoutes} from "./stacks/post-stack";
import {getNotificationScreenRoutes} from "./stacks/notification-stack";
import {getAccountRoutes} from "./stacks/account-stack";
import {getGhillieScreenRoutes} from "./stacks/ghillie-stack";
import NoAuthStackNavigator, {getNoAuthScreenRoutes} from "./stacks/no-auth-stack";

export const linkingConfig: LinkingOptions<any> | undefined = {
    enabled: true,
    prefixes: AppConfig.appUrls,
    async getInitialURL() {
        return await Linking.getInitialURL();
    },
    subscribe(listener) {
        // Listen to incoming links from deep linking
        const linkingSubscription = Linking.addEventListener('url', ({url}) => {
            listener(url);
        });
        return () => {
            // Clean up the event listeners
            linkingSubscription.remove();
        }
    },
    config: {
        initialRouteName: 'Home',
        screens: {
            Home: {
                screens: {
                    ...getNoAuthScreenRoutes(),
                    Feed: {
                        path: "feed",
                        screens: {
                            ...getFeedScreenRoutes(),
                        }
                    },
                    Ghillies: {
                        path: 'ghillies',
                        screens: {
                            ...getGhillieScreenRoutes()
                        }
                    },
                    Posts: {
                        path: 'posts',
                        screens: {
                            ...getPostScreenRoutes()
                        }
                    },
                    Notifications: {
                        path: 'notifications',
                        screens: {
                            ...getNotificationScreenRoutes()
                        }
                    },
                    Account: {
                        path: 'account',
                        screens: {
                            ...getAccountRoutes()
                        }
                    },
                }
            },
            NotFound: '*'
        },
    },
}

// https://reactnavigation.org/docs/tab-based-navigation/
const Stack = createNativeStackNavigator();

function NavContainer() {
    const [expoPushToken, setExpoPushToken] = React.useState<any>('');
    const [delay, setDelay] = React.useState<number>(30000);
    const notificationListener = React.useRef<any>();
    const responseListener = React.useRef<any>();

    const isAuthenticated = useSelector(
        (state: IRootState) => state.authentication.isAuthenticated
    );

    const dispatch = useAppDispatch();

    const lastAppState = "active";

    React.useEffect(() => {
        return () => {
            isReadyRef.current = false;
        };
    }, []);

    usePolling(
        () => {
            if (isAuthenticated) {
                // Your custom logic here
                dispatch(getUnreadNotifications());
            }
        },
        delay
    );

    React.useEffect(() => {
        const handleChange = (nextAppState: any) => {
            if (
                lastAppState.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                dispatch(getAccount());
            }
        };
        const subscription = AppState.addEventListener("change", handleChange);
        return () => subscription.remove();
    }, [dispatch]);

    React.useEffect(() => {
        const addTokenToUser = async (token: any) => {
            await settingsService.addPushTokenToAccount(token);
        }
        if (isAuthenticated && expoPushToken) {
            addTokenToUser(expoPushToken)
        }
    }, [isAuthenticated, expoPushToken]);

    React.useEffect(() => {
        notificationService.registerForPushNotificationsAsync().then(async token => setExpoPushToken(token));

        // This listener is fired whenever a notification is received while the app is foregrounded
        // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //   notificationService.processPushNotificationInApp(notification);
        // });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            notificationService.processPushNotification(response.notification)
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <NavigationContainer
            key={isAuthenticated ? "authed" : "no-authed"}
            linking={linkingConfig}
            ref={navigationRef}
            onReady={() => {
                isReadyRef.current = true;
            }}
            fallback={<ActivityIndicator color={colorsVerifyCode.secondary} size="large"/>}
        >
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" options={{headerShown: false}}>
                    {isAuthenticated
                        ? ApplicationTabBar
                        : NoAuthStackNavigator
                    }

                </Stack.Screen>
                <Stack.Screen name="NotFound" component={NotFoundScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default NavContainer;

