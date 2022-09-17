import { Center } from 'native-base';
import React, {ReactNode} from 'react';
import {SwitchProps, View} from 'react-native';


// styled components
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';
import SmallText from "../texts/small-text";
const { primary, secondary, tertiary } = colorsVerifyCode;

interface ExtraInputProps {
  label: ReactNode;
  isError?: boolean;
}

export type InputProps = SwitchProps & ExtraInputProps;

const Switch = styled.Switch`
  background-color: ${primary};
  border-radius: 10px;
  font-size: 16px;
  height: 60px;
  margin-top: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
  border-color: ${secondary};
`;

const StyledCheckboxInput = ({ label, isError, ...props }: InputProps) => {

  return (
    <View>
      <Center>
        <SmallText>{label}</SmallText>
        <Switch
          {...props}
          // @ts-ignore
          trackColor={{ false: "#6B7280", true: "#36B185" }}
        />
      </Center>
    </View>
  );
};

export default StyledCheckboxInput;
