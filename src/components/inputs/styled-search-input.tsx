import React, {useState} from 'react';
import {TextInputProps} from 'react-native';

// styled components
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';

const {primary, secondary, tertiary, lighterGray} = colorsVerifyCode;

interface ExtraInputProps {
  placeholder?: string;
  disabled?: boolean;
}

export type InputProps = TextInputProps & ExtraInputProps;

const InputField = styled.TextInput`
  background-color: ${primary};
  padding-left: 65px;
  padding-right: 55px;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
  border-color: ${secondary};
  border-width: 2px;
`;


const StyledSearchInput = ({placeholder, disabled = false, ...props}: InputProps) => {
  
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
    <InputField
      {...props}
      placeholderTextColor={lighterGray}
      // @ts-ignore
      style={{backgroundColor: inputBackgroundColor, borderColor: secondary, ...props?.style}}
      onBlur={customOnBlur}
      onFocus={customOnFocus}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export default StyledSearchInput;
