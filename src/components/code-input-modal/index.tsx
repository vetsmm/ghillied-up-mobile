import React from 'react';
import {Modal} from 'react-native';
import {Entypo} from '@expo/vector-icons';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import BigText from '../texts/big-text';
import RegularText from '../texts/regular-texts';
import RegularButton from '../buttons/regular-button';
import {Icon, Spinner} from "native-base";
import {ButtonRow} from "../modals/ok-cancel-modal";
import StyledCodeInput from "../inputs/styled-code-input";

const {primary, black, fail, tertiary} = colorsVerifyCode;

export const ModalPressableContainer = styled.Pressable`
  flex: 1;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.View`
  background-color: ${primary};
  border-radius: 20px;
  width: 100%;
  padding: 35px;
  align-items: center;
  elevation: 5;
  shadow-color: ${black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  height: 70%;
  width: 100%;
`;

export interface CodeInputModalProps {
    visible: boolean;
    codeValue: string;
    setCodeValue: (codeValue: string) => void;
    onDismiss: () => void;
    onCodeSubmit: () => void;
    error?: string;
    headerText?: string;
    buttonText?: string;
    isLoading?: boolean;
    codeLength?: number;
    autoCapitalize?: boolean;
}

const CodeInputModal = ({
                            visible,
                            codeValue,
                            setCodeValue,
                            onDismiss,
                            onCodeSubmit,
                            error,
                            headerText,
                            buttonText,
                            autoCapitalize = false,
                            isLoading = false,
                            codeLength = 6
                        }: CodeInputModalProps) => {
    const [pinReady, setPinReady] = React.useState(false);

    return (
        <Modal animationType="slide" visible={visible} transparent={true} onDismiss={onDismiss} style={{flex: 1}}>
            <ModalPressableContainer onPress={onCodeSubmit}>
                <ModalView>
                    <BigText
                        style={{fontSize: 25, color: tertiary, marginVertical: 10}}
                        accessibility={true}
                        accessibilityLabel={headerText}
                    >
                        {headerText}
                    </BigText>

                    <Icon
                        mt={"5%"}
                        as={Entypo}
                        name="key"
                        size={30}
                        color={colorsVerifyCode.white}
                    />

                    <StyledCodeInput
                        code={codeValue}
                        setCode={setCodeValue}
                        maxLength={codeLength}
                        setPinReady={setPinReady}
                        keyBoardType="default"
                        onReturnPress={onCodeSubmit}
                        autoCapitalize={autoCapitalize}
                    />

                    {error && (
                        <RegularText
                            style={{color: fail, fontSize: 15, marginTop: 10, textAlign: "center"}}
                            accessibility={true}
                            accessibilityLabel={error}
                        >
                            {error}
                        </RegularText>
                    )}

                    {isLoading ? (
                        <Spinner color={tertiary}/>
                    ) : (
                        <ButtonRow>
                            <RegularButton
                                onPress={() => onDismiss()}
                                style={{
                                    backgroundColor: colorsVerifyCode.fail,

                                    width: '50%',
                                    marginRight: 10
                                }}
                            >
                                {'Cancel'}
                            </RegularButton>
                            <RegularButton
                                onPress={onCodeSubmit}
                                style={{
                                    width: '50%',
                                }}
                                textStyle={{
                                    color: colorsVerifyCode.white,
                                }}
                            >
                                {buttonText || `Ok`}
                            </RegularButton>
                        </ButtonRow>
                    )}
                </ModalView>
            </ModalPressableContainer>
        </Modal>
    );
};

export default CodeInputModal;
