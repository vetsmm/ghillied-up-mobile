import {StyleSheet} from "react-native";
import {colorsVerifyCode} from "../../../components/colors";
import {getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";

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
        marginBottom: "2%"
    },
    screenDetail: {
        alignSelf: "center",
        color: colorsVerifyCode.lighterGray
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
        fontSize: 16,
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
    },
    codeCopy: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});
