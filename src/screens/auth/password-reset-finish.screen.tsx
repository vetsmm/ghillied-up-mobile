import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator, Dimensions} from 'react-native';
import {colorsVerifyCode} from '../../components/colors';

// custom components

import styled from 'styled-components/native';
import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import RegularText from "../../components/texts/regular-texts";
import StyledCodeInput from "../../components/inputs/styled-code-input";
import MainContainer from "../../components/containers/MainContainer";
import ResendTimer from "../../components/timers/resend-timer";
import MsgBox from '../../components/texts/message-box';
import RegularButton from "../../components/buttons/regular-button";
import MessageModal from '../../components/modals/message-modal';
import StyledTextInput from "../../components/inputs/styled-text-input";
import {VStack} from 'native-base';
import AuthService from "../../shared/services/auth.service";
import {validatePasswords} from "../../shared/validators/auth/validators";

const {primary} = colorsVerifyCode;
const FormWrapper = styled.View`
  ${(props) => {
    return props.pinReady ? `opacity: 1` : `opacity: 0.3`;
  }}
`;


const ResetPassword = ({navigation, route}) => {
    const {email, isBadEmail} = route.params;

    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    // code input
    const MAX_CODE_LENGTH = 6;
    const [resetKey, setResetKey] = useState('');
    const [pinReady, setPinReady] = useState(false);

    // resending email
    const [activeResend, setActiveResend] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [resendingEmail, setResendingEmail] = useState(false);

    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const moveTo = (screen, payload) => {
        navigation.navigate(screen, {...payload});
    };

    const buttonHandler = () => {
        if (modalMessageType === 'success') {
            // do something
            moveTo('Login', {});
        }

        setModalVisible(false);
    };

    const showModal = (type, headerText, message, buttonText) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const handleOnSubmit = async (credentials, setSubmitting) => {
        setMessage(null);

        if (isBadEmail) {
            setSubmitting(false);
            return showModal('failed', 'Failed!', "Please ensure you have entered the correct reset key.", 'Close');
        }

        if (validatePasswords(credentials.newPassword, credentials.confirmNewPassword)) {
            setMessage('Passwords do not match.');
            setSubmitting(false);
            return;
        }

        AuthService.resetPasswordFinish({
            email: email,
            resetKey: Number.parseInt(resetKey),
            newPassword: credentials.newPassword,
        })
            .then((res) => {
                setSubmitting(false);
                showModal('success', 'All Good!', 'Your password has been reset.', 'Proceed');
            })
            .catch((err) => {
                setSubmitting(false);
                return showModal('failed', 'Failed!', "Please ensure you have entered the correct reset key.", 'Close');
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const resendEmail = async (triggerTimer) => {
        try {
            setResendingEmail(true);

            AuthService.resetPasswordInit({email})
                .then(() => {
                    setResendStatus('Sent');
                })
                .catch(err => {
                    setResendStatus('Failed');
                });
            // update setResendStatus() to 'Failed!' or 'Sent!'

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

    return (
        <MainContainer>
            <KeyboardAvoidingContainer>
                <VStack style={{
                    flex: 1,
                    // margin top from screen height to be centered
                    marginTop: Dimensions.get('window').height * 0.15,
                }}>
                    <RegularText
                        accessibility={true}
                        accessibilityLabel="Enter the reset key sent to your email address"
                        style={{textAlign: 'center'}}
                    >
                        Enter the 6-digit code sent to your email
                    </RegularText>

                    <StyledCodeInput code={resetKey} setCode={setResetKey} maxLength={MAX_CODE_LENGTH}
                                     setPinReady={setPinReady}/>

                    <ResendTimer
                        activeResend={activeResend}
                        setActiveResend={setActiveResend}
                        resendStatus={resendStatus}
                        resendingEmail={resendingEmail}
                        resendEmail={resendEmail}
                        style={{marginBottom: 25}}
                    />

                    <Formik
                        initialValues={{newPassword: '', confirmNewPassword: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            if (values.newPassword == '' || values.confirmNewPassword == '') {
                                setMessage('Please fill in all fields');
                                setSubmitting(false);
                            } else if (values.newPassword !== values.confirmNewPassword) {
                                setMessage('Passwords do not match');
                                setSubmitting(false);
                            } else {
                                handleOnSubmit(values, setSubmitting);
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <FormWrapper pinReady={pinReady}>
                                <StyledTextInput
                                    label="New Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                    editable={pinReady}
                                    accessible={true}
                                    accessibilityLabel="Enter your new password"
                                />

                                <StyledTextInput
                                    label="Confirm New Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('confirmNewPassword')}
                                    onBlur={handleBlur('confirmNewPassword')}
                                    value={values.confirmNewPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                    editable={pinReady}
                                    accessible={true}
                                    accessibilityLabel="Confirm your new password"
                                />

                                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                                    {message || ' '}
                                </MsgBox>
                                {!isSubmitting && (
                                    <RegularButton disabled={!pinReady} onPress={handleSubmit} accessibilityLabel="Submit">
                                        Submit
                                    </RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={primary}/>
                                    </RegularButton>
                                )}
                            </FormWrapper>
                        )}
                    </Formik>

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

export default ResetPassword;
