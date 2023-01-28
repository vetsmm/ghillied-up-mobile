import React, {useRef, useState} from "react";
import MainContainer from "../../../components/containers/MainContainer";
import styles from "./styles";
import {VStack} from "native-base";
import {Dimensions} from "react-native";
import KeyboardAvoidingContainer from "../../../components/containers/KeyboardAvoidingContainer";
import {FlashMessageRef} from "../../../components/flash-message/index";
import {UserOutput} from "../../../shared/models/users/user-output.dto";
import {useSelector} from "react-redux";
import {IRootState, useAppDispatch} from "../../../store";
import PhoneInput from "../../../components/phone-input";
import UserService from "../../../shared/services/user.service";
import CodeInputModal from "../../../components/code-input-modal";
import PhoneNumberForm from "./components/phone-number-form";
import {ExistingNumber} from "./components/existing-number";
import {
    addUserPhoneNumber,
    confirmUserPhoneNumber,
    removePhoneFromUser
} from "../../../shared/reducers/authentication.reducer";

export const ChangePhoneNumber = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [isRemoving, setIsRemoving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formattedValue, setFormattedValue] = useState("");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [code, setCode] = React.useState("");
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [error, setError] = React.useState<string>();

    // Resend
    const [activeResend, setActiveResend] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');

    const phoneInput = useRef<PhoneInput>(null);

    const myAccount: UserOutput = useSelector(
        (state: IRootState) => state.authentication.account
    );

    const dispatch = useAppDispatch();

    const resendVerificationCode = async () => {
        setIsVerifying(true);
        try {
            await UserService.resendPhoneNumberVerificationCode();
            setMessage(undefined);
            setIsVerifying(false);
            setModalVisible(true);
        } catch (e: any) {
            let errorMessage = "Something went wrong while resending code."
            if (e.response?.data?.message.contains("401013")) {
                errorMessage = "Invalid phone verification code provided."
            } else if (e.response?.data?.message.contains("401014")) {
                errorMessage = "This phone number has already been confirmed."
            }
            setMessage(errorMessage);
            setIsVerifying(false);
            FlashMessageRef.current?.showMessage({
                message: errorMessage,
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const handleVerifyCode = async () => {
        setIsVerifying(true);
        try {
            await UserService.checkPhoneNumberVerificationCode(code);
            dispatch(confirmUserPhoneNumber());
            setIsVerifying(false);
            setMessage(undefined);
            FlashMessageRef.current?.showMessage({
                message: "Phone number has been successfully updated.",
                type: "success",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });

            setModalVisible(false);
            setCode("");
        } catch (e: any) {
            console.log(e)
            let errorMessage = "Something went wrong while verifying code."
            if (e.response?.data?.message.contains("401013")) {
                errorMessage = "Invalid phone verification code provided."
            } else if (e.response?.data?.message.contains("401014")) {
                errorMessage = "This phone number has already been confirmed."
            }
            setMessage(errorMessage);
            setIsVerifying(false);
            FlashMessageRef.current?.showMessage({
                message: errorMessage,
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const handleOnSubmit = async () => {
        if (!_validateForm()) {
            setIsSubmitting(false);
            return;
        }

        setMessage(undefined);

        try {
            await UserService.updatePhoneNumber(formattedValue!);
            setModalVisible(true);
            setMessage(undefined);
            dispatch(addUserPhoneNumber(formattedValue!));
        } catch (e: any) {
            console.log(e.response.data)
            let errorMessage = "Something went wrong while adding phone number."
            if (e.response?.data?.message.contains("401012")) {
                errorMessage = "This phone number is already in use."
            } else if (e.response?.data?.message.contains("401015")) {
                errorMessage = "This phone number is not valid."
            }
            setMessage(errorMessage);
            setIsSubmitting(false);
            FlashMessageRef.current?.showMessage({
                message: errorMessage,
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const onRemovePhoneNumber = async () => {
        setIsRemoving(true);
        try {
            await UserService.deletePhoneNumber();
            setIsRemoving(false);
            setMessage(undefined);
            dispatch(removePhoneFromUser());
        } catch (e: any) {
            setIsRemoving(false);
            FlashMessageRef.current?.showMessage({
                message: "Something went wrong while removing phone number.",
                type: "danger",
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
        }
    }

    const _validateForm = (): boolean => {
        if (!phoneNumber) {
            setMessage("Phone number is required.");
            return false;
        }

        if (!phoneInput?.current?.isValidNumber(phoneNumber)) {
            setMessage("Phone number is invalid.");
            return false;
        }

        return true;
    }

    return (
        <MainContainer style={styles.container}>
            <KeyboardAvoidingContainer>
                <VStack style={{
                    flex: 1,
                    // margin top from screen height to be centered
                    marginTop: Dimensions.get('window').height * 0.15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: "5%",
                    marginLeft: "5%"
                }}>
                    {myAccount.phoneNumber && (
                        <ExistingNumber
                            phoneNumber={myAccount.phoneNumber}
                            onResendVerificationCode={resendVerificationCode}
                            onRemove={onRemovePhoneNumber}
                            isConfirmed={myAccount.phoneNumberConfirmed}
                            isRemoving={isRemoving}
                            activeResend={activeResend}
                            resendStatus={resendStatus}
                            isResending={isVerifying}
                            setActiveResend={setActiveResend}
                        />
                    )}

                    {!myAccount.phoneNumber && (
                        <PhoneNumberForm
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            isSubmitting={isSubmitting}
                            error={error}
                            setFormattedValue={setFormattedValue}
                            message={message}
                            handleOnSubmit={handleOnSubmit}
                            phoneInput={phoneInput}
                        />
                    )}
                </VStack>

                <CodeInputModal
                    visible={modalVisible}
                    codeValue={code}
                    setCodeValue={setCode}
                    onDismiss={() => {
                        setModalVisible(false);
                    }}
                    onCodeSubmit={() => handleVerifyCode()}
                    error={message}
                    headerText={"Verification Code"}
                    buttonText={"Verify"}
                    isLoading={isVerifying}
                    codeLength={6}
                    autoCapitalize={true}
                />
            </KeyboardAvoidingContainer>
        </MainContainer>
    )
}

export default ChangePhoneNumber;
