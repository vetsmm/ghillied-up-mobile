import React from 'react';
import {StyleSheet} from 'react-native';
import RegularText from '../../components/texts/regular-texts';
import MainContainer from '../../components/containers/MainContainer';
import {colorsVerifyCode} from '../../components/colors';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {Image} from 'native-base';

export const NotFoundScreen = () => {
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
