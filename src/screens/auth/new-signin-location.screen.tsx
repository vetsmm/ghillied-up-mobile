import MainContainer from "../../components/containers/MainContainer";
import {Box, Center, Image} from "native-base";
import BigText from "../../components/texts/big-text";
import React from "react";
import RegularText from "../../components/texts/regular-texts";
import {Linking, Platform, TouchableOpacity} from "react-native";

export default function NewSignInLocationScreen() {

    const openMailApp = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('message://');
        } else {
            Linking.openURL('content://com.android.email');
        }
    }
    return (
        <MainContainer>
            <Center w="100%" flex={1}>
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
                        It looks like you're signing in from a new location. To keep your account secure, we'll send you
                        an
                        email to verify your identity.
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
            </Center>
        </MainContainer>
    );
}
