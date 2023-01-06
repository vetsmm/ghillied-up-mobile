import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator, Dimensions} from 'react-native';
import {colorsVerifyCode} from '../../components/colors';

// custom components

import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import RegularText from "../../components/texts/regular-texts";
import MainContainer from "../../components/containers/MainContainer";
import RegularButton from "../../components/buttons/regular-button";
import StyledTextInput from "../../components/inputs/styled-text-input";
import {VStack} from 'native-base';
import AuthService from "../../shared/services/auth.service";
import {validatePasswords} from "../../shared/validators/auth/validators";
import {FlashMessageRef} from "../../app/App";
import MsgBox from "../../components/texts/message-box";

const {white} = colorsVerifyCode;


const PasswordResetFinishScreen = ({navigation, route}) => {
    const {resetKey} = route.params;

    const [message, setMessage] = useState<string>();

    const moveTo = (screen, payload) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        if (!resetKey) {
            FlashMessageRef.current?.showMessage({
                message: "No reset key found",
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            moveTo('Login', {});
        }
    }, [resetKey]);

    const handleOnSubmit = async (credentials, setSubmitting) => {
        setMessage(undefined);

        if (validatePasswords(credentials.newPassword, credentials.confirmNewPassword)) {
            setMessage('Passwords do not match.');
            setSubmitting(false);
            return;
        }

        AuthService.resetPasswordFinish({
            resetKey: resetKey,
            newPassword: credentials.newPassword,
        })
            .then((res) => {
                setSubmitting(false);
                FlashMessageRef.current?.showMessage({
                    message: "Password reset successful",
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                moveTo('Login', {});
            })
            .catch((err) => {
                setSubmitting(false);
                FlashMessageRef.current?.showMessage({
                    message: "Failed to reset password",
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
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
                        accessibilityLabel="Please enter a new password"
                        style={{textAlign: 'center', marginBottom: "5%"}}
                    >
                        Please enter a new password
                    </RegularText>

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
                            <>
                                <StyledTextInput
                                    label="New Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
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
                                    accessible={true}
                                    accessibilityLabel="Confirm your new password"
                                />

                                <MsgBox style={{marginBottom: 25}} success={!!message}>
                                    {message || ' '}
                                </MsgBox>

                                {!isSubmitting && (
                                    <RegularButton onPress={handleSubmit} accessibilityLabel="Submit">
                                        Submit
                                    </RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={white}/>
                                    </RegularButton>
                                )}
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    );
};

export default PasswordResetFinishScreen;
