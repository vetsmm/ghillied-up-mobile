import {StyleSheet} from "react-native";
import {getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";
import {colorsVerifyCode} from "../../../../components/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
        backgroundColor: colorsVerifyCode.primary
    },
    screenTitle: {
        alignSelf: "center",
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: "1%"
    },
    screenDetail: {
        alignSelf: "center",
        color: colorsVerifyCode.lighterGray
    },
});
