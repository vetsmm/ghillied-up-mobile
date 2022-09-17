import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationListingScreen from "../../screens/notifications/listing";

interface NotificationScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
}

export const notificationsScreen: Array<NotificationScreenProps> = [
  {
    name: "NotificationListing",
    route: "notification-listing",
    component: NotificationListingScreen,
    options: {
      headerShown: false,
    },
  },
];

export const getNotificationScreenRoutes = () => {
  const routes: any = {};
  notificationsScreen.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const NotificationStack = createNativeStackNavigator();

export default function NotificationStackScreen() {
  return (
    <NotificationStack.Navigator>
      {notificationsScreen.map((screen, index) => {
        return (
          <NotificationStack.Screen
            name={screen.name}
            component={screen.component}
            key={index}
            options={screen.options}
          />
        );
      })}
    </NotificationStack.Navigator>
  );
}
