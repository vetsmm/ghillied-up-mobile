import React, {FunctionComponent} from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';
import SmallText from '../texts/small-text';
import {TextProps} from "./types";
const { accent } = colorsVerifyCode;

const StyledPressable = styled.Pressable`
  padding-vertical: 5px;
  align-self: center;
`;

const PressableText: FunctionComponent<TextProps> = (props) =>  {
  return (
    <StyledPressable onPress={props.onPress} {...props}>
      <SmallText style={{ color: accent }}>{props.children}</SmallText>
    </StyledPressable>
  );
};

export default PressableText;
