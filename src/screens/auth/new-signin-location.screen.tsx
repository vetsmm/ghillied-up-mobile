import MainContainer from "../../components/containers/MainContainer";
import {Center} from "native-base";
import React from "react";
import OpenMailApp from "../../components/open-mail-app";

export default function NewSignInLocationScreen() {
    return (
        <MainContainer>
            <Center w="100%" flex={1}>
                <OpenMailApp
                    text="It looks like you're signing in from a new location. To keep your account secure, we'll send you an email to verify your identity."
                />
            </Center>
        </MainContainer>
    );
}
