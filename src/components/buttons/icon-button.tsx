import React from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import {Text, View} from "native-base";
import {InterfaceIconButtonProps} from "native-base/lib/typescript/components/composites/IconButton/types";


export interface IconButtonProps extends InterfaceIconButtonProps{
  onPress: () => void;
  text: string;
  icon: JSX.Element;
}

export const IconButtonWithText = (props: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <View style={{
        paddingLeft: 8,
        width: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        {props.icon}
        <Text color="white">{`  ${props.text}`}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default IconButtonWithText;
