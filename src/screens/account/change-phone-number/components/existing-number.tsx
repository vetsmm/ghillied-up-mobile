import BigText from "../../../../components/texts/big-text";
import {colorsVerifyCode} from "../../../../components/colors";
import {ActivityIndicator} from "react-native";
import RegularButton from "../../../../components/buttons/regular-button";
import SmallText from "../../../../components/texts/small-text";
import React from "react";
import ResendBadgeTimer from "../../../../components/timers/resend-badge-timer";
import {View} from "native-base";

export interface ExistingNumberProps {
    phoneNumber: string;
    onRemove: () => void;
    isRemoving: boolean;
    isConfirmed: boolean;
    onResendVerificationCode: () => void;
    resendStatus: string;
    activeResend: boolean;
    setActiveResend: (activeResend: boolean) => void;
    isResending: boolean;
}

export const ExistingNumber: React.FC<ExistingNumberProps> = ({
                                                                  phoneNumber,
                                                                  onRemove,
                                                                  isRemoving,
                                                                  isConfirmed,
                                                                  onResendVerificationCode,
                                                                  activeResend,
                                                                  resendStatus,
                                                                  setActiveResend,
                                                                  isResending
                                                              }) => (
    <>
        <BigText style={{fontSize: 25, color: colorsVerifyCode.tertiary, marginVertical: 10}}>
            Your current phone number is:
        </BigText>
        <BigText style={{
            fontSize: 25,
            color: colorsVerifyCode.tertiary,
            marginVertical: 10,
        }}>
            {phoneNumber}
        </BigText>
        {!isConfirmed && (
            <View mb="5%">
                <SmallText style={{
                    marginTop: "5%",
                    marginBottom: "5%",
                    color: colorsVerifyCode.failLighter
                }}>
                    Your phone number is not confirmed. Please check your phone for a verification code or click the
                    button below to resend the code.
                </SmallText>
                <ResendBadgeTimer
                    activeResend={activeResend}
                    setActiveResend={setActiveResend}
                    resendStatus={resendStatus}
                    isResending={isResending}
                    resend={onResendVerificationCode}
                    resendLabel="Didn't receive a code?"
                    resendButtonText="Resend Verification Code"
                />
            </View>
        )}

        <RegularButton onPress={onRemove} style={{
            backgroundColor: colorsVerifyCode.fail,
        }}>
            {isRemoving ? (
                <ActivityIndicator size="small" color={colorsVerifyCode.primary}/>
            ) : (
                "Remove Phone Number"
            )}
        </RegularButton>
    </>
);
