import {StyleSheet} from "react-native";
import {getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";
import {colorsVerifyCode} from "../../../components/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        paddingTop: isIphoneX() ? getStatusBarHeight() + 20 : 30,
        backgroundColor: colorsVerifyCode.primary
    },
    list: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: 8,
        marginBottom: 40,
    },
    section: {
        marginBottom: 20,
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colorsVerifyCode.white,
        marginBottom: 8,
        marginLeft: 16
    },
    sectionItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colorsVerifyCode.secondary,
    },
    sectionButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colorsVerifyCode.secondary
    }
});
