import React from 'react';
import {StyleSheet} from 'react-native';
import RegularText from '../../components/texts/regular-texts';
import MainContainer from '../../components/containers/MainContainer';
import {colorsVerifyCode} from '../../components/colors';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {Image} from 'native-base';
import RegularButton from "../../components/buttons/regular-button";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {IRootState} from "../../store";

export const NotFoundScreen = () => {
  const navigation: any = useNavigation();

    const isAuthenticated = useSelector(
        (state: IRootState) => state.authentication.isAuthenticated
    );

  const notFoundNavigate = () => {
      if (isAuthenticated) {
          navigation.navigate('Feed');
      } else {
            navigation.navigate('Splash');
      }
  }

  return (
    <MainContainer style={[styles.container]}>
      <Image
        source={require("../../../assets/thinking-soldier.png")}
        alt={"Thinking Soldier"}
        resizeMode="contain"
        height={400}
      />
      <RegularText style={styles.title}>Hmm..</RegularText>
      <RegularText style={styles.subtitle}>That screen doesn't seem to exist</RegularText>
      <RegularButton
          style={{
            backgroundColor: colorsVerifyCode.secondary,
            margin: "2%",
          }}
          onPress={() => notFoundNavigate()}
      >
        Go Home
      </RegularButton>
    </MainContainer>
  )
}

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colorsVerifyCode.white,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorsVerifyCode.white,
    textAlign: 'center',
    marginTop: 20,
  }
});
