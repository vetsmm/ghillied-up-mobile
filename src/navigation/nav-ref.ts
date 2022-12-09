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
import {LinkingOptions} from '@react-navigation/native/lib/typescript/src/types';
import AppConfig from '../config/app.config';
import {getFeedScreenRoutes} from './stacks/feed-stack';
import {getGhillieScreenRoutes} from './stacks/ghillie-stack';
import {getPostScreenRoutes} from './stacks/post-stack';
import {getNotificationScreenRoutes} from './stacks/notification-stack';
import {getAccountRoutes} from './stacks/account-stack';


export interface RootTabParamList {
  FeedStack: undefined;
  GhillieStack: undefined;
  Posts: undefined;
  NotificationsStack: undefined;
  AccountStack: undefined;
  NotFound: undefined;
}

export const linkingConfig: LinkingOptions<RootTabParamList> | undefined = {
  prefixes: [AppConfig.appUrl],
  config: {
    screens: {
      "FeedStack": {
        path: "feed",
        screens: {
          ...getFeedScreenRoutes()
        }
      },
      "GhillieStack": {
        path: 'ghillies',
        screens: {
          ...getGhillieScreenRoutes()
        }
      },
      "Posts": {
        path: 'posts',
        screens: {
          ...getPostScreenRoutes()
        }
      },
      "NotificationsStack": {
        path: 'notifications',
        screens: {
          ...getNotificationScreenRoutes()
        }
      },
      "AccountStack": {
        path: 'account',
        screens: {
          ...getAccountRoutes()
        }
      },
      NotFound: '*'
    },
  },
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

