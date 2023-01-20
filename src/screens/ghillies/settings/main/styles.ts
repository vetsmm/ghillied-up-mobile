import {StyleSheet} from "react-native";
import {colorsVerifyCode} from "../../../../components/colors";

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
        marginBottom: 60,
    },
    section: {
        marginBottom: 20,
    },
    ghillieDetailsContainer: {
        marginBottom: 20,
        backgroundColor: colorsVerifyCode.dialogPrimary,
        margin: "1%"
    },
    ghillieTitle: {
        margin: "2%",
        fontSize: 18,
        fontWeight: 'bold',
        color: colorsVerifyCode.white,
        marginBottom: 8,
    },
    ghillieDescription: {
        marginLeft: "2%",
        fontSize: 14,
        color: colorsVerifyCode.white,
        marginBottom: 8,
    },
    ghillieCreatedDate: {
        fontSize: 12,
        color: colorsVerifyCode.lighterGray,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
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
    reportButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colorsVerifyCode.failLighter
    },
    requestGhillieText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colorsVerifyCode.warning
    },
    leaveGhillieButton: {
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
        borderColor: colorsVerifyCode.failLighter,
    },
    requestGhillieOwnershipButton: {
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
        borderColor: colorsVerifyCode.warning,
    },
    leaveGhillieText: {
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
