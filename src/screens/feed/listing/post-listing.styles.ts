import { StyleSheet } from "react-native";

import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
  },
  list: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    marginBottom: 40,
  },
});
