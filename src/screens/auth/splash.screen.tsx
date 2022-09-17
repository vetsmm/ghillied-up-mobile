import React from "react";
import {Box, VStack, Image, Center, Hidden} from "native-base";
import GuestLayout from "../../shared/layouts/guest.layout";
import RegularButton from "../../components/buttons/regular-button";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import MainContainer from "../../components/containers/MainContainer";

export interface ActionButtonsProps {
  navigation: NavigationProp<ParamListBase>
}

const ActionButtons: React.FunctionComponent<ActionButtonsProps> = ({navigation}) => {
  return (
    <VStack space={4} mt={{base: 10, md: 12}}>
      <RegularButton
        onPress={() => navigation.navigate("Login")}
      >
        LOGIN
      </RegularButton>
      <RegularButton
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "white",
          backgroundColor: "transparent",
        }}
        textStyle={{
          color: "white",
          backgroundColor: "transparent",
        }}
        onPress={() => navigation.navigate("Register")}
      >
        SIGN UP
      </RegularButton>
    </VStack>
  );
}

function HeaderLogo() {
  return (
    <Box alignItems="center" justifyContent="center">
      <Hidden from="md">
        <Image
          source={require("../../../assets/logo.png")}
          height="200"
          width="250"
          alt="Alternate Text"
        />
      </Hidden>
      <Hidden from="base" till="md">
        <Image
          source={require("../../../assets/logo.png")}
          height="66"
          width="375"
          alt="Alternate Text"
        />
      </Hidden>
    </Box>
  );
}

export default function SplashScreen({ navigation }: any) {
  return (
    <MainContainer>
      <Center w="100%" flex={1}>
        <Box
          maxW="500"
          w="100%"
          height={{md: "544"}}
          px={{base: 4, md: 8}}
          bg={{md: "primary.900"}}
          justifyContent="center"
        >
          <HeaderLogo/>
          <ActionButtons navigation={navigation}/>
        </Box>
      </Center>
    </MainContainer>
  );
}
