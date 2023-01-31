import React, { useState, useEffect } from 'react';

// styled components
// @ts-ignore
import styled from 'styled-components/native';
import { colorsVerifyCode } from '../colors';

import RowContainer from '../containers/row-container';
import SmallText from "../texts/small-text";
import PressableText from "../texts/pressable-text";
import {TouchableOpacity} from "react-native";
import {Badge} from "native-base";
const { accent, success, fail } = colorsVerifyCode;

const StyledView = styled.View`
  align-items: center;
`;

const ResendText = styled(SmallText)`
  ${(props: any) => {
  const { resendStatus } = props;
  if (resendStatus == 'Failed!') {
    return `color: ${fail}`;
  } else if (resendStatus == 'Sent!') {
    return `color: ${success}`;
  }
}}
`;

const ResendBadgeTimer = ({
                       activeResend,
                       setActiveResend,
                       targetTimeInSeconds,
                       resend,
                       resendStatus,
                       isResending,
                       resendLabel = 'Didn\'t receive the email?',
                       resendButtonText = 'Resend',
                       badgeColor = "warning",
                       badgeVariant = "solid",
                       ...props }: any
) => {
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
        <SmallText>{resendLabel}</SmallText>
        <TouchableOpacity
          onPress={() => resend(triggerTimer)}
          disabled={!activeResend || isResending}
          style={{ marginTop: "1%", marginBottom: "1%" }}
        >
          <Badge variant="outline" colorScheme={!activeResend || isResending ? "gray" : "warning"}>
              <ResendText resendStatus={resendStatus}>{resendButtonText}</ResendText>
          </Badge>
        </TouchableOpacity>

      {!activeResend && (
        <SmallText>
          in <SmallText style={{ fontWeight: 'bold' }}>{timeLeft || targetTime}</SmallText> second(s)
        </SmallText>
      )}
    </StyledView>
  );
};

export default ResendBadgeTimer;
