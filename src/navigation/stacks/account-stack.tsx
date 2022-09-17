import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../../screens/account/account.screen";

interface AccountScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
}

export const accountScreens: Array<AccountScreenProps> = [
  {
    name: "AccountHome",
    route: "account-home",
    component: AccountScreen,
    options: {
      title: "",
      headerShown: false,
    },
  },
];

export const getAccountRoutes = () => {
  const routes: any = {};
  accountScreens.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const AccountStack = createNativeStackNavigator();

export default function AccountStackScreen() {
  return (
    <AccountStack.Navigator>
      {accountScreens.map((screen, index) => {
        return (
          <AccountStack.Screen
            name={screen.name}
            component={screen.component}
            key={index}
            options={screen.options}
          />
        );
      })}
    </AccountStack.Navigator>
  );
}
