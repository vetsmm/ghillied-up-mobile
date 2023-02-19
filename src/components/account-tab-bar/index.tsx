import React from "react";
import {Column, Row} from "native-base";
import {Text, TouchableOpacity} from "react-native";
import {colorsVerifyCode} from "../colors";
import GhillieIcon from "../ghillie-icon";


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
                    <GhillieIcon
                        name="ghillie"
                        size={40}
                        color={selection === 0 ? colorsVerifyCode.secondary : colorsVerifyCode.white}
                    />
                    <Text style={{
                        color: selection === 0 ? colorsVerifyCode.secondary : colorsVerifyCode.white,
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
                    <GhillieIcon
                        name={"posts"}
                        size={40}
                        color={selection === 1 ? colorsVerifyCode.secondary : colorsVerifyCode.white}
                    />
                    <Text style={{
                        color: selection === 1 ? colorsVerifyCode.secondary : colorsVerifyCode.white
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
                    <GhillieIcon
                        name="bookmarked"
                        size={40}
                        color={selection === 2 ? colorsVerifyCode.secondary : colorsVerifyCode.white}
                    />
                    <Text style={{
                        color: selection === 2 ? colorsVerifyCode.secondary : colorsVerifyCode.white
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
