import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import GhillieListingScreen from "../../screens/ghillies/listing";
import {ScreenHeight} from "../../components/icons/icon-header";
import styled from "styled-components/native";
import {colorsVerifyCode} from '../../components/colors';
import MainContainer from "../../components/containers/MainContainer";
import {GhillieDetailScreen} from "../../screens/ghillies/detail";
import GhillieCreateScreen1 from "../../screens/ghillies/create/ghillie-create-screen1";
import GhillieCreateScreen3 from "../../screens/ghillies/create/ghillie-create-screen3";
import GhillieSearchScreen from '../../screens/ghillies/search';
import GhillieCreateScreen2 from "../../screens/ghillies/create/ghillie-create-screen2";
import GhillieSettingsScreen from "../../screens/ghillies/settings/main";
import GhillieUpdateScreen from "../../screens/ghillies/settings/update";
import UpdateGhillieCategoryScreen from "../../screens/ghillies/settings/update-category";
import UpdateGhillieTopicsScreen from "../../screens/ghillies/settings/update-topics";

const {primary} = colorsVerifyCode;

interface GhillieScreenProps {
  name: string;
  route: string;
  component: React.ComponentType<any>;
  options?: any;
}

export const ghilliesScreen: Array<GhillieScreenProps> = [
  {
    name: "GhillieListing",
    route: "ghillie-listing",
    component: GhillieListingScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: "GhillieDetail",
    route: "ghillie-detail/:id",
    component: GhillieDetailScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: "GhillieCreate",
    route: "ghillie-create",
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
    route: "ghillie-create-screen2",
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
    route: "ghillie-create-screen3",
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
    route: "ghillie-settings/:id",
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
    route: "ghillie-update/:id",
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
    route: "ghillie-category-update/:id",
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
    route: "ghillie-topics-update/:id",
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
    route: "ghillie-search",
    component: GhillieSearchScreen,
    options: {
      headerShown: false,
    }
  }
];

export const getGhillieScreenRoutes = () => {
  const routes: any = {};
  ghilliesScreen.forEach((screen: any) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const GhillieStack = createNativeStackNavigator();

const TopBg = styled.View`
  background-color: ${primary};
  width: 100%;
  height: ${ScreenHeight * 0.3}px;
  border-radius: 30px;
  position: absolute;
  top: -30px;
`;

export default function GhillieStackScreen() {
  return (
    <MainContainer style={{paddingTop: 0, paddingLeft: 0, paddingRight: 0, backgroundColor: "transparent"}}>
      <TopBg/>
      <GhillieStack.Navigator>
        {ghilliesScreen.map((screen, index) => {
          return (
            <GhillieStack.Screen
              name={screen.name}
              component={screen.component}
              key={index}
              options={screen.options}
            />
          );
        })}
      </GhillieStack.Navigator>
    </MainContainer>
  );
}
