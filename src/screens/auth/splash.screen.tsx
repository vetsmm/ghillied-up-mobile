import React, {useEffect, useState} from "react";
import {Box, VStack, Image, Center, Hidden, Spinner} from "native-base";
import RegularButton from "../../components/buttons/regular-button";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import MainContainer from "../../components/containers/MainContainer";
import BigText from "../../components/texts/big-text";
import {clearAuthenticationCredentials, getUserCredentials} from "../../shared/jwt";
import AuthService from "../../shared/services/auth.service";
import {login} from "../../shared/reducers/authentication.reducer";
import {AuthLoginInputDto} from "../../shared/models/auth/auth-login-input.dto";
import {useAppDispatch} from "../../store";

export interface ActionButtonsProps {
    navigation: NavigationProp<ParamListBase>
}

const ActionButtons: React.FunctionComponent<ActionButtonsProps> = ({navigation}) => {
    const dispatch = useAppDispatch();

    const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

    useEffect(() => {
        // Check if the user's login credentials are stored in secure storage
        // If they are, then try to auto log them in. If the request fails, remove the
        // credentials from secure storage and remain on this page with no error message
        attemptLogin();
    }, []);

    const loginUser = (credentials: AuthLoginInputDto) => {
        AuthService.login(credentials)
            .then((res) => {
                dispatch(login({
                    authTokenOutput: res.data,
                    credentials: credentials
                }))
            })
            .catch(async (error) => {
                const err = JSON.parse(JSON.stringify(error));
                if (err.status === 403) {
                    navigation.navigate("VerifyEmail", {
                        username: credentials.username,
                    });
                } else {
                    await clearAuthenticationCredentials();
                    setIsAttemptingLogin(false);
                }
            });
    }

    const attemptLogin = () => {
        setIsAttemptingLogin(true);
        getUserCredentials()
            .then((credentials) => {
                if (!credentials) {
                    setIsAttemptingLogin(false);
                    return;
                }
                loginUser(credentials);
            })
            .catch((err) => {
                setIsAttemptingLogin(false);
            });
    }

    return (
        <VStack space={4} mt={{base: 10, md: 12}}>
            {isAttemptingLogin ? (
                <Center>
                    <Spinner/>
                </Center>
            ) : (
                <>
                    <RegularButton
                        onPress={() => navigation.navigate("Login")}
                    >
                        LOGIN
                    </RegularButton>
                    <RegularButton
                        style={{
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "white",
                            backgroundColor: "transparent",
                        }}
                        textStyle={{
                            color: "white",
                            backgroundColor: "transparent",
                        }}
                        onPress={() => navigation.navigate("Register")}
                    >
                        SIGN UP
                    </RegularButton>
                </>
            )}

        </VStack>
    );
}

function HeaderLogo() {
    return (
        <Box alignItems="center" justifyContent="center">
            <Hidden from="md">
                <Image
                    source={require("../../../assets/logos/logo.png")}
                    height="300"
                    width="350"
                    alt="Alternate Text"
                />
            </Hidden>
            <Hidden from="base" till="md">
                <Image
                    source={require("../../../assets/logos/logo.png")}
                    height="66"
                    width="375"
                    alt="Alternate Text"
                />
            </Hidden>
        </Box>
    );
}

export default function SplashScreen({navigation}: any) {
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
                    <HeaderLogo/>
                    <BigText style={{
                        color: "white",
                        textAlign: "center",
                    }}>
                        Ghillied Up
                    </BigText>
                    <ActionButtons navigation={navigation}/>
                </Box>
            </Center>
        </MainContainer>
    );
}
