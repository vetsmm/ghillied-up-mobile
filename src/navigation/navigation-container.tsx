import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../store";
import LoginScreen from "../screens/auth/login.screen";
import React from "react";
import {getAccount} from "../shared/reducers/authentication.reducer";
import {AppState} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {isReadyRef, linkingConfig, navigationRef} from "./nav-ref";
import ApplicationTabBar from "../components/tab-bar/application-tab-bar";
import RegisterScreen from "../screens/auth/register.screen";
import SplashScreen from "../screens/auth/splash.screen";
import VerifyEmailScreen from "../screens/auth/verify-email.screen";
import PasswordResetInitScreen from "../screens/auth/password-reset-init.screen";
import PasswordResetFinishScreen from "../screens/auth/password-reset-finish.screen";
import notificationService from "../shared/services/push-notification.service";
import * as Notifications from "expo-notifications";
import settingsService from "../shared/services/settings.service";
import {getUnreadNotifications} from "../shared/reducers/notifications.reducer";
import {usePolling} from "../shared/hooks";
import NotFoundScreen from '../screens/not-found-screen';

// https://reactnavigation.org/docs/tab-based-navigation/
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const _renderAuthNavigation = () => {
  const isAuthenticated = useSelector(
    (state: IRootState) => state.authentication.isAuthenticated
  );
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
    >
      <AuthStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
      <AuthStack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
      <AuthStack.Screen
        name="PasswordResetInit"
        component={PasswordResetInitScreen}
        options={{
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
      <AuthStack.Screen
        name="PasswordResetFinish"
        component={PasswordResetFinishScreen}
        options={{
          headerShown: false,
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isAuthenticated ? "push" : "pop"
          // headerRight: () => <ThemeController />,
        }}
      />
    </AuthStack.Navigator>
  );
};


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
    if (isAuthenticated) {
      addTokenToUser(expoPushToken)
    }
  }, [isAuthenticated, expoPushToken]);
  
  React.useEffect(() => {
    notificationService.registerForPushNotificationsAsync().then(async token => setExpoPushToken(token));
    
    // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   notificationService.processPushNotification(notification);
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
      linking={linkingConfig}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={ApplicationTabBar}/>
        ) : (
          <Stack.Screen
            name="AuthLogin"
            component={_renderAuthNavigation}
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isAuthenticated ? "push" : "pop"
            }}
          />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
      {/*{isAuthenticated ? _renderTabNavigation() : _renderAuthNavigation()}*/}
    </NavigationContainer>
  );
}

export default NavContainer;

