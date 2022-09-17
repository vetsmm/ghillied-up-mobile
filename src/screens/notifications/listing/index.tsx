import { Text, View } from "native-base";
import React from "react";
import { ApplicationStyles } from "../../../shared/styles";

function NotificationListingScreen() {
  return (
    <View
      style={ApplicationStyles.screen.container}
      testID="notificationListingScreen"
    >
      <Text>NotificationListingScreen</Text>
    </View>
  );
}

export default NotificationListingScreen;
