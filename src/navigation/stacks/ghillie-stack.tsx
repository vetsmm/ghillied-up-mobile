import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import GhillieListingScreen from "../../screens/ghillies/listing";
import {ScreenHeight} from "../../components/icons/icon-header";
import styled from "styled-components/native";
import {colorsVerifyCode} from '../../components/colors';
import MainContainer from "../../components/containers/MainContainer";
import {GhillieDetailScreen} from "../../screens/ghillies/detail";
import GhillieCreateScreen from "../../screens/ghillies/create";
import GhillieUpdateScreen from "../../screens/ghillies/update";

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
    route: "ghillie-detail",
    component: GhillieDetailScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: "GhillieCreate",
    route: "ghillie-create",
    component: GhillieCreateScreen,
    options: {
      headerShown: false,
    }
  },
  {
    name: "GhillieUpdate",
    route: "ghillie-update",
    component: GhillieUpdateScreen,
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
