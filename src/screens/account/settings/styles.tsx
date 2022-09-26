import {StyleSheet} from "react-native";
import {colorsVerifyCode} from "../../../components/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
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
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colorsVerifyCode.white,
        marginBottom: 8,
        marginLeft: 16
    },
    sectionButton: {
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
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colorsVerifyCode.fail,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colorsVerifyCode.white
    },
    appVersion: {
        marginBottom: 50,
        alignSelf: "center",
        color: colorsVerifyCode.secondary
    }
});
