import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {colorsVerifyCode} from '../../components/colors';

// custom components

import {Hidden, HStack, Text, View, VStack} from "native-base";
import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import MainContainer from "../../components/containers/MainContainer";
import StyledTextInput from '../../components/inputs/styled-text-input';
import MsgBox from '../../components/texts/message-box';
import RegularButton from "../../components/buttons/regular-button";
import PressableText from "../../components/texts/pressable-text";
import StyledSelect from "../../components/select/styled-select";
import {ServiceBranch, ServiceStatus, stringToServiceBranch, stringToServiceStatus} from "../../shared/models/users";
import stringUtils from "../../shared/utils/string.utils";
import AuthService from "../../shared/services/auth.service";
import authErrorHandler from "../../shared/handlers/errors/auth-error.handler";
import * as WebBrowser from "expo-web-browser";
import AppConfig from "../../config/app.config";
import {ValidationSchemas} from "../../shared/validators";

const {primary} = colorsVerifyCode;

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
                        accessibilityLabel={'Welcome!'}
                    >
                        Welcome!
                    </Text>
                    <Text
                        fontSize="md"
                        fontWeight="normal"
                        _dark={{
                            color: 'coolGray.50',
                        }}
                        _light={{
                            color: 'primary.300',
                        }}
                        accessibilityLabel={'Sign up to continue'}
                    >
                        Sign up to continue
                    </Text>
                </VStack>
            </VStack>
        </Hidden>
    );
}


const RegisterScreen = ({navigation}) => {
    const [message, setMessage] = useState<string | null>('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);

    type FormErrors = {
        email: string | null;
        username: string | null;
        branch: string | null;
        serviceStatus: string | null;
        password: string | null;
        confirmPassword: string | null;
    }
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: null,
        username: null,
        branch: null,
        serviceStatus: null,
        password: null,
        confirmPassword: null,
    });

    const moveTo = (screen, payload?) => {
        navigation.navigate(screen, {...payload});
    };

    const handleSignup = (formData, setSubmitting) => {
        setMessage(null);

        AuthService.register(formData).then(() => {
            moveTo('VerifyEmail', {email: formData.email});
            setSubmitting(false)
        }).catch(error => {
            const errorContext = authErrorHandler.handleRegisterError(error.data.error);
            setFormErrors(errorContext);
            setMessage(error.data.error.message);
            setSubmitting(false);
        });
    }

    const _isFormValid = (formData) => {
        try {
            ValidationSchemas.RegisterFormSchema
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
                        initialValues={{
                            email: '',
                            username: '',
                            password: '',
                            confirmPassword: '',
                            branch: ServiceBranch.MARINES,
                            serviceStatus: ServiceStatus.VETERAN
                        }}
                        validate={_isFormValid}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={(values, {setSubmitting}) => {
                            handleSignup(values, setSubmitting)
                        }}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              isSubmitting,
                              errors
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
                                    isError={formErrors.username !== null}
                                    accessible={true}
                                    accessibilityLabel={'Enter username'}
                                />

                                {formErrors.username && (
                                    <MsgBox success={isSuccessMessage} style={{marginBottom: 2}}>
                                        {formErrors.username}
                                    </MsgBox>
                                )}

                                {errors.username && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.username}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="Email Address"
                                    icon="email-variant"
                                    placeholder="maddogmattis@usmc.gov"
                                    keyboardType="email-address"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    style={{marginBottom: 15}}
                                    isError={formErrors.email !== null}
                                    accessible={true}
                                    accessibilityLabel={'Enter email address'}
                                />

                                {formErrors.email && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {formErrors.email}
                                    </MsgBox>
                                )}

                                {errors.email && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.email}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    isPassword={true}
                                    style={{marginBottom: 15}}
                                    isError={formErrors.password !== null}
                                    accessible={true}
                                    accessibilityLabel={'Enter password'}
                                />

                                {formErrors.password && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {formErrors.password}
                                    </MsgBox>
                                )}

                                {errors.password && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.password}
                                    </MsgBox>
                                )}

                                <StyledTextInput
                                    label="Confirm Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    isPassword={true}
                                    style={{marginBottom: 15}}
                                    isError={formErrors.confirmPassword !== null}
                                    accessible={true}
                                    accessibilityLabel={'Enter password again'}
                                />

                                {formErrors.confirmPassword && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {formErrors.confirmPassword}
                                    </MsgBox>
                                )}

                                {errors.confirmPassword && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.confirmPassword}
                                    </MsgBox>
                                )}

                                <StyledSelect
                                    label={'Branch of Service'}
                                    accessibilityLabel={"Select your branch of service"}
                                    placeholder={'Select your branch of service'}
                                    options={
                                        Object.keys(ServiceBranch)
                                            .filter(key => stringToServiceBranch(key) !== ServiceBranch.UNKNOWN
                                                && stringToServiceBranch(key) !== ServiceBranch.NO_SERVICE
                                            )
                                            .map(value => {
                                                return {
                                                    value: stringToServiceBranch(value),
                                                    label: stringUtils.enumStyleToSentence(value)
                                                }
                                            })
                                    }
                                    onSelect={handleChange("branch")}
                                    isError={formErrors.branch !== null}
                                />

                                {formErrors.branch && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {formErrors.branch}
                                    </MsgBox>
                                )}

                                {errors.branch && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.branch}
                                    </MsgBox>
                                )}

                                <StyledSelect
                                    label={'Service Status'}
                                    accessibilityLabel={"Select your service status"}
                                    placeholder={'Select your service status'}
                                    options={
                                        Object.keys(ServiceStatus)
                                            .filter(key => stringToServiceStatus(key) !== ServiceStatus.UNKNOWN
                                                && stringToServiceStatus(key) !== ServiceStatus.CIVILIAN
                                            )
                                            .map(value => {
                                                return {
                                                    value: stringToServiceStatus(value),
                                                    label: stringUtils.enumStyleToSentence(value)
                                                }
                                            })
                                    }
                                    onSelect={handleChange("serviceStatus")}
                                    isError={formErrors.serviceStatus !== null}
                                />

                                {formErrors.serviceStatus && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {formErrors.serviceStatus}
                                    </MsgBox>
                                )}

                                {errors.serviceStatus && (
                                    <MsgBox success={false} style={{marginBottom: 2}}>
                                        {errors.serviceStatus}
                                    </MsgBox>
                                )}


                                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                                    {message || ' '}
                                </MsgBox>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        marginBottom: 25
                                    }}
                                    accessible={true}
                                    accessibilityLabel={'By signing up, you agree to our terms of service and privacy policy'}
                                >
                                    <Text
                                        color={colorsVerifyCode.white}
                                    >By creating an account, you agree to Ghillied Up's </Text>
                                    <PressableText
                                        onPress={() => {
                                            WebBrowser.openBrowserAsync(AppConfig.links.termsOfService);
                                        }}
                                    >
                                        Terms of Service
                                    </PressableText>
                                    <Text color={colorsVerifyCode.white}> and </Text>
                                    <PressableText onPress={() => {
                                        WebBrowser.openBrowserAsync(AppConfig.links.privacyPolicy);
                                    }}>
                                        Privacy Policy
                                    </PressableText>
                                </View>

                                {!isSubmitting && (
                                    <RegularButton
                                        onPress={handleSubmit}
                                        accessibilityLabel={'Sign up'}
                                    >Signup</RegularButton>
                                )}
                                {isSubmitting && (
                                    <RegularButton disabled={true}>
                                        <ActivityIndicator size="small" color={primary}/>
                                    </RegularButton>
                                )}

                                <PressableText
                                    accessibility={true}
                                    accessibilityLabel={'Already have an account? Sign in'}
                                    style={{paddingVertical: 15}} onPress={() => {
                                    moveTo('Login')
                                }}>
                                    Sign in to an existing account
                                </PressableText>
                            </>
                        )}
                    </Formik>
                </VStack>
            </KeyboardAvoidingContainer>
        </MainContainer>
    );
};

export default RegisterScreen;
