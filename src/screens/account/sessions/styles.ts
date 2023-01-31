import {StyleSheet} from "react-native";
import {colorsVerifyCode} from "../../../components/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: colorsVerifyCode.primary
    },
    informationBox: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        margin: "5%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colorsVerifyCode.secondary,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: "5%"
    },
    currentSessionHeaderText: {
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: "5%",
        marginTop: "5%"
    },
    otherActiveSessionsHeaderText: {
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: "5%",
        marginTop: "5%"
    },

    endAllSessionsButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colorsVerifyCode.secondary,
        padding: "10%",
    }
});
