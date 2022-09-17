import React, {useState} from 'react';
import {Formik} from 'formik';
import {ActivityIndicator} from 'react-native';

import {colorsVerifyCode} from '../../components/colors';
import MainContainer from "../../components/containers/MainContainer";
import KeyboardAvoidingContainer from "../../components/containers/KeyboardAvoidingContainer";
import RegularText from "../../components/texts/regular-texts";
import MsgBox from '../../components/texts/message-box';
import StyledTextInput from "../../components/inputs/styled-text-input";
import RegularButton from "../../components/buttons/regular-button";
import AuthService from "../../shared/services/auth.service";
import {validateEmail} from "../../shared/validators/auth/validators";
import {Center, Image, useColorModeValue, VStack} from "native-base";

const {primary} = colorsVerifyCode;

// custom components
function MobileScreenImage() {
  const key = useColorModeValue('1', '2');

  return (
    <Center
      py={{base: 12, md: '190'}}
      px={{base: 4, md: 12}}
      borderTopRightRadius={{md: 'md'}}
      borderBottomRightRadius={{md: 'md'}}
      mb="-0.5"
    >
      <Image
        resizeMode={'contain'}
        height={40}
        width={56}
        key={key}
        _light={{source: require('../../../assets/confused-soldier.png')}}
        _dark={{source: require('../../../assets/confused-soldier.png')}}
        alt="Alternate Text"
      />
    </Center>
  );
}

const PasswordResetInitScreen = ({navigation}) => {
  const [message, setMessage] = useState<string | null>('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const moveTo = (screen, payload) => {
    navigation.navigate(screen, {...payload});
  };


  const handleOnSubmit = async (credentials, setSubmitting) => {
    setMessage(null);

    AuthService.resetPasswordInit({email: credentials.email})
      .then((response) => {
        moveTo('PasswordResetFinish', {email: credentials.email, isBadEmail: false});
      })
      .catch(err => {
        if (JSON.parse(JSON.stringify(err)).status === 404) {
          // Email not found, but we don't want to let a potential attacker know that
          // the email is not in the system.
          moveTo('PasswordResetFinish', {email: credentials.email, isBadEmail: true});
        } else {
          // Everything else is a real error and should inform the user.
          setMessage("Unable to reset password. Please try again.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <MobileScreenImage/>
        <VStack style={{margin: 25}}>
          <RegularText style={{marginBottom: 25}}>Please enter your account's email address </RegularText>

          <Formik
            initialValues={{email: ''}}
            onSubmit={(values, {setSubmitting}) => {
              if (validateEmail(values.email)) {
                setMessage('Please enter a valid email');
                setSubmitting(false);
              } else {
                handleOnSubmit(values, setSubmitting);
              }
            }}
          >
            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
              <>
                <StyledTextInput
                  label="Email Address"
                  icon="email-variant"
                  placeholder="walt14@gmail.com"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={{marginBottom: 25}}
                />

                <MsgBox style={{marginBottom: 25}} success={isSuccessMessage}>
                  {message || ' '}
                </MsgBox>
                {!isSubmitting && <RegularButton onPress={handleSubmit}>Submit</RegularButton>}
                {isSubmitting && (
                  <RegularButton disabled={true}>
                    <ActivityIndicator size="small" color={primary}/>
                  </RegularButton>
                )}
              </>
            )}
          </Formik>
        </VStack>
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
};

export default PasswordResetInitScreen;
