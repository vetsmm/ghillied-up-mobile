import React, {FunctionComponent} from 'react';

// styled components
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import {TextProps} from "./types";
const { success, fail } = colorsVerifyCode;

const StyledText = styled.Text`
  font-size: 13px;
  color: ${(props) => (props.success ? success : fail)};
  text-align: center;
`;

const MsgBox: FunctionComponent<TextProps> = (props) =>  {
  return <StyledText {...props}>{props.children}</StyledText>;
};

export default MsgBox;
