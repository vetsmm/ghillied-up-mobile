import ItemToggle from "../../../../components/item-toggle";
import React from "react";
import {UserOutput} from "../../../../shared/models/users/user-output.dto";
import {MfaMethod} from "../../../../shared/models/users/mfa-method";
import {Text} from "native-base";
import {Ionicons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../../components/colors";
import {GestureResponderEvent, StyleSheet, TouchableOpacity} from "react-native";

export interface MfaSelectorsProps {
    user: UserOutput;
    isLoading: boolean;
    onTypeSelect: (value: boolean, type: MfaMethod) => void;
    onNavigateToBackupCodes: ((event: GestureResponderEvent) => void) | undefined;
}

export const MfaSelectors: React.FC<MfaSelectorsProps> = ({user, isLoading, onTypeSelect, onNavigateToBackupCodes}) => (
    <>
        {/*<ItemToggle*/}
        {/*    title="Authentication App (recommended)"*/}
        {/*    value={MfaMethod[user.twoFactorMethod] === MfaMethod.TOTP}*/}
        {/*    onValueChange={(value) => onTypeSelect(value, MfaMethod.TOTP)}*/}
        {/*    isLoading={isLoading}*/}
        {/*    isDisabled={false}*/}
        {/*/>*/}
        <ItemToggle
            title={user.phoneNumber ? "Text Message" : "Text Message (add number to account)"}
            value={MfaMethod[user.twoFactorMethod] === MfaMethod.SMS}
            onValueChange={(value) => onTypeSelect(value, MfaMethod.SMS)}
            isLoading={isLoading}
            isDisabled={!user.phoneNumber || (MfaMethod[user.twoFactorMethod] === MfaMethod.EMAIL || MfaMethod[user.twoFactorMethod] === MfaMethod.TOTP)}
        />
        <ItemToggle
            title={"Email"}
            value={MfaMethod[user.twoFactorMethod] === MfaMethod.EMAIL}
            onValueChange={(value) => onTypeSelect(value, MfaMethod.EMAIL)}
            isLoading={isLoading}
            isDisabled={false}
        />

        {user.twoFactorMethod !== "NONE" && (
            <TouchableOpacity
                style={styles.sectionButton}
                onPress={onNavigateToBackupCodes}
            >
                <Text style={styles.sectionButtonText}>Regenerate Backup Codes</Text>
                {/* Add Right Pointing Chevron */}
                <Ionicons name="chevron-forward" size={24} color={colorsVerifyCode.secondary}/>
            </TouchableOpacity>
        )}
    </>
);

export default MfaSelectors;

const styles = StyleSheet.create({
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
});
