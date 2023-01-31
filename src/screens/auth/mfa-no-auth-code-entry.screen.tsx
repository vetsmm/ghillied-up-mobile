import React, {useState} from "react";
import {UserOutput} from "../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../store";
import * as Clipboard from "expo-clipboard";
import {StringFormat} from "expo-clipboard/src/Clipboard.types";
import {AppState, Linking, Platform} from "react-native";
import {MfaMethod} from "../../shared/models/users/mfa-method";
import MainContainer from "../../components/containers/MainContainer";
import styles from "../account/two-step-verification/subscreens/mfa-code-entry-styles";
import CodeEntry from "../account/two-step-verification/components/code-entry";
import MsgBox from "../../components/texts/message-box";
import AuthService from "../../shared/services/auth.service";
import {login} from "../../shared/reducers/authentication.reducer";
import {AuthTokenOutput} from "../../shared/models/auth/auth-token-output.dto";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import {Center} from "native-base";
import OpenMailApp from "../../components/open-mail-app";

interface Route {
    params: {
        mfaMethod: MfaMethod;
        username: string;
        password: string;
        totpToken?: string;
    };
}

export const MfaNoAuthCodeEntryScreen: React.FC<{ route: Route, navigation: NavigationProp<ParamListBase> }> = ({
                                                                                                                    route,
                                                                                                                    navigation
                                                                                                                }) => {
    const {mfaMethod, username, password, totpToken} = route?.params;

    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();

    // Code
    const [code, setCode] = React.useState("");
    const MAX_CODE_LENGTH = 6;
    const [pinReady, setPinReady] = useState(true);
    const [hasPastableCode, setHasPastableCode] = useState(false);

    const dispatch = useAppDispatch();

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
                loginTotp();
                break;
            case MfaMethod.SMS:
                loginSms();
                break;
        }
    }

    const loginTotp = async () => {
        setIsLoading(true);
        try {
            const tokenOutput = await AuthService.totpLogin(totpToken!, code);
            setIsLoading(false);
            dispatch(login({
                authTokenOutput: tokenOutput,
                credentials: {
                    username,
                    password
                }
            }))
        } catch (error: any) {
            setIsLoading(false);
            parseErrors(MfaMethod.TOTP, error.response?.data?.message)
        }
    }

    const loginSms = async () => {
        setIsLoading(true);
        try {
            const tokenOutput = await AuthService.login({
                username,
                password,
                code: code
            });
            dispatch(login({
                authTokenOutput: tokenOutput as AuthTokenOutput,
                credentials: {
                    username,
                    password,
                }
            }))
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            parseErrors(MfaMethod.SMS, error.response?.data?.message)
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
        } else if (responseMessage.contains("400005")) {
            errorMessage = '2FA is not enabled'
        } else if (responseMessage.contains("401007")) {
            errorMessage = "This 2FA backup code has already been used"
        } else if (responseMessage.contains("400003")) {
            errorMessage = "2FA failed, No Phone number enabled for this account"
        } else if (responseMessage.contains("401008")) {
            navigation.navigate("VerifyEmail", {
                username: username,
            });
        } else if (responseMessage.contains("401005")) {
            navigation.navigate("NewSignInLocation", {});
        } else if (responseMessage.contains("401001")) {
            errorMessage = "Login failed: Invalid Credentials"
        }

        setErrorMessage(errorMessage);
    }

    const openMailApp = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('message://');
        } else {
            Linking.openURL('content://com.android.email');
        }
    }

    const getCodeText = () => {
        switch (MfaMethod[mfaMethod]) {
            case MfaMethod.TOTP:
                return "Enter the 6-digit code copied from your authenticator app";
            case MfaMethod.SMS:
                return `Enter the 6-digit code we sent to your number ending in ${getSafePhoneNumber()} to complete setting up your two-factor authentication`
        }
        return "";
    }

    return (
        <MainContainer style={styles.container}>
            {MfaMethod[mfaMethod] === MfaMethod.EMAIL
                ? (
                    <Center w="100%" flex={1}>
                        <OpenMailApp
                            text="A login link was sent to your email."
                        />
                    </Center>
                )
                : (
                    <>
                        <CodeEntry
                            codeText={getCodeText()}
                            hasPastableCode={hasPastableCode}
                            insertPastableCode={insertPastableCode}
                            code={code}
                            setCode={setCode}
                            maxCodeLength={MAX_CODE_LENGTH}
                            isVerifying={isLoading}
                            pinReady={pinReady}
                            setPinReady={setPinReady}
                            handleSubmit2FA={handleSubmit2FA}
                        />

                        {errorMessage && (
                            <MsgBox success={false} style={{marginBottom: 2}}>
                                {errorMessage}
                            </MsgBox>
                        )}
                    </>
                )}

        </MainContainer>
    );
}

export default MfaNoAuthCodeEntryScreen;
