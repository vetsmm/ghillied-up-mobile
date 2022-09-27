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
import { IRootState, useAppDispatch } from "../../store";
import AuthService from "../../shared/services/auth.service";
import {login, setLoginError} from "../../shared/reducers/authentication.reducer";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as Sentry from "sentry-expo";

const {primary} = colorsVerifyCode;

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

  const isLoading = useSelector(
    (state: IRootState) => state.authentication.loading,
  );

  const handleLogin = async (credentials, setSubmitting) => {
    setMessage(null);

    AuthService.login(credentials)
      .then((res) => {
        dispatch(login(res.data))
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

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <MobileHeader/>
        <VStack style={{margin: 25}}>
          <Formik
            initialValues={{username: '', password: ''}}
            onSubmit={async (values, {setSubmitting}) => {
              if (values.username === '' || values.password === '') {
                setMessage('Please fill in all fields');
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
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
                />

                <StyledTextInput
                  label="Password"
                  icon="lock-open"
                  placeholder="* * * * * * * *"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  isPassword={true}
                  style={{marginBottom: 25}}
                />

                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                  {message || ' '}
                </MsgBox>
                {(!isSubmitting && !isLoading) && <RegularButton onPress={handleSubmit}>Login</RegularButton>}
                {(isSubmitting || isLoading) && (
                  <RegularButton disabled={true}>
                    <ActivityIndicator size="small" color={primary}/>
                  </RegularButton>
                )}

                <RowContainer>
                  <PressableText onPress={() => {
                    moveTo('Register')
                  }}>Need an Account?</PressableText>
                  <PressableText onPress={() => {
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
