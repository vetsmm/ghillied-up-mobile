import React, {useState} from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';
import {colorsVerifyCode} from '../../components/colors';

// custom components

import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import RegularText from "../../components/texts/regular-texts";
import StyledCodeInput from "../../components/inputs/styled-code-input";
import MainContainer from "../../components/containers/MainContainer";
import RegularButton from "../../components/buttons/regular-button";
import {VStack} from 'native-base';
import AuthService from "../../shared/services/auth.service";
import {FlashMessageRef} from "../../app/App";

const {primary} = colorsVerifyCode;


const PasswordResetCodeScreen = ({navigation, route}) => {
    const {resetKey} = route.params;

    const MAX_CODE_LENGTH = 6;
    const [pinReady, setPinReady] = useState(false);
    const [resetKeyInput, setResetKeyInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moveTo = (screen, payload) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        if (resetKey && resetKey.length === MAX_CODE_LENGTH) {
            setResetKeyInput(resetKey);
            onHandleValidateCode(resetKey);
        }
    }, [resetKey]);

    const validateCode = (code): boolean => {
        if (code.length !== MAX_CODE_LENGTH) {
            FlashMessageRef.current?.showMessage({
                message: `Invalid code, code must be ${MAX_CODE_LENGTH} digits`,
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            return false;
        }

        // Make sure code is a number
        if (isNaN(code)) {
            FlashMessageRef.current?.showMessage({
                message: 'Invalid code, code must be a number',
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            return false;
        }

        return true;
    }
    const onHandleValidateCode = (key) => {
        setIsSubmitting(true);

        if (!validateCode(key)) {
            setIsSubmitting(false);
            moveTo('Splash', {});
        }

        // convert key to number
        const numericKey = parseInt(key);
        AuthService.resetPasswordVerifyKey({
            resetKey: numericKey,
        }).then(() => {
            setIsSubmitting(false);
            moveTo('PasswordResetFinish', {resetKey: numericKey});
        }).catch((err) => {
            setIsSubmitting(false);
            FlashMessageRef.current?.showMessage({
                message: err.data.error.message,
                type: 'danger',
                style: {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            });
            moveTo('Splash', {});
        });
    }

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

                    <StyledCodeInput
                        code={resetKeyInput}
                        setCode={setResetKeyInput}
                        maxLength={MAX_CODE_LENGTH}
                        setPinReady={setPinReady}
                    />

                    {!isSubmitting && (
                        <RegularButton
                            disabled={!pinReady || (resetKeyInput.length < MAX_CODE_LENGTH)}
                            onPress={() => onHandleValidateCode(resetKeyInput)}
                            accessibilityLabel="Submit"
                        >
                            Submit
                        </RegularButton>
                    )}
                    {isSubmitting && (
                        <RegularButton disabled={true}>
                            <ActivityIndicator size="small" color={primary}/>
                        </RegularButton>
                    )}
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    );
};

export default PasswordResetCodeScreen;
