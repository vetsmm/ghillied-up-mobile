import React, {useState} from "react";
import styles from './mfa-code-entry-styles';
import MainContainer from "../../../../components/containers/MainContainer";
import {UserOutput} from "../../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store";
import {AppState} from "react-native";
import * as Clipboard from "expo-clipboard";
import {StringFormat} from "expo-clipboard/src/Clipboard.types";
import {MfaMethod} from "../../../../shared/models/users/mfa-method";
import CodeEntry from "../components/code-entry";
import {BackupCodeCopy} from "../components/backup-code-copy";
import MfaService from "../../../../shared/services/mfa.service";
import {FlashMessageRef} from "../../../../components/flash-message/index";
import MsgBox from "../../../../components/texts/message-box";

interface Route {
    params: {
        mfaMethod: MfaMethod;
    };
}

export const MfaCodeEntryScreen: React.FC<{ route: Route }> = ({route}) => {
    const {mfaMethod} = route?.params;

    const [isVerifying, setIsVerifying] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const [entryComplete, setEntryComplete] = React.useState(false);

    // Code
    const [code, setCode] = React.useState("");
    const MAX_CODE_LENGTH = 6;
    const [pinReady, setPinReady] = useState(true);
    const [hasPastableCode, setHasPastableCode] = useState(false);

    // backup codes
    const [backupCodes, setBackupCodes] = React.useState<string[]>();

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const getSafePhoneNumber = (): string | undefined => {
        return myAccount?.phoneNumber?.slice(-4)
    }

    React.useEffect(() => {
        // Listen for when app is in the foreground
        const _handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'active') {
                checkForPastableCode();
            }
        }

        // Check for pastable code when app is in the foreground
        const checkForPastableCode = async () => {
            const pastableCode = await Clipboard.getStringAsync({
                preferredFormat: StringFormat.PLAIN_TEXT,
            });
            // Check if pastable code is a valid code based on length and is it characters and numbers only
            if (pastableCode.length === MAX_CODE_LENGTH && /^[a-zA-Z0-9]+$/.test(pastableCode)) {
                setHasPastableCode(true);
            } else {
                console.log('no paste-able code');
            }
        }

        // Listen for when app is in the foreground
        const subscription = AppState.addEventListener('change', _handleAppStateChange);

        // Remove listener when component unmounts
        return () => subscription.remove();
    }, []);

    const insertPastableCode = async () => {
        const pastedCode = await Clipboard.getStringAsync();
        if (pastedCode.length === MAX_CODE_LENGTH) {
            setCode(pastedCode);
            setPinReady(true);
        } else {
            setHasPastableCode(false);
        }
    }

    const handleSubmit2FA = () => {
        switch (MfaMethod[mfaMethod]) {
            case MfaMethod.TOTP:
                submitTotp()
                break;
            case MfaMethod.SMS:
                submitSms();
                break;
            case MfaMethod.EMAIL:
                submitEmail();
                break;
        }
    }

    const regenerateCodes = async () => {
        setIsVerifying(true);
        try {
            const codes = await MfaService.regenerateBackupCodes();
            setBackupCodes(codes);
            setIsVerifying(false);
            FlashMessageRef.current?.showMessage({
                message: 'Backup Codes Regenerated',
                type: "success",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        } catch (error: any) {
            setIsVerifying(false);
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

    const submitTotp = async () => {
        setIsVerifying(true);
        try {
            const codes = await MfaService.enableTotp({token: code})
            setBackupCodes(codes);
            setEntryComplete(true);
            setIsVerifying(false);
        } catch (error: any) {
            setIsVerifying(false);
            parseErrors(MfaMethod.TOTP, error.response?.data?.message)
        }
    }

    const submitSms = async () => {
        setIsVerifying(true);
        try {
            const codes = await MfaService.enableSms(code)
            setBackupCodes(codes);
            setEntryComplete(true);
            setIsVerifying(false);
        } catch (error: any) {
            setIsVerifying(false);
            parseErrors(MfaMethod.SMS, error.response?.data?.message)
        }
    }

    const submitEmail = async () => {
        setIsVerifying(true);
        try {
            const codes = await MfaService.enableEmailMfa(code)
            setBackupCodes(codes);
            setEntryComplete(true);
            setIsVerifying(false);
        } catch (error: any) {
            setIsVerifying(false);
            parseErrors(MfaMethod.EMAIL, error.response?.data?.message)
        }
    }

    const parseErrors = (
        type: MfaMethod | "Authenticator",
        responseMessage?: any,
    ) => {
        let errorMessage = `An error occurred while completing ${type} 2FA`;
        if (!responseMessage) {
            setErrorMessage(errorMessage);
            return;
        }

        if (responseMessage.contains("404001")) {
            errorMessage = "User not found";
        } else if (responseMessage.contains("409004")) {
            errorMessage = `2FA has already been enabled for this account. Please disable current 2FA method to enable ${type} 2FA`;
        } else if (responseMessage.contains("400023")) {
            errorMessage = "A phone number must be added to enable SMS verification"
        } else if (responseMessage.contains("401002")) {
            errorMessage = `Invalid ${type} code entered`
        }

        setErrorMessage(errorMessage);
    }

    const getCodeText = () => {
        switch (MfaMethod[mfaMethod]) {
            case MfaMethod.TOTP:
                return "Enter the 6-digit code copied from your authenticator app";
            case MfaMethod.SMS:
                return `Enter the 6-digit code we sent to your number ending in ${getSafePhoneNumber()} to complete setting up your two-factor authentication`
            case MfaMethod.EMAIL:
                return "Enter the 6-digit code copied from your email";
        }
        return "";
    }

    return (
        <MainContainer style={styles.container}>
            {!entryComplete
                ? (
                    <CodeEntry
                        codeText={getCodeText()}
                        hasPastableCode={hasPastableCode}
                        insertPastableCode={insertPastableCode}
                        code={code}
                        setCode={setCode}
                        maxCodeLength={MAX_CODE_LENGTH}
                        isVerifying={isVerifying}
                        pinReady={pinReady}
                        setPinReady={setPinReady}
                        handleSubmit2FA={handleSubmit2FA}
                    />
                )
                : (
                    <BackupCodeCopy
                        isReloading={isVerifying}
                        backupCodes={backupCodes || []}
                        regenerateCodes={regenerateCodes}
                    />
                )}

            {errorMessage && (
                <MsgBox success={false} style={{marginBottom: 2}}>
                    {errorMessage}
                </MsgBox>
            )}
        </MainContainer>
    )
}

export default MfaCodeEntryScreen;
