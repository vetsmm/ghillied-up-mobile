import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {colorsVerifyCode} from '../../components/colors';
import MainContainer from "../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import StyledTextInput from "../../components/inputs/styled-text-input";
import MsgBox from "../../components/texts/message-box";
import RegularButton from "../../components/buttons/regular-button";
import RowContainer from "../../components/containers/row-container";
import PressableText from "../../components/texts/pressable-text";
import {Hidden, HStack, Text, VStack} from "native-base";
import {useAppDispatch} from "../../store";
import AuthService from "../../shared/services/auth.service";
import {login} from "../../shared/reducers/authentication.reducer";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import {ValidationSchemas} from "../../shared/validators/schemas";

const {white} = colorsVerifyCode;

// custom components
export interface LoginScreenProps {
    navigation: NavigationProp<ParamListBase>
}

function MobileHeader() {
    return (
        <Hidden from="md">
            <VStack px="4" mt="4" mb="5" space="9">
                <HStack space="2" alignItems="center">
                </HStack>
                <VStack space={0.5}>
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        _light={{color: 'white'}}
                        _dark={{color: 'white'}}
                        accessible={true}
                        accessibilityLabel="Sign in to your account"
                    >
                        Sign in to continue
                    </Text>
                </VStack>
            </VStack>
        </Hidden>
    );
}


const LoginScreen: React.FunctionComponent<LoginScreenProps> = ({navigation}) => {
    const dispatch = useAppDispatch()

    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const handleLogin = (credentials, setSubmitting) => {
        setMessage(null);

        AuthService.login(credentials)
            .then((res) => {
                dispatch(login({
                    authTokenOutput: res.data,
                    credentials: credentials
                }))
            })
            .catch((error) => {
                const err = JSON.parse(JSON.stringify(error));
                if (err.status === 403) {
                    navigation.navigate("VerifyEmail", {
                        username: credentials.username,
                    });
                } else if (err.status === 401) {
                    setMessage('Login failed: Invalid Credentials');
                } else {
                    // Sentry.Native.captureException(err);
                    setMessage('Login failed: Unknown error');
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const _validateForm = (formData) => {
        try {
            ValidationSchemas.LoginFormSchema
                .validateSync(formData, {abortEarly: false});
            return {};
        } catch (e: any) {
            let errors = {};
            e.inner.reduce((acc, curr) => {
                if (curr.message) {
                    errors[curr.path] = curr.message;
                }
            }, {});

            return errors;
        }
    }

    return (
        <MainContainer>
            <KeyboardAvoidingContainer>
                <MobileHeader/>
                <VStack style={{margin: 25}}>
                    <Formik
                        initialValues={{username: '', password: ''}}
                        validate={_validateForm}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={async (values, {setSubmitting}) => {
                            handleLogin(values, setSubmitting);
                        }}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isSubmitting,
                              errors,
                          }) => (
                            <>
                                <StyledTextInput
                                    label="Username"
                                    icon="account-outline"
                                    placeholder="maddog"
                                    keyboardType="default"
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                    style={{marginBottom: 25}}
                                    accessible={true}
                                    accessibilityLabel="Username"
                                />

                                {errors.username && (
                                    <MsgBox
                                        success={false}
                                        style={{marginBottom: 5}}>
                                        {errors.username}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="Password"
                                    icon="lock-open"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    isPassword={true}
                                    style={{marginBottom: 25}}
                                    accessible={true}
                                    accessibilityLabel="Password"
                                />
                                {errors.password && (
                                    <MsgBox
                                        success={false}
                                        style={{marginBottom: 5}}>
                                        {errors.password}
                                    </MsgBox>
                                )}

                                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                                    {message || ' '}
                                </MsgBox>
                                {!isSubmitting && (
                                    <RegularButton
                                        onPress={handleSubmit}
                                        accessibilityLabel={"Login"}>
                                        Login
                                    </RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={white}/>
                                    </RegularButton>
                                )}

                                <RowContainer>
                                    <PressableText
                                        accessibility={true}
                                        accessibilityLabel="Register new account"
                                        onPress={() => {
                                            moveTo('Register')
                                        }}>Need an Account?</PressableText>
                                    <PressableText
                                        accessibility={true}
                                        accessibilityLabel="Forgot password"
                                        onPress={() => {
                                            moveTo('PasswordResetInit')
                                        }}>Forgot Password</PressableText>
                                </RowContainer>
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    );
};

export default LoginScreen;
