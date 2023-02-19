import React from "react";
import {TouchableOpacity, TouchableOpacityProps} from "react-native";
import {Text, View} from "native-base";
import {colorsVerifyCode} from "../colors";
import GhillieIcon from "../ghillie-icon";


export const CreatePostButton = (props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: `rgba(0, 133, 131, 0.5)`,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: colorsVerifyCode.secondary
        },
        props.style
      ]}
    >
      <View style={{
        paddingLeft: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <GhillieIcon
          name="pen"
          size={40}
          color="white"
        />
        <Text color="white"> Start a discussion...</Text>
      </View>
    </TouchableOpacity>
  );
}

export default CreatePostButton;
