import React, {useState} from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';

import {colorsVerifyCode} from '../../components/colors';

// custom components
import KeyboardAvoidingContainer from '../../components/containers/KeyboardAvoidingContainer';
import RegularText from "../../components/texts/regular-texts";
import MainContainer from '../../components/containers/MainContainer';
import RegularButton from "../../components/buttons/regular-button";
import IconHeader from "../../components/icons/icon-header";
import StyledCodeInput from "../../components/inputs/styled-code-input";
import ResendTimer from '../../components/timers/resend-timer';
import MessageModal from "../../components/modals/message-modal";
import {VStack} from "native-base";
import {verifyEmail} from "../../shared/reducers/authentication.reducer";
import AuthService from "../../shared/services/auth.service";
import {useAppDispatch} from "../../store";
import * as Sentry from "sentry-expo";
import {FlashMessageRef} from "../../app/App";

const {primary, secondary, lightGray} = colorsVerifyCode;

const EmailVerification = ({route}: any) => {
  const {email, username} = route.params;

  const dispatch = useAppDispatch()

  // code input
  const MAX_CODE_LENGTH = 6;
  const [code, setCode] = useState('');
  const [pinReady, setPinReady] = useState(false);

  // resending email
  const [activeResend, setActiveResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('Resend');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessageType, setModalMessageType] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [buttonText, setButtonText] = useState('');

  const buttonHandler = () => {
    setModalVisible(false);
  };

  const showModal = (type: any, headerText: any, message: any, buttonText: any) => {
    setModalMessageType(type);
    setHeaderText(headerText);
    setModalMessage(message);
    setButtonText(buttonText);
    setModalVisible(true);
  };

  const resendEmail = async (triggerTimer: any) => {
    try {
      setResendingEmail(true);

      const obj = email ? {email} : {username};

      AuthService.resendActivationEmail(obj)
        .then(() => {
          setResendStatus('Sent');
          FlashMessageRef.current?.showMessage({
            message: 'Email sent!',
            type: 'success',
            style: {
              justifyContent: 'center',
              alignItems: 'center',
            }
          });
        })
        .catch(err => {
          FlashMessageRef.current?.showMessage({
            message: 'Error resending email, please try again later.',
            type: 'danger',
            style: {
              justifyContent: 'center',
              alignItems: 'center',
            }
          });
          Sentry.Native.captureException(err);
          setResendStatus('Failed');
        });

      setResendingEmail(false);
      // hold on briefly
      setTimeout(() => {
        setResendStatus('Resend');
        setActiveResend(false);
        triggerTimer();
      }, 5000);
    } catch (error: any) {
      setResendingEmail(false);
      setResendStatus('Failed!');
      alert('Email Resend Failed: ' + error.message);
    }
  };

  const handleEmailVerification = async () => {
    setVerifying(true);

    const obj = email ? {email} : {username};
    AuthService.activateAccount({
      activationCode: Number.parseInt(code),
      ...obj
    })
      .then((res) => {
        dispatch(verifyEmail(res.data));
        setVerifying(false);
        showModal('success', 'Success', 'Your account has been activated!', 'OK');
      })
      .catch((err) => {
        setVerifying(false);
        showModal('error', 'Error', "Invalid activation code or activation code has expired. Please click 'resend' to receive a new code.", 'OK');
      })
      .finally(() => {
        setVerifying(false);
      });
  };

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <VStack style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // margin top from screen height to be centered
          marginTop: Dimensions.get('window').height * 0.15,
        }}>
          <IconHeader name="lock-open" style={{marginBottom: 30}}/>
          <RegularText style={{textAlign: 'center'}}>
            Enter the 6-digit code sent to your email
          </RegularText>
          <StyledCodeInput code={code} setCode={setCode} maxLength={MAX_CODE_LENGTH} setPinReady={setPinReady}/>
          {!verifying && pinReady && <RegularButton onPress={handleEmailVerification}>Verify</RegularButton>}
          {!verifying && !pinReady && (
            <RegularButton disabled={true} style={{backgroundColor: secondary}} textStyle={{color: lightGray}}>
              Verify
            </RegularButton>
          )}
          {verifying && (
            <RegularButton disabled={true}>
              <ActivityIndicator size="small" color={primary}/>
            </RegularButton>
          )}
          <ResendTimer
            activeResend={activeResend}
            setActiveResend={setActiveResend}
            resendStatus={resendStatus}
            resendingEmail={resendingEmail}
            resendEmail={resendEmail}
          />
          <MessageModal
            modalVisible={modalVisible}
            buttonHandler={buttonHandler}
            type={modalMessageType}
            headerText={headerText}
            message={modalMessage}
            buttonText={buttonText}
          />
        </VStack>
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
};

export default EmailVerification;
