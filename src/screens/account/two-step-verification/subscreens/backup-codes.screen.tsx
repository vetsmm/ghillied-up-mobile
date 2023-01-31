import React from "react";
import styles from "./mfa-code-entry-styles";
import MainContainer from "../../../../components/containers/MainContainer";
import {BackupCodeCopy} from "../components/backup-code-copy";
import MfaService from "../../../../shared/services/mfa.service";
import {FlashMessageRef} from "../../../../components/flash-message/index";
import RegularText from "../../../../components/texts/regular-texts";
import RegularButton from "../../../../components/buttons/regular-button";
import {View} from "native-base";
import {colorsVerifyCode} from "../../../../components/colors";
import {ActivityIndicator} from "react-native";

const BackupCodesScreen = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [backupCodes, setBackupCodes] = React.useState<string[]>();

    const regenerateCodes = async () => {
        setIsLoading(true);
        try {
            const codes = await MfaService.regenerateBackupCodes();
            setBackupCodes(codes);
            setIsLoading(false);
            FlashMessageRef.current?.showMessage({
                message: 'Backup Codes Regenerated',
                type: "success",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        } catch (error: any) {
            setIsLoading(false);
            FlashMessageRef.current?.showMessage({
                message: 'An error occurred while generating backup codes, please try again',
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    return (
        <MainContainer style={styles.container}>
            {backupCodes
                ? (
                    <BackupCodeCopy
                        isReloading={isLoading}
                        backupCodes={backupCodes || []}
                        regenerateCodes={regenerateCodes}
                    />
                )
                : (
                    <View style={{
                        margin: "5%"
                    }}>
                        <RegularText style={{
                            alignSelf: "center",
                            fontWeight: 'bold',
                            fontSize: 24,
                            marginBottom: "5%"
                        }}>
                            Backup Codes
                        </RegularText>
                        <RegularText style={{
                            alignSelf: "center",
                            color: colorsVerifyCode.lighterGray,
                            marginBottom: "5%",
                            textAlign: "center"
                        }}>
                            You can not view your codes after they have been generated. If you have lost
                            access to these codes or feel they may be compromised, please feel to regenerate
                            a new set.
                        </RegularText>
                        <RegularButton
                            style={{
                                backgroundColor: colorsVerifyCode.fail
                            }}
                            disabled={isLoading}
                            onPress={() => regenerateCodes()}
                        >
                            {isLoading
                                ? (
                                    <ActivityIndicator size="small"/>
                                )
                                    : "Regenerate Codes"}
                        </RegularButton>
                    </View>
                )
            }
        </MainContainer>
    )

}

export default BackupCodesScreen;
