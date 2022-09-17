import React from "react";
// import { StackScreenProps } from "@react-navigation/stack";
import { Text, View } from "native-base";
import { ApplicationStyles } from "../../shared/styles";

// type AccountScreenProps = Record<string, never>;

// type Props = StackScreenProps<AccountScreenProps>;

function AccountScreen() {
  return (
    <View style={ApplicationStyles.screen.container}>
      <Text>Account Screen</Text>
    </View>
  );
}

export default AccountScreen;
