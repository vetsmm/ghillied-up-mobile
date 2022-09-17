import React from 'react';
import styled from 'styled-components';
import {Image, Text, View} from 'react-native';

import Svg from 'react-native-svg';

export const Container = styled(View)<{
  commentId: string;
  nested: number;
}>`
  flex-direction: column;
  margin-left: ${props =>
  props.nested === 1 || props.nested === 2 ? 12 : 22}px;
  margin-right: 22px;
  border-left: 1px;
  padding-top: 0;
  /*  padding-right: 26px;
  padding-left: ${props =>
  props.nested === 1 ? 64 : props.nested === 2 ? 88 : 0}px;
  */
`;

export const CommentContent = React.memo(styled(Text)`
  color: white;
  font-size: 18px;
  line-height: 18px;
`);

export const Avatar = (props: {source: string}) => {
  return (
    <AvatarMainContainer>
      <AvatarContainer>
        <AvatarPhoto source={props.source} />
      </AvatarContainer>
    </AvatarMainContainer>
  );
};

// was 12
const AvatarMainContainer = styled(View)`
  padding-top: 0;
`;

const AvatarContainer = styled(View)`
  background-color: #266186;
  border-radius: 50px;
  height: 28px;
  margin-right: 8px;
  overflow: hidden;
  width: 28px;
`;

const AvatarPhoto = styled(Image).attrs(props => ({
  resizeMode: 'cover',
  source: {uri: props.source}
}))`
  border-radius: 50px;
  height: 28px;
  margin-right: 8px;
  overflow: hidden;
  width: 28px;
`;

export const CommentImage = styled(Image)`
  border-radius: 3px;
  height: 100px;
  margin-top: 8px;
  overflow: hidden;
  width: 100px;
`;

export const TopRowWrapper = styled(View)<{
  nested: number;
  hasChildren: boolean;
}>`
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 12px;
  margin-left: ${props =>
  props.nested === 0 && !props.hasChildren
    ? 0
    : props.hasChildren && props.nested === 0
      ? 0
      : props.hasChildren && props.nested === 1
        ? 38
        : !props.hasChildren && props.nested === 1
          ? 38
          : !props.hasChildren && props.nested === 2
            ? 66
            : 0}px;
`;

export const BottomRowWrapper = styled(View)`
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const Content = styled(View)<{
  hasChildren: boolean;
  nested: number;
}>`
  background-color: #266186;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: ${props =>
  props.nested === 0 && !props.hasChildren
    ? 0
    : props.hasChildren && props.nested === 0
      ? 28
      : props.hasChildren && props.nested === 1
        ? 66
        : !props.hasChildren && props.nested === 1
          ? 68
          : !props.hasChildren && props.nested === 2
            ? 94
            : 0}px;
  padding-bottom: 12px;
  padding: 16px;
`;

export const HorizontalTierSVG = ({nested}: {nested: number}) => {
  return (
    <Svg
      height={nested !== 1 ? 1 : 2}
      width={nested === 2 ? 12 : 10}
      style={{
        backgroundColor: '#266186',
        position: 'absolute',
        left: nested === 1 ? 24 : 50,
        top: nested !== 1 ? 26 : 24
      }}
    />
  );
};

export const Name = styled(Text)<{name: string}>`
  color: white;
  font-size: ${(props: any) => (props?.name?.length > 15 ? 12 : 14)}px;
  font-weight: bold;
`;

export const DateText = styled(Text)`
  color: white;
  font-size: 12px;
  margin-top: 12px;
`;

export const EditedText = styled(Text)`
  color: white;
  font-size: 12px;
  font-style: italic;
  line-height: 12px;
  margin-right: 10px;
  margin-top: 10px;
`;

export const NameRow = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
