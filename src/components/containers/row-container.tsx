import React from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';

const StyledView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const RowContainer = (props: any) => {
  return <StyledView {...props}>{props.children}</StyledView>;
};

export default RowContainer;
