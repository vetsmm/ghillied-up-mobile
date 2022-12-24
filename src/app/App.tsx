/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import 'react-native-gesture-handler'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistor, store} from "../store";
import {NativeBaseProvider} from "native-base";
import {appTheme} from "../shared/styles/app.theme"
import NavContainer from "../navigation/navigation-container";
import * as Notifications from 'expo-notifications';

import * as Sentry from 'sentry-expo';
import AppConfig from "../config/app.config";
import {logout} from "../shared/reducers/authentication.reducer";
import {applyAxiosErrorInterceptor, axiosInstance} from "../shared/services/api";
import {bindActionCreators} from "redux";
import FlashMessage from "../components/flash-message/index";
import {useNetInfo} from "@react-native-community/netinfo";

export const FlashMessageRef = React.createRef<FlashMessage>();

Sentry.init({
    dsn: AppConfig.sentryDsn,
    environment: AppConfig.sentryEnvironment,
    enableInExpoDevelopment: false,
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const _renderApp = () => {
    return (
        <NativeBaseProvider theme={appTheme}>
            <NavContainer/>
        </NativeBaseProvider>
    );
};

const AppContainer = _renderApp;

const actions = bindActionCreators({ logout }, store.dispatch);
applyAxiosErrorInterceptor(axiosInstance, () => {
    FlashMessageRef.current?.showMessage({
        message: 'You have been logged out',
        type: 'danger',
    });
    actions.logout();
});


const App = () => {
    const netInfo = useNetInfo();
    React.useEffect(() => {
        if (!netInfo.isConnected) {
            FlashMessageRef.current?.showMessage({
                message: 'No network connection',
                type: 'danger',
                autoHide: false,
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        } else {
            FlashMessageRef.current?.hideMessage();
        }
    }, [netInfo.isConnected]);

    return (
        <Provider store={store}>
            {/**
             * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
             * and saved to redux.
             * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
             * for example `loading={<SplashScreen />}`.
             * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
             */}
            <PersistGate loading={null} persistor={persistor}>
                <AppContainer/>
                <FlashMessage position="top" ref={FlashMessageRef}/>
            </PersistGate>
        </Provider>
    );
};

export default Sentry.Native.wrap(App);
