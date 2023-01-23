import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {colorsVerifyCode} from '../../components/colors';

// custom components
import MainContainer from "../../components/containers/MainContainer";
import {Box, Center} from 'native-base';
import AuthService from "../../shared/services/auth.service";
import {FlashMessageRef} from "../../components/flash-message/index";
import {login} from "../../shared/reducers/authentication.reducer";
import {useAppDispatch} from "../../store";

const {secondary} = colorsVerifyCode;


const SubnetVerificationScreen = ({navigation, route}) => {
    const {jwtToken} = route.params;

    const dispatch = useAppDispatch()

    const moveTo = (screen, payload) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        if (jwtToken) {
            validateSubnet(jwtToken);
        }
    }, [jwtToken]);

    const validateSubnet = (token) => {
        AuthService.approveSubnet(token)
            .then((res) => {
                dispatch(login({
                    authTokenOutput: res,
                }))
            })
            .catch((err) => {
                FlashMessageRef.current?.showMessage({
                    message: "Error occurred while validating new subnet. Please try again later.",
                    type: 'danger',
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                });
                moveTo('Splash', {});
            });
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
                    <ActivityIndicator size="large" color={secondary} animating={true}/>
                </Box>
            </Center>
        </MainContainer>
    );
};

export default SubnetVerificationScreen;
