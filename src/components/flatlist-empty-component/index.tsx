import React from "react";
import {Center, Text} from "native-base";
import {Colors} from "../../shared/styles";

export const FlatListEmptyComponent = ({ text }) => (
  <Center>
    <Text style={{
      color: Colors.secondary
    }}>{text}</Text>
  </Center>
)

export default FlatListEmptyComponent;
