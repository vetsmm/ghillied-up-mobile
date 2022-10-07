import React from "react";
import SmallText from "../texts/small-text";
import {View} from "native-base";
import RNDateTimePicker, {
    AndroidNativeProps,
    IOSNativeProps,
    WindowsNativeProps
} from "@react-native-community/datetimepicker";
import {colorsVerifyCode} from "../colors";


const {primary, secondary, fail} = colorsVerifyCode;

interface ExtraInputProps {
    pickerLabel: string;
    isError?: boolean;
}

export type InputProps = (AndroidNativeProps | IOSNativeProps | WindowsNativeProps) & ExtraInputProps;

export const StyledDateTimeInput = ({pickerLabel, isError, ...props}: InputProps) => {

    return (
        <View>
            <SmallText>{pickerLabel}</SmallText>
            <View style={{ alignSelf: 'center', width: '100%' }}>
                <RNDateTimePicker
                    {...props}
                    // @ts-ignore
                    themeVariant="dark"
                    style={{
                        backgroundColor: primary,
                        borderColor: isError ? fail : secondary,
                        width: 230,
                        // @ts-ignore
                        ...props?.style
                    }}
                />
            </View>
        </View>
    );
}

export default StyledDateTimeInput;
