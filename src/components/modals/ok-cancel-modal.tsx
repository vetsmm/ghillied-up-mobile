import React from 'react';
import {Modal} from 'react-native';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import BigText from '../texts/big-text';
import RegularText from '../texts/regular-texts';
import RegularButton from '../buttons/regular-button';
import {Spinner} from "native-base";

const {primary, black, tertiary} = colorsVerifyCode;

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
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-between;

`;

const OkCancelModel = ({
                           isLoading = false,
                           modalVisible,
                           setModalVisible,
                           leftButtonHandler,
                           rightButtonHandler,
                           headerText,
                           message,
                           leftButtonText,
                           rightButtonText
                       }: {
    isLoading?: boolean;
    modalVisible: boolean,
    setModalVisible: (modalVisible: boolean) => void,
    leftButtonHandler: () => void,
    rightButtonHandler: () => void,
    headerText: string,
    message: string,
    leftButtonText?: string,
    rightButtonText?: string
}) => {
    return (
        <Modal animationType="slide" visible={modalVisible} transparent={true}>
            <ModalPressableContainer onPress={() => setModalVisible(false)}>
                <ModalView>
                    <BigText style={{fontSize: 25, color: tertiary, marginVertical: 10}}>{headerText}</BigText>
                    <RegularText style={{marginBottom: 20}}>{message}</RegularText>
                    {isLoading ? (
                        <Spinner color={tertiary}/>
                    ): (
                        <ButtonRow>
                            <RegularButton
                                onPress={leftButtonHandler}
                                style={{
                                    width: '50%',
                                    marginRight: 10
                                }}
                            >
                                {leftButtonText || `Ok`}
                            </RegularButton>
                            <RegularButton
                                onPress={rightButtonHandler}
                                style={{
                                    backgroundColor: colorsVerifyCode.fail,
                                    width: '50%',
                                }}
                                textStyle={{
                                    color: colorsVerifyCode.white,
                                }}
                            >
                                {rightButtonText || `Cancel`}
                            </RegularButton>
                        </ButtonRow>
                    )}
                </ModalView>
            </ModalPressableContainer>
        </Modal>
    );
};

export default OkCancelModel;
