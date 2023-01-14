import React, {useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {VStack} from "native-base";
import {ActivityIndicator, Dimensions} from "react-native";
import {Formik} from "formik";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import AuthService from "../../../shared/services/auth.service";
import {colorsVerifyCode} from "../../../components/colors";
import {ValidationSchemas} from "../../../shared/validators";
import {FlashMessageRef} from "../../../components/flash-message/index";

const {primary} = colorsVerifyCode;

export const ChangePassword = () => {
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    const handleOnSubmit = async (credentials, setSubmitting): Promise<boolean> => {
        setMessage(null);

        try {
            await AuthService.changePassword({
                oldPassword: credentials.oldPassword,
                newPassword: credentials.newPassword,
            })
            setSubmitting(false);
            FlashMessageRef.current?.showMessage({
                message: 'Password changed successfully',
                type: "success",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            return true;
        } catch (e) {
            setMessage("Something went wrong. Please try again.");
            setSubmitting(false);
            FlashMessageRef.current?.showMessage({
                message: 'Something went wrong. Please try again.',
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            return false;
        }
    }

    const _validateForm = (formData) => {
        try {
            ValidationSchemas.PasswordChangeFormSchema
                .validateSync(formData, {abortEarly: false});
            return {};
        } catch (e: any) {
            let errors = {};
            e.inner.reduce((acc, curr) => {
                if (curr.message) {
                    errors[curr.path] = curr.message;
                }
            }, {});

            return errors;
        }
    }

    return (
        <MainContainer style={styles.container}>
            <KeyboardAvoidingContainer>
                <VStack style={{
                    flex: 1,
                    // margin top from screen height to be centered
                    marginTop: Dimensions.get('window').height * 0.15,
                }}>
                    <Formik
                        initialValues={{newPassword: '', confirmNewPassword: '', oldPassword: ''}}
                        validate={_validateForm}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={async (values, {setSubmitting, resetForm}) => {
                            const wasSuccess = handleOnSubmit(values, setSubmitting);
                            await wasSuccess && resetForm();
                        }}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isSubmitting,
                              errors
                          }) => (
                            <>
                                <StyledTextInput
                                    label="Old Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('oldPassword')}
                                    onBlur={handleBlur('oldPassword')}
                                    value={values.oldPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                />

                                {errors.oldPassword && (
                                    <MsgBox
                                        success={false}
                                        style={{marginBottom: 5}}>
                                        {errors.oldPassword}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="New Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                />

                                {errors.newPassword && (
                                    <MsgBox
                                        success={false}
                                        style={{marginBottom: 5}}>
                                        {errors.newPassword}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="Confirm New Password"
                                    icon="lock-open-variant"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('confirmNewPassword')}
                                    onBlur={handleBlur('confirmNewPassword')}
                                    value={values.confirmNewPassword}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                />

                                {errors.confirmNewPassword && (
                                    <MsgBox
                                        success={false}
                                        style={{marginBottom: 5}}>
                                        {errors.confirmNewPassword}
                                    </MsgBox>
                                )}

                                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                                    {message || ' '}
                                </MsgBox>

                                {!isSubmitting && (
                                    <RegularButton onPress={handleSubmit}>
                                        Submit
                                    </RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={primary}/>
                                    </RegularButton>
                                )}
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    )
}

export default ChangePassword;
