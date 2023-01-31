import React from "react";
import {Box, Text, View} from "native-base";
import {colorsVerifyCode} from "../../../../components/colors";
import RegularText from "../../../../components/texts/regular-texts";
import SmallText from "../../../../components/texts/small-text";
import {ActivityIndicator, TouchableOpacity} from "react-native";

interface BackupCodeCopyProps {
    backupCodes: string[];
    regenerateCodes: () => void;
    isReloading: boolean;
}

export const BackupCodeCopy: React.FC<BackupCodeCopyProps> = ({backupCodes, regenerateCodes, isReloading}) => (
    <Box style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        margin: "5%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colorsVerifyCode.secondary,
    }}>
        <RegularText style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: "5%"
        }}>
            Backup Codes
        </RegularText>
        <RegularText style={{
            color: colorsVerifyCode.lighterGray,
            textAlign: "center",
            marginBottom: "10%"
        }}>
            Save your backup codes in a safe place. Without these codes, you may not
            be able to log into your account, if you lose access to your preferred form of
            two-factor authentication.
        </RegularText>

        {isReloading
            ? (<ActivityIndicator size="large" color={colorsVerifyCode.secondary}/>)
            : (
                <View marginBottom="10%">
                    {backupCodes.map((string, index) => {
                        if (index % 2 === 0) {
                            return (
                                <View key={index} style={{flexDirection: 'row'}}>
                                    <RegularText style={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        marginRight: "10%"
                                    }}>{string}</RegularText>
                                    {backupCodes[index + 1] && <RegularText style={{
                                        fontWeight: "bold",
                                        fontSize: 16
                                    }}>
                                        {backupCodes[index + 1]}
                                    </RegularText>}
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>
            )}

        <SmallText style={{marginBottom: "5%"}}>
            You can use each backup code only one time. You can request new codes if you feel
            that this set is compromised or you have used most of them.
        </SmallText>

        {!isReloading && (
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => regenerateCodes()}
            >
                <SmallText style={{
                    textDecorationLine: 'underline',
                    color: "lightblue"
                }}>
                    Regenerate Codes
                </SmallText>
            </TouchableOpacity>
        )}
    </Box>
)
