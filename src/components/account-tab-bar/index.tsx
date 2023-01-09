import React from "react";
import {Column, Row} from "native-base";
import {Text, TouchableOpacity} from "react-native";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import {colorsVerifyCode} from "../colors";


export const AccountTabBar = ({ setSelection, selection}) => {
    return (
        <Row mt={3}>
            <Column width="33%">
                <TouchableOpacity
                    onPress={() => setSelection(0)}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MaterialCommunityIcons
                        name={selection === 0 ? "account-group" : "account-group-outline"}
                        size={35}
                        color={colorsVerifyCode.secondary}
                    />
                    <Text style={{
                        color: colorsVerifyCode.secondary,
                    }}
                    >
                        My Ghillies
                    </Text>
                </TouchableOpacity>
            </Column>
            <Column width="33%">
                <TouchableOpacity
                    onPress={() => setSelection(1)}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <FontAwesome
                        name={selection === 1 ? "question-circle" : "question-circle-o"}
                        size={35}
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
            <Column width="33%">
                <TouchableOpacity
                    onPress={() => setSelection(2)}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <FontAwesome
                        name={selection === 2 ? "bookmark" : "bookmark-o"}
                        size={35}
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
