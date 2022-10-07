import React from "react";
import {View} from "native-base";
import {colorsVerifyCode} from "../colors";
import {TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export const DeleteAction: React.FC<{ onPress: () => void }> = ({onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{
            backgroundColor: colorsVerifyCode.fail,
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginBottom: 20,
        }}>
            <View
                style={{
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                }}
            >
                <MaterialCommunityIcons
                    name="trash-can"
                    size={24}
                    color={colorsVerifyCode.white}

                />
            </View>
        </TouchableOpacity>
    );
}

export default DeleteAction;
