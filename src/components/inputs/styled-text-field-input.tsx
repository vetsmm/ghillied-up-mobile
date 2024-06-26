import React, {ComponentProps, ReactNode, useState} from 'react';
import {StyleProp, TextInputProps, View, ViewStyle} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

// styled components
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';
import SmallText from "../texts/small-text";
const { primary, secondary, tertiary, lightGray, fail } = colorsVerifyCode;

interface ExtraInputProps {
  label: ReactNode;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  isPassword?: boolean;
  isError?: boolean;
  numberOfLines?: number;
  containerStyle?: StyleProp<ViewStyle>
}

export type InputProps = TextInputProps & ExtraInputProps;

const InputField = styled.TextInput`
  background-color: ${primary};
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  height: 120px;
  margin-top: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
  border-color: ${secondary};
  border-width: 2px;

`;

const StyledTextFieldInput = ({ icon, label, isError, numberOfLines, containerStyle, ...props }: InputProps) => {

  const [inputBackgroundColor, setInputBackgroundColor] = useState(primary);

  const customOnBlur = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props?.onBlur;
    setInputBackgroundColor(primary);
  };

  const customOnFocus = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props?.onFocus;
    setInputBackgroundColor(secondary);
  };

  return (
    <View style={containerStyle}>
      <SmallText>{label}</SmallText>
      <InputField
        {...props}
        numberOfLines={numberOfLines || 10}
        multiline={true}
        placeholderTextColor={lightGray}
        // @ts-ignore
        style={{ backgroundColor: inputBackgroundColor, borderColor: isError ? fail : secondary, ...props?.style }}
        onBlur={customOnBlur}
        onFocus={customOnFocus}
      />
    </View>
  );
};

export default StyledTextFieldInput;
