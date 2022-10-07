import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {colorsVerifyCode} from '../../components/colors';

// custom components

import {Hidden, HStack, Text, VStack} from "native-base";
import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import MainContainer from "../../components/containers/MainContainer";
import StyledTextInput from '../../components/inputs/styled-text-input';
import MsgBox from '../../components/texts/message-box';
import RegularButton from "../../components/buttons/regular-button";
import PressableText from "../../components/texts/pressable-text";
import StyledSelect from "../../components/select/styled-select";
import {ServiceBranch, ServiceStatus, stringToServiceBranch, stringToServiceStatus} from "../../shared/models/users";
import stringUtils from "../../shared/utils/string.utils";
import validators from "../../shared/validators/auth";
import AuthService from "../../shared/services/auth.service";
import {FormValidationResponse} from "../../shared/validators/auth/register-form.validator";
import authErrorHandler from "../../shared/handlers/errors/auth-error.handler";

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

  const handleSignup = async (formData, setSubmitting) => {
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

  const _isFormInvalid = (formData): boolean => {
    setMessage(null);

    const errors: FormValidationResponse = validators.registerFormValidator(formData);

    setFormErrors({
      email: errors.email,
      username: errors.username,
      branch: errors.branch,
      serviceStatus: errors.serviceStatus,
      password: errors.password,
      confirmPassword: errors.confirmPassword,
    });

    return Object.values(errors).some(error => error !== null);
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
            onSubmit={(values, {setSubmitting}) => {
              if (_isFormInvalid(values)) {
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
              }
            }}
          >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting
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
                />

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.username && formErrors.username}
                </MsgBox>

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
                />

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.email || ' '}
                </MsgBox>

                <StyledTextInput
                  label="Password"
                  icon="lock-open"
                  placeholder="* * * * * * * *"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  isPassword={true}
                  style={{marginBottom: 15}}
                  isError={formErrors.password !== null}
                />

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.password || ' '}
                </MsgBox>

                <StyledTextInput
                  label="Confirm Password"
                  icon="lock-open"
                  placeholder="* * * * * * * *"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  isPassword={true}
                  style={{marginBottom: 15}}
                  isError={formErrors.confirmPassword !== null}
                />

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.confirmPassword || ' '}
                </MsgBox>

                <StyledSelect
                  label={'Branch of Service'}
                  accessibilityLabel={"Select your branch of services"}
                  placeholder={'Select your branch of services'}
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

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.branch || ' '}
                </MsgBox>

                <StyledSelect
                  label={'Service Status'}
                  accessibilityLabel={"Select your services status"}
                  placeholder={'Select your services status'}
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

                <MsgBox success={isSuccessMessage} style={{ marginBottom: 2}}>
                  {formErrors.serviceStatus || ' '}
                </MsgBox>


                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                  {message || ' '}
                </MsgBox>

                {!isSubmitting && <RegularButton onPress={handleSubmit}>Signup</RegularButton>}
                {isSubmitting && (
                  <RegularButton disabled={true}>
                    <ActivityIndicator size="small" color={primary}/>
                  </RegularButton>
                )}

                <PressableText style={{paddingVertical: 15}} onPress={() => {
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
