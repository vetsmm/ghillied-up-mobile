import {StyleSheet} from "react-native";
import {getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";
import {colorsVerifyCode} from "../../components/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
        backgroundColor: colorsVerifyCode.primary
    },
    myGhilliesContainer: {
        flex: 1,
        // flexGrow: 1,
        paddingVertical: 8,
    },
    pastPostContainer: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: 8,
    },
    ghillieListContainer: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: 8,
    },
});
