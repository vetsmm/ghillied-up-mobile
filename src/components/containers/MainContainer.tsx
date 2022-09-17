import React, {ReactNode} from 'react';

// styled components
import {colorsVerifyCode} from '../colors';
// @ts-ignore
import styled from "styled-components/native";
import {StyleProp, ViewStyle} from "react-native";

const {primary} = colorsVerifyCode;

const StyledView = styled.SafeAreaView`
  flex: 1;
  background-color: ${primary};
`;


interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const MainContainer = (props: ContainerProps) => {
  return (
    <StyledView {...props}>{props.children}</StyledView>
  )
};

export default MainContainer;
