import PhoneInput from "../../../../components/phone-input";
import MsgBox from "../../../../components/texts/message-box";
import SmallText from "../../../../components/texts/small-text";
import RegularButton from "../../../../components/buttons/regular-button";
import {ActivityIndicator} from "react-native";
import React from "react";
import {colorsVerifyCode} from "../../../../components/colors";

export interface PhoneNumberFormProps {
    phoneInput: React.RefObject<PhoneInput>;
    phoneNumber?: string;
    setPhoneNumber: (phoneNumber: string) => void;
    error?: string;
    message?: string;
    setFormattedValue: (formattedValue: string) => void;
    isSubmitting: boolean;
    handleOnSubmit: () => void;
}
const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({phoneInput, phoneNumber, setPhoneNumber, error, message, setFormattedValue, isSubmitting, handleOnSubmit}) => (
    <>
        <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="US"
            layout="first"
            onChangeText={(text) => setPhoneNumber(text)}
            onChangeFormattedText={(text) => {
                setFormattedValue(text);
            }}
            autoFocus
        />

        {error && (
            <MsgBox
                success={false}
                style={{marginBottom: 5}}>
                {error}
            </MsgBox>
        )}

        <SmallText style={{
            marginTop: "10%",
            marginBottom: "10%",
        }}>
            Your phone number will be used to verify your identity when you log in.
            We will never share your phone number with anyone. You can remove your
            phone number at any time.
        </SmallText>

        {message && (
            <MsgBox style={{marginBottom: 25}} success={false}>
                {message}
            </MsgBox>
        )}

        {!isSubmitting && (
            <RegularButton onPress={handleOnSubmit}>
                Update Phone Number
            </RegularButton>
        )}
        {isSubmitting && (
            <RegularButton disabled={true}>
                <ActivityIndicator size="small" color={colorsVerifyCode.primary}/>
            </RegularButton>
        )}
    </>
);

export default PhoneNumberForm;
