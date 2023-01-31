import React, {useEffect} from "react";
import styles from "./styles";
import MainContainer from "../../../components/containers/MainContainer";
import RegularText from "../../../components/texts/regular-texts";
import {View} from "native-base";
import MfaSelectors from "./components/mfa-selectors";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import {useNavigation} from "@react-navigation/core";
import MfaService from "../../../shared/services/mfa.service";
import {FlashMessageRef} from "../../../components/flash-message/index";
import MsgBox from "../../../components/texts/message-box";
import {MfaMethod} from "../../../shared/models/users/mfa-method";
import {getAccount} from "../../../shared/reducers/authentication.reducer";
import OkCancelModel from "../../../components/modals/ok-cancel-modal";
import {Feather} from "@expo/vector-icons";
import {colorsVerifyCode} from "../../../components/colors";
import {TouchableOpacity, Image} from "react-native";
import * as Clipboard from 'expo-clipboard';
import RowContainer from "../../../components/containers/row-container";

export const TwoStepVerificationScreen = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [isCopySecretModalOpen, setIsCopySecretModalOpen] = React.useState(false);

    // Authenticator
    const [totpSecret, setTotpSecret] = React.useState<{
        secret: string;
        img: string;
    }>();

    const dispatch = useAppDispatch();

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const navigation: any = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            dispatch(getAccount());
        });
    }, [navigation]);

    const onTypeSelect = (value: boolean, method: MfaMethod) => {
        if (value) {
            switch (MfaMethod[method]) {
                case MfaMethod.SMS:
                    if (myAccount.phoneNumber === null) {
                        FlashMessageRef.current?.showMessage({
                            message: 'Add a phone number to enable SMS 2FA',
                            type: "success",
                            style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        });
                        navigation.navigate("AccountChangePhoneNumber", {});
                    } else {
                        sendSMSVerificationCode();
                    }
                    break;
                case MfaMethod.EMAIL:
                    sendEmailVerificationCode();
                    break;
                case MfaMethod.TOTP:
                    startAuthenticatorVerification();
                    break;
            }
        } else {
            setIsConfirmModalOpen(true);
        }
    }

    const onCopyToClipboard = async () => {
        if (!totpSecret) {
            FlashMessageRef.current?.showMessage({
                message: 'Error getting Authenticator secret, please try again',
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            return;
        }
        await Clipboard.setStringAsync(totpSecret.secret)
        FlashMessageRef.current?.showMessage({
            message: 'Copied secret to clipboard',
            type: "success",
            style: {
                justifyContent: 'center',
                alignItems: 'center',
            }
        });
    }

    const onConfirmRemoveMfa = async () => {
        setIsLoading(true);
        try {
            await MfaService.disableMfa();
            dispatch(getAccount());
            setIsLoading(false);
            setIsConfirmModalOpen(false);
            FlashMessageRef.current?.showMessage({
                message: '2FA Removed from Account',
                type: "success",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        } catch (error: any) {
            parseErrors(MfaMethod.NONE, error.response?.data?.message, "An error occurred while removing 2FA");
            setErrorMessage(errorMessage);
            setIsLoading(false);
        }
    }

    const startAuthenticatorVerification = async () => {
        setIsLoading(true);
        try {
            const response = await MfaService.requestTotpMfa();
            // Show Copy Dialog
            setTotpSecret(response);
            setIsCopySecretModalOpen(true);
            setIsLoading(false);
        } catch (error: any) {
            parseErrors("Authenticator", error.response?.data?.message);
            setErrorMessage(errorMessage);
            setIsLoading(false);
        }
    }

    const onCloseAuthenticatorCodeCopyModal = () => {
        setIsCopySecretModalOpen(false);
        navigation.navigate("MfaCodeEntry", {
            mfaMethod: MfaMethod.TOTP
        });
    }

    const sendEmailVerificationCode = async () => {
        setIsLoading(true);
        try {
            const response = await MfaService.requestEmailMfa();
            setIsLoading(false);
            if (response.success)
                navigation.navigate("MfaCodeEntry", {
                    mfaMethod: MfaMethod.EMAIL
                });
            else
                FlashMessageRef.current?.showMessage({
                    message: 'Error sending Email 2FA verification. Please try again.',
                    type: "danger",
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
        } catch (error: any) {
            parseErrors(MfaMethod.EMAIL, error.response?.data?.message);
            setErrorMessage(errorMessage);
            setIsLoading(false);
        }
    }

    const sendSMSVerificationCode = async () => {
        setIsLoading(true);
        try {
            const response = await MfaService.requestSmsMfa();
            setIsLoading(false);
            if (response.success)
                navigation.navigate("MfaCodeEntry", {
                    mfaMethod: MfaMethod.SMS
                });
            else
                FlashMessageRef.current?.showMessage({
                    message: 'Error sending SMS 2FA verification. Please try again.',
                    type: "danger",
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
        } catch (error: any) {
            parseErrors(MfaMethod.SMS, error.response?.data?.message);
            setErrorMessage(errorMessage);
            setIsLoading(false);
        }
    }

    const parseErrors = (
        type: MfaMethod | "Authenticator",
        responseMessage?: any,
        defaultErrorMessage?: string,
    ) => {
        let errorMessage = defaultErrorMessage ?? `An error occurred while initiating ${type} 2FA`;
        if (!responseMessage) {
            setErrorMessage(errorMessage);
            return;
        }

        if (responseMessage && responseMessage.contains("404001")) {
            errorMessage = "User not found";
        } else if (responseMessage && responseMessage.contains("409004")) {
            errorMessage = `2FA has already been enabled for this account. Please disable current 2FA method to enable ${type} 2FA`;
        } else if (responseMessage && responseMessage.contains("400023")) {
            errorMessage = "A phone number must be added to enable SMS verification"
        }

        setErrorMessage(errorMessage);
    }

    const moveToBackupCodes = () => {
        navigation.navigate("AccountBackupCodes", {});
    }

    return (
        <MainContainer style={styles.container}>
            <View style={{
                margin: "5%"
            }}>
                <RegularText style={styles.screenTitle}>
                    Choose your security method
                </RegularText>
                <RegularText style={styles.screenDetail}>
                    Choose the way you want to receive your codes
                </RegularText>
            </View>

            <View style={styles.section}>
                {errorMessage && (
                    <MsgBox success={false} style={{marginBottom: 2}}>
                        {errorMessage}
                    </MsgBox>
                )}

                <MfaSelectors
                    user={myAccount}
                    isLoading={isLoading}
                    onTypeSelect={onTypeSelect}
                    onNavigateToBackupCodes={() => moveToBackupCodes()}
                />

            </View>

            <OkCancelModel
                isLoading={isLoading}
                modalVisible={isConfirmModalOpen}
                setModalVisible={setIsConfirmModalOpen}
                headerText={"Are you sure you want to remove account two-factor authentication?"}
                message={
                    <RegularText style={{marginBottom: 20}}>
                        Disabling two-factor authentication will significantly weaken the security of your account.
                        Your account may be vulnerable to unauthorized access and data breaches.
                        We strongly recommend keeping two-factor authentication enabled to protect your account
                        and personal information.
                    </RegularText>
                }
                rightButtonHandler={() => onConfirmRemoveMfa()}
                leftButtonHandler={() => setIsConfirmModalOpen(false)}
                leftButtonText={"No"}
                rightButtonText={"Remove 2FA"}
            />

            <OkCancelModel
                isLoading={isLoading && totpSecret !== undefined}
                modalVisible={isCopySecretModalOpen}
                setModalVisible={setIsCopySecretModalOpen}
                headerText={"Authenticator Setup Code"}
                message={
                    <>
                        <RegularText style={{marginBottom: "5%", textAlign: "center"}}>
                            Copy this code an enter into into an authenticator app such as
                            Google Authenticator or Microsoft Authenticator. Once you have configured
                            Ghillied Up in the app, grab the most recent code, and click next.
                        </RegularText>

                        {totpSecret && (
                            <Image
                                style={{
                                    width: "100%",
                                    height: "40%",
                                    resizeMode: "contain"
                                }}
                                source={{
                                    uri: totpSecret.img
                                }}
                                // alt={totpSecret.secret}
                            />
                        )}


                        <TouchableOpacity onPress={() => onCopyToClipboard()}>
                            <RowContainer>
                                <RegularText>
                                    {`Copy to Clipboard    `}
                                </RegularText>
                                <Feather name="copy" size={30} color={colorsVerifyCode.secondary}/>
                            </RowContainer>
                        </TouchableOpacity>

                    </>
                }
                rightButtonHandler={() => onCloseAuthenticatorCodeCopyModal()}
                leftButtonHandler={() => setIsCopySecretModalOpen(false)}
                leftButtonText={"Cancel"}
                rightButtonText={"Next"}
            />
        </MainContainer>
    )
}

export default TwoStepVerificationScreen;
