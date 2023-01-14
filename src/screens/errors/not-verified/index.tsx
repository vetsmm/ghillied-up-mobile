import React, {useCallback} from 'react';

// custom components

import {colorsVerifyCode} from "../../../components/colors";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store";
import {Center, ScrollView, View, Text} from "native-base";
import styles from "./styles";
import {SharedElement} from "react-navigation-shared-element";
import {Image} from "react-native";
import {useNavigation} from "@react-navigation/native";
import RegularButton from "../../../components/buttons/regular-button";


const {primary} = colorsVerifyCode;


export const NotVerifiedScreen = () => {

  const navigation: any = useNavigation();

  const goBack = useCallback(() => {
    navigation.navigate("Account", { screen: "AccountHome" });
  }, [navigation]);

  const isAdmin = useSelector(
    (state: IRootState) => state.authentication.isAdmin,
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: primary,
    }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.container, {backgroundColor: primary}]}
        contentContainerStyle={styles.contentContainer}>
        <SharedElement id={`upset-soldier`}>
          <Image
            style={styles.image}
            source={require('../../../../assets/upset-soldier.png')}
            resizeMode={'cover'}
          />
        </SharedElement>
        <View marginBottom={50}>
          <Center>
            <Text style={styles.title}>
              You need to verify your military status before you can post.
            </Text>

            {/* TODO: Actually navigate to military verify screen */}
            <RegularButton onPress={goBack}>
              Take Me To Safety
            </RegularButton>
          </Center>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotVerifiedScreen;
