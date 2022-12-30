import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import GhillieListingScreen from "../../screens/ghillies/listing";
import {colorsVerifyCode} from '../../components/colors';
import {GhillieDetailScreen} from "../../screens/ghillies/detail";
import GhillieCreateScreen1 from "../../screens/ghillies/create/ghillie-create-screen1";
import GhillieCreateScreen3 from "../../screens/ghillies/create/ghillie-create-screen3";
import GhillieSearchScreen from '../../screens/ghillies/search';
import GhillieCreateScreen2 from "../../screens/ghillies/create/ghillie-create-screen2";
import GhillieSettingsScreen from "../../screens/ghillies/settings/main";
import GhillieUpdateScreen from "../../screens/ghillies/settings/update";
import UpdateGhillieCategoryScreen from "../../screens/ghillies/settings/update-category";
import UpdateGhillieTopicsScreen from "../../screens/ghillies/settings/update-topics";


interface GhillieScreenProps {
  name: string;
  path: string;
  parse?: any;
  stringify?: any;
  component: any;
  options?: any;
}

export const ghilliesScreen: Array<GhillieScreenProps> = [
  {
    name: "GhillieListing",
    path: "",
    component: GhillieListingScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: "GhillieCreate",
    path: "create",
    component: GhillieCreateScreen1,
    options: {
      title: "Choose Category",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "GhillieCreateScreen2",
    path: "create-screen2",
    component: GhillieCreateScreen2,
    options: {
      title: "Ghillie Topics",
      headerBackTitle: "Category",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "GhillieCreateScreen3",
    path: "create-screen3",
    component: GhillieCreateScreen3,
    options: {
      title: "Set Up Your Ghillie",
      headerBackTitle: "Topics",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "GhillieSettings",
    path: "settings/:id",
    component: GhillieSettingsScreen,
    options: {
      title: "Ghillie Settings",
      headerBackTitle: "Ghillie",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "GhillieUpdate",
    path: "update/:id",
    component: GhillieUpdateScreen,
    options: {
      title: "Update Ghillie",
      headerBackTitle: "Settings",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "UpdateGhillieCategory",
    path: "update/category/:id",
    component: UpdateGhillieCategoryScreen,
    options: {
      title: "Update Category",
      headerBackTitle: "Settings",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "UpdateGhillieTopics",
    path: "update/topics/:id",
    component: UpdateGhillieTopicsScreen,
    options: {
      title: "Update Topics",
      headerBackTitle: "Settings",
      headerShown: true,
      gestureEnabled: true,
      // title bar color
      headerStyle: {
        backgroundColor: colorsVerifyCode.primary,
      },
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
      },
      headerTintColor: colorsVerifyCode.white,
    }
  },
  {
    name: "GhillieSearch",
    path: "search",
    component: GhillieSearchScreen,
    options: {
      headerShown: false,
    }
  },
  {
    name: "GhillieDetail",
    path: "detail/:ghillieId",
    component: GhillieDetailScreen,
    options: {
      headerShown: false,
    },
  },
];

export const getGhillieScreenRoutes = () => {
  const routes: any = {};
  ghilliesScreen.forEach((screen: any) => {
    routes[screen.name] = screen.path;
  });
  return routes;
};

const GhillieStack = createNativeStackNavigator();

export default function GhillieStackScreen() {
  return (
      <GhillieStack.Navigator>
        {ghilliesScreen.map((screen) => {
          return (
              <GhillieStack.Screen
                  name={screen.name}
                  component={screen.component}
                  key={screen.name}
                  options={screen.options}
              />
          );
        })}
      </GhillieStack.Navigator>
  );
}
