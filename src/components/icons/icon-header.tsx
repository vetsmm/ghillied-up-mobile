import React from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';
import {Dimensions} from "react-native";
import GhillieIcon from "../ghillie-icon";
const { secondary, accent } = colorsVerifyCode;

export const ScreenHeight = Dimensions.get('screen').height;

const IconBg = styled.View`
  background-color: ${secondary};
  width: ${ScreenHeight * 0.15}px;
  height: ${ScreenHeight * 0.15}px;
  border-radius: ${ScreenHeight * 0.2}px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const IconHeader = ({ name, color, ...props }: any) => {
  return (
    <IconBg style={{ ...props.style }}>
      <GhillieIcon name={name} size={ScreenHeight * 0.08} color={color ? color : accent} />
    </IconBg>
  );
};

export default IconHeader;
