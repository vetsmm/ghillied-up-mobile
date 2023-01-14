import React, {useState} from 'react';
import {ActivityIndicator, AppState, Dimensions} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import {colorsVerifyCode} from '../../components/colors';

// custom components
import KeyboardAvoidingContainer from '../../components/containers/KeyboardAvoidingContainer';
import RegularText from "../../components/texts/regular-texts";
import MainContainer from '../../components/containers/MainContainer';
import RegularButton from "../../components/buttons/regular-button";
import IconHeader from "../../components/icons/icon-header";
import StyledCodeInput from "../../components/inputs/styled-code-input";
import ResendTimer from '../../components/timers/resend-timer';
import MessageModal from "../../components/modals/message-modal";
import {View, VStack} from "native-base";
import {verifyEmail} from "../../shared/reducers/authentication.reducer";
import AuthService from "../../shared/services/auth.service";
import {useAppDispatch} from "../../store";
import * as Sentry from "sentry-expo";
import PressableText from "../../components/texts/pressable-text";
import {StringFormat} from "expo-clipboard/src/Clipboard.types";
import {useStateWithCallback} from "../../shared/hooks";
import {FlashMessageRef} from "../../components/flash-message/index";

const {primary, secondary, lightGray} = colorsVerifyCode;

const EmailVerification = ({navigation, route}: any) => {
    const {email, username, activationCode} = route.params;

    const dispatch = useAppDispatch()

    // code input
    const MAX_CODE_LENGTH = 6;
    const [code, setCode] = useStateWithCallback('');
    const [pinReady, setPinReady] = useState(false);
    const [hasPastableCode, setHasPastableCode] = useState(false);

    // resending email
    const [activeResend, setActiveResend] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [resendingEmail, setResendingEmail] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const buttonHandler = () => {
        setModalVisible(false);
    };

    const showModal = (type: any, headerText: any, message: any, buttonText: any) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

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
                console.log('no pastable code');
            }
        }

        // Listen for when app is in the foreground
        const subscription = AppState.addEventListener('change', _handleAppStateChange);

        // Remove listener when component unmounts
        return () => subscription.remove();
    }, []);

    React.useEffect(() => {
        // If there is an activation code and it is the correct length and is numbers only process it
        if (activationCode) {
            if (activationCode.length === MAX_CODE_LENGTH && /^[0-9]+$/.test(activationCode)) {
                setCode(activationCode);
                handleEmailVerification(activationCode, true);
            } else {
                FlashMessageRef.current?.showMessage({
                    message: `Invalid code, code must be ${MAX_CODE_LENGTH} digits`,
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                navigation.navigate('Login', {});
            }
        }
    }, [activationCode])

    const resendEmail = async (triggerTimer: any) => {
        try {
            setResendingEmail(true);

            const obj = email ? {email} : {username};

            AuthService.resendActivationEmail(obj)
                .then(() => {
                    setResendStatus('Sent');
                    FlashMessageRef.current?.showMessage({
                        message: 'Email sent!',
                        type: 'success',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                })
                .catch(err => {
                    FlashMessageRef.current?.showMessage({
                        message: 'Error resending email, please try again later.',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    Sentry.Native.captureException(err);
                    setResendStatus('Failed');
                });

            setResendingEmail(false);
            // hold on briefly
            setTimeout(() => {
                setResendStatus('Resend');
                setActiveResend(false);
                triggerTimer();
            }, 5000);
        } catch (error: any) {
            setResendingEmail(false);
            setResendStatus('Failed!');
            alert('Email Resend Failed: ' + error.message);
        }
    };

    const handleEmailVerification = async (actCode, fromLink = false) => {
        setVerifying(true);

        AuthService.activateAccount({
            activationCode: Number.parseInt(actCode),
        })
            .then((res) => {
                dispatch(verifyEmail(res));
                setVerifying(false);
                FlashMessageRef.current?.showMessage({
                    message: 'Your account has been activated!',
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .catch(() => {
                setVerifying(false);
                if (fromLink) {
                    FlashMessageRef.current?.showMessage({
                        message: 'Invalid activation code or activation code has expired!',
                        type: 'danger',
                        style: {
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    });
                    navigation.navigate('Login', {});
                } else {
                    showModal('error', 'Error', "Invalid activation code or activation code has expired. Please click 'resend' to receive a new code.", 'OK');
                }
            })
            .finally(() => {
                setVerifying(false);
            });
    };

    const insertPastableCode = async () => {
        const pastedCode = await Clipboard.getStringAsync();
        if (pastedCode.length === MAX_CODE_LENGTH) {
            setCode(pastedCode);
            setPinReady(true);
        } else {
            setHasPastableCode(false);
        }
    }

    return (
        <MainContainer>
            <KeyboardAvoidingContainer>
                <VStack style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // margin top from screen height to be centered
                    marginTop: Dimensions.get('window').height * 0.15,
                }}>
                    <IconHeader name="lock-open" style={{marginBottom: 30}}/>
                    <RegularText
                        style={{textAlign: 'center'}}
                        accessibility={true}
                        accessibilityLabel="Enter the 6 digit code sent to your email address."
                    >
                        Enter the 6-digit code sent to your email
                    </RegularText>
                    {hasPastableCode && (
                        <View mt='5%'>
                            <PressableText
                                onPress={() => insertPastableCode()}
                                style={{opacity: !activeResend ? 0.65 : 1}}
                            >
                                Paste Code
                            </PressableText>
                        </View>
                    )}
                    <StyledCodeInput
                        code={code}
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                        setPinReady={setPinReady}
                    />
                    {!verifying && pinReady && <RegularButton
                        onPress={() => handleEmailVerification(code)}
                        accessibilityLabel={`Verify`}
                    >Verify</RegularButton>}
                    {!verifying && !pinReady && (
                        <RegularButton disabled={true} style={{backgroundColor: secondary}}
                                       textStyle={{color: lightGray}}>
                            Verify
                        </RegularButton>
                    )}
                    {verifying && (
                        <RegularButton disabled={true}>
                            <ActivityIndicator size="small" color={primary}/>
                        </RegularButton>
                    )}
                    <ResendTimer
                        activeResend={activeResend}
                        setActiveResend={setActiveResend}
                        resendStatus={resendStatus}
                        resendingEmail={resendingEmail}
                        resendEmail={resendEmail}
                    />
                    <MessageModal
                        modalVisible={modalVisible}
                        buttonHandler={buttonHandler}
                        type={modalMessageType}
                        headerText={headerText}
                        message={modalMessage}
                        buttonText={buttonText}
                    />
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    );
};

export default EmailVerification;
