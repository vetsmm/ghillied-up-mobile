import React from "react";
import RegularText from "../texts/regular-texts";
import {Linking, Platform, TouchableOpacity} from "react-native";
import {Box, Image} from "native-base";
import BigText from "../texts/big-text";

export const OpenMailApp = ({text}) => {
    const openMailApp = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('message://');
        } else {
            Linking.openURL('content://com.android.email');
        }
    }

    return (
        <Box
            maxW="500"
            w="100%"
            height={{md: "544"}}
            px={{base: 4, md: 8}}
            bg={{md: "primary.900"}}
            justifyContent="center"
        >
            <RegularText style={{
                color: "white",
                textAlign: "center",
            }}>
                {text}
            </RegularText>

            <TouchableOpacity onPress={openMailApp} style={{
                marginTop: '5%'
            }}>
                <Image
                    source={require("../../../assets/airplane.png")}
                    height="50%"
                    width="100%"
                    alt="Open Mail App"
                    textAlign={"center"}
                    resizeMode="contain"
                />
                <BigText style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: 20,
                    textDecorationLine: "underline"
                }}>
                    Open Mail App
                </BigText>
            </TouchableOpacity>
        </Box>
    );
}

export default OpenMailApp;
