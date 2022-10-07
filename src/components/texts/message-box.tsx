import React, {FunctionComponent} from 'react';

// styled components
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import {TextProps} from "./types";
const { success, failLighter } = colorsVerifyCode;

const StyledText = styled.Text`
  font-size: 13px;
  color: ${(props) => (props.success ? success : failLighter)};
  text-align: center;
  flex: 1;
  flex-wrap: wrap;
  font-weight: bold;
`;

const MsgBox: FunctionComponent<TextProps> = (props) =>  {
  return <StyledText {...props}>{props.children}</StyledText>;
};

export default MsgBox;
