import React from "react";

import {Pressable, Text, View} from "native-base";
import {FontAwesome} from "@expo/vector-icons";
import {numberToReadableFormat} from "../../shared/utils/number-utils";

export interface CommentButtonProps {
    onPress: () => void;
    numberOfComments?: number;
    disabled?: boolean;
}

export const CommentButton = ({onPress, disabled = false, numberOfComments = 0}: CommentButtonProps) => {

    const _renderCommentDetails = () => {
        if (!disabled) {
            return (
                <>
                    <FontAwesome name="comment-o" color="white" size={30}/>
                    <Text
                        color="white"
                        numberOfLines={1}
                    >
                        {` ${numberOfComments === 0
                            ? "Comment"
                            : `${numberToReadableFormat(numberOfComments)} Comments`}`}
                    </Text>
                </>
            )
        }

        return (
            <>
                <FontAwesome name="comment-o" color="white" size={30}/>
                <Text
                    color="white"
                    numberOfLines={1}
                >
                    {` ${numberOfComments === 0
                        ? "No Comments"
                        : `${numberToReadableFormat(numberOfComments)} Comments`}`}
                </Text>
            </>
        );
    }
    return (
        <Pressable onPress={() => onPress()} disabled={disabled}>
            <View style={{
                paddingLeft: 8,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {_renderCommentDetails()}
            </View>
        </Pressable>
    )
}

export default CommentButton;
