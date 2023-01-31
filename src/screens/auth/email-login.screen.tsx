import React from "react";
import MainContainer from "../../components/containers/MainContainer";
import {useAppDispatch} from "../../store";
import AuthService from "../../shared/services/auth.service";
import {login} from "../../shared/reducers/authentication.reducer";
import {FlashMessageRef} from "../../components/flash-message/index";
import {Box, Center} from "native-base";
import {ActivityIndicator} from "react-native";
import {colorsVerifyCode} from "../../components/colors";
import {MfaMethod} from "../../shared/models/users/mfa-method";

const {secondary} = colorsVerifyCode;

export const EmailLoginScreen = ({navigation, route}) => {
    const {jwtToken} = route.params;

    const dispatch = useAppDispatch()

    const moveTo = (screen, payload) => {
        navigation.navigate(screen, {...payload});
    };

    React.useEffect(() => {
        if (jwtToken) {
            emailLogin(jwtToken);
        }
    }, [jwtToken]);

    const emailLogin = (token) => {
        AuthService.emailTokenLogin(token)
            .then((res) => {
                dispatch(login({
                    authTokenOutput: res,
                }))
            })
            .catch((error: any) => {
                parseErrors(MfaMethod.EMAIL, error.response?.data?.message)
                moveTo('Splash', {});
            });
    }

    const parseErrors = (
        type: MfaMethod | "Authenticator",
        responseMessage?: any,
    ) => {
        let errorMessage = `An error occurred while logging in via link`;

        if (responseMessage.contains("404001")) {
            errorMessage = "User not found";
        } else if (responseMessage.contains("409004")) {
            errorMessage = `2FA has already been enabled for this account. Please disable current 2FA method to enable EMAIL 2FA`;
        } else if (responseMessage.contains("400023")) {
            errorMessage = "A phone number must be added to enable SMS verification"
        } else if (responseMessage.contains("401002")) {
            errorMessage = `Invalid ${type} code entered`
        } else if (responseMessage.contains("400005")) {
            errorMessage = '2FA is not enabled'
        } else if (responseMessage.contains("401007")) {
            errorMessage = "This 2FA backup code has already been used"
        } else if (responseMessage.contains("400003")) {
            errorMessage = "2FA failed, No Phone number enabled for this account"
        } else if (responseMessage.contains("401005")) {
            navigation.navigate("NewSignInLocation", {});
        } else if (responseMessage.contains("401001")) {
            errorMessage = "Login failed: Invalid Credentials"
        }

        FlashMessageRef.current?.showMessage({
            message: errorMessage,
            type: 'danger',
            style: {
                justifyContent: 'center',
                alignItems: 'center',
            }
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
}

export default EmailLoginScreen;
