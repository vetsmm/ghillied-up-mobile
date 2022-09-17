import React, {FunctionComponent} from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';
import {TextProps} from "./types";
const { tertiary } = colorsVerifyCode;

const StyledText = styled.Text`
  font-size: 30px;
  color: ${tertiary};
  text-align: left;
`;

const BigText: FunctionComponent<TextProps> = (props) =>  {
  return <StyledText {...props}>{props.children}</StyledText>;
};

export default BigText;
