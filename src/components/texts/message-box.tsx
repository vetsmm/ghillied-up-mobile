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
  flex: 1;
  flex-wrap: wrap;
  font-weight: bold;
`;

const MsgBox: FunctionComponent<TextProps> = (props) =>  {
  return <StyledText {...props} acessibilityLabel={`Error message: ${props.accessibilityLabel}`}>{props.children}</StyledText>;
};

export default MsgBox;
