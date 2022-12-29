/**
 * Used to navigating without the navigation prop
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * You can add other navigation functions that you need and export them
 */
import {
    CommonActions,
    createNavigationContainerRef
} from '@react-navigation/native'
import React from 'react';

export interface RootTabParamList {
    Feed: undefined;
    GhillieStack: undefined;
    Posts: undefined;
    NotificationsStack: undefined;
    AccountStack: undefined;
    NotFound: undefined;
}


export const isReadyRef: any = React.createRef();


export const navigationRef = createNavigationContainerRef<RootTabParamList>()

export function navigate(name: keyof RootTabParamList, params: any) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.navigate(name, params);
    } else {
        console.log('isReadyRef.current', isReadyRef.current);
        console.log('navigationRef.current', navigationRef.current);
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later

        // Queue the call for later
        navigationRef.current?.dispatch(
            CommonActions.navigate({
                name,
                params,
            })
        );
    }
}

export function navigateAndReset(routes = [], index = 0) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index,
                routes
            })
        )
    }
}

export function navigateAndSimpleReset(name: string, index = 0) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index,
                routes: [{name}]
            })
        )
    }
}

