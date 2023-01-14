import {useNavigation} from "@react-navigation/native";
import React, {useEffect} from "react";
import {ActivityIndicator} from "react-native";
import {colorsVerifyCode} from "../../../components/colors";
import {Center} from "native-base";
import GhillieService from "../../../shared/services/ghillie.service";
import MainContainer from "../../../components/containers/MainContainer";
import BigText from "../../../components/texts/big-text";
import {FlashMessageRef} from "../../../components/flash-message/index";

interface Route {
    params: {
        inviteCode: string;
    };
}

export const GhillieInviteScreen: React.FC<{ route: Route }> = ({route}) => {
    const {inviteCode} = route?.params;

    const navigation: any = useNavigation();

    useEffect(() => {
        onJoinGhillie();
    }, []);

    const onJoinGhillie = () => {
        GhillieService.joinGhillieByCode(inviteCode)
            .then((res) => {
                FlashMessageRef.current?.showMessage({
                    description: "We hope you enjoy the discussion.",
                    message: `Welcome to ${res.name}!`,
                    type: 'success',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    duration: 5000,
                })
                navigation.navigate("GhillieDetail", {ghillieId: res.id});
            })
            .catch((err) => {
                FlashMessageRef.current?.showMessage({
                    message: `Error joining ghillie`,
                    description: err.message,
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    duration: 5000,
                });

                navigation.goBack();
            });
    };


    return (
        <MainContainer>
            <Center flex={1}>
                <ActivityIndicator size="large" color={colorsVerifyCode.accent}/>
                <BigText>Joining ghillie...</BigText>
            </Center>
        </MainContainer>
    )
}

export default GhillieInviteScreen;
