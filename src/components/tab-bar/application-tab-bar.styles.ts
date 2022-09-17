import { StyleSheet } from "react-native";
import { ApplicationStyles, Colors } from "../../shared/styles";

export default StyleSheet.create<any>({
  ...ApplicationStyles.screen,
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  customButton: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonView: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.error,
  },
  tabBarStyles: {
    backgroundColor: "#133143",
    borderWidth: 0.5,
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "grey",
    position: "absolute",
  },
  tabBarIconContainer: {
    position: "absolute",
    bottom: 3, // space from bottombar
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarPostIcon: {
    width: 40,
    height: 40,
    tintColor: "#f1f6f9",
    alignContent: "center",
  },
});
