import React, { useState, useEffect } from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';

import RowContainer from '../containers/row-container';
import SmallText from "../texts/small-text";
import PressableText from "../texts/pressable-text";
const { accent, success, fail } = colorsVerifyCode;

const StyledView = styled.View`
  align-items: center;
`;

const ResendText = styled(SmallText)`
  color: ${accent};
  ${(props: any) => {
  const { resendStatus } = props;
  if (resendStatus == 'Failed!') {
    return `color: ${fail}`;
  } else if (resendStatus == 'Sent!') {
    return `color: ${success}`;
  }
}}
`;

const ResendTimer = ({ activeResend, setActiveResend, targetTimeInSeconds, resendEmail, resendStatus, resendingEmail, ...props }: any) => {
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [targetTime, setTargetTime] = useState<any>(null);

  let resendTimerInterval: any;

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds);
    setActiveResend(false);
    const finalTime = +new Date() + targetTimeInSeconds * 1000;
    resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000);
  };

  const calculateTimeLeft = (finalTime: any) => {
    const difference = finalTime - +new Date();
    if (difference >= 0) {
      setTimeLeft(Math.round(difference / 1000));
    } else {
      clearInterval(resendTimerInterval);
      setActiveResend(true);
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    triggerTimer(targetTimeInSeconds);

    return () => {
      clearInterval(resendTimerInterval);
    };
  }, []);

  return (
    <StyledView {...props}>
      <RowContainer>
        <SmallText>Didn't receive the email? </SmallText>
        <PressableText
          onPress={() => resendEmail(triggerTimer)}
          disabled={!activeResend || resendingEmail}
          style={{ opacity: !activeResend ? 0.65 : 1 }}
        >
          <ResendText resendStatus={resendStatus}>{resendStatus}</ResendText>
        </PressableText>
      </RowContainer>

      {!activeResend && (
        <SmallText>
          in <SmallText style={{ fontWeight: 'bold' }}>{timeLeft || targetTime}</SmallText> second(s)
        </SmallText>
      )}
    </StyledView>
  );
};

export default ResendTimer;
