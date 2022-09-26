import React from "react";
import {Column, Row} from "native-base";
import {Text, TouchableOpacity} from "react-native";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../colors";


export const AccountTabBar = ({ setSelection, selection}) => {
    return (
        <Row mt={3}>
            <Column width="33%" alignItems="center">
                <TouchableOpacity onPress={() => setSelection(0)}>
                    <MaterialCommunityIcons
                        name={selection === 0 ? "account-group" : "account-group-outline"}
                        size={40}
                        color={colorsVerifyCode.secondary}
                    />
                    <Text style={{
                        color: colorsVerifyCode.secondary
                    }}
                    >
                        Ghillies
                    </Text>
                </TouchableOpacity>
            </Column>
            <Column width="33%" alignItems="center">
                <TouchableOpacity onPress={() => setSelection(1)}>
                    <FontAwesome
                        name={selection === 1 ? "question-circle" : "question-circle-o"}
                        size={40}
                        color={colorsVerifyCode.secondary}
                    />
                    <Text style={{
                        color: colorsVerifyCode.secondary
                    }}
                    >
                        Posts
                    </Text>
                </TouchableOpacity>
            </Column>
            <Column width="33%" alignItems="center">
                <TouchableOpacity onPress={() => setSelection(2)}>
                    <FontAwesome
                        name={selection === 2 ? "bookmark" : "bookmark-o"}
                        size={40}
                        color={colorsVerifyCode.secondary}
                    />
                    <Text style={{
                        color: colorsVerifyCode.secondary
                    }}
                    >
                        Saved
                    </Text>
                </TouchableOpacity>
            </Column>
        </Row>
    )
}

export default AccountTabBar;
