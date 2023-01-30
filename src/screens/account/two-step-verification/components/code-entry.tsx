import React, {Dispatch, SetStateAction} from "react";
import {View, VStack} from "native-base";
import RegularText from "../../../../components/texts/regular-texts";
import styles from "../subscreens/mfa-code-entry-styles";
import PressableText from "../../../../components/texts/pressable-text";
import StyledCodeInput from "../../../../components/inputs/styled-code-input";
import RegularButton from "../../../../components/buttons/regular-button";
import {colorsVerifyCode} from "../../../../components/colors";
import {ActivityIndicator, Dimensions} from "react-native";
import KeyboardAvoidingContainer from "../../../../components/containers/KeyboardAvoidingContainer";

interface CodeEntryProps {
    codeText: string;
    hasPastableCode: boolean;
    insertPastableCode: () => void;
    code: string;
    setCode: Dispatch<SetStateAction<string>>;
    maxCodeLength: number;
    isVerifying: boolean;
    pinReady: boolean;
    setPinReady: Dispatch<SetStateAction<boolean>>;
    handleSubmit2FA: () => void;
}

export const CodeEntry: React.FC<CodeEntryProps> = ({
                                                        codeText,
                                                        hasPastableCode,
                                                        insertPastableCode,
                                                        code,
                                                        setCode,
                                                        maxCodeLength,
                                                        isVerifying,
                                                        pinReady,
                                                        setPinReady,
                                                        handleSubmit2FA,
                                                    }) => (
    <KeyboardAvoidingContainer>
        <VStack style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // margin top from screen height to be centered
            marginTop: Dimensions.get('window').height * 0.15,
        }}>
            <View style={{
                margin: "5%"
            }}>
                <RegularText style={styles.screenTitle}>
                    Enter Code
                </RegularText>
                <RegularText style={styles.screenDetail}>
                    {codeText}
                </RegularText>
            </View>

            {hasPastableCode && (
                <View mt='1%'>
                    <PressableText
                        onPress={() => insertPastableCode()}
                        style={{opacity: 0.65}}
                    >
                        Paste Code
                    </PressableText>
                </View>
            )}
            <StyledCodeInput
                code={code}
                setCode={setCode}
                maxLength={maxCodeLength}
                setPinReady={setPinReady}
            />
            {!isVerifying && pinReady && <RegularButton
                onPress={() => handleSubmit2FA()}
                accessibilityLabel={`Verify`}
            >Verify</RegularButton>}

            {!isVerifying && !pinReady && (
                <RegularButton
                    disabled={true}
                    style={{backgroundColor: colorsVerifyCode.secondary}}
                    textStyle={{color: colorsVerifyCode.white}}
                >
                    Verify
                </RegularButton>
            )}

            {isVerifying && (
                <RegularButton disabled={true}>
                    <ActivityIndicator size="small" color={colorsVerifyCode.primary}/>
                </RegularButton>
            )}
        </VStack>
    </KeyboardAvoidingContainer>
);

export default CodeEntry;
