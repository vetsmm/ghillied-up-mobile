import React, {useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {VStack} from "native-base";
import {ActivityIndicator, Dimensions} from "react-native";
import {Formik} from "formik";
import StyledTextInput from "../../../components/inputs/styled-text-input";
import MsgBox from "../../../components/texts/message-box";
import RegularButton from "../../../components/buttons/regular-button";
import MessageModal from "../../../components/modals/message-modal";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import {validatePasswords} from "../../../shared/validators/auth/validators";
import AuthService from "../../../shared/services/auth.service";
import {colorsVerifyCode} from "../../../components/colors";

const {primary} = colorsVerifyCode;

export const ChangePassword = () => {
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessageType, setModalMessageType] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    const showModal = (type, headerText, message, buttonText) => {
        setModalMessageType(type);
        setHeaderText(headerText);
        setModalMessage(message);
        setButtonText(buttonText);
        setModalVisible(true);
    };

    const handleOnSubmit = async (credentials, setSubmitting): Promise<boolean> => {
        setMessage(null);

        if (validatePasswords(credentials.newPassword, credentials.confirmNewPassword)) {
            setMessage('Passwords do not match.');
            setSubmitting(false);
            return false;
        }

        try {
            await AuthService.changePassword({
                oldPassword: credentials.oldPassword,
                newPassword: credentials.newPassword,
            })
            showModal('success', 'All Good!', 'Your password has been reset.', 'Ok');
            setSubmitting(false);
            return true;
        } catch (e) {
            setMessage("Something went wrong. Please try again.");
            setSubmitting(false);
            return false;
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
                        onSubmit={async (values, {setSubmitting, resetForm}) => {
                            if (values.oldPassword == '' || values.newPassword == '' || values.confirmNewPassword == '') {
                                setMessage('Please fill in all fields');
                                setSubmitting(false);
                            } else if (values.newPassword !== values.confirmNewPassword) {
                                setMessage('Passwords do not match');
                                setSubmitting(false);
                            } else {
                                const wasSuccess = handleOnSubmit(values, setSubmitting);
                                await wasSuccess && resetForm();
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
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

                    <MessageModal
                        modalVisible={modalVisible}
                        buttonHandler={() => setModalVisible(false)}
                        type={modalMessageType}
                        headerText={headerText}
                        message={modalMessage}
                        buttonText={buttonText}
                    />
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    )
}

export default ChangePassword;
