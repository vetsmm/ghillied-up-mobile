import React from "react";

import {Pressable, Text, View} from "native-base";
import {FontAwesome} from "@expo/vector-icons";
import {numberToReadableFormat} from "../../shared/utils/number-utils";

export interface CommentButtonProps {
  onPress: () => void;
  numberOfComments?: number;
}

export const CommentButton = ({onPress, numberOfComments = 0}: CommentButtonProps) => {
  return (
    <Pressable onPress={() => onPress()}>
      <View style={{
        paddingLeft: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <FontAwesome name="comment-o" color="white" size={30}/>
        <Text
          color="white"
          numberOfLines={1}
        >
          {` ${numberOfComments === 0 ? "Comment" : `${numberToReadableFormat(numberOfComments)} Comments`}`}
        </Text>
      </View>
    </Pressable>
  )
}

export default CommentButton;
