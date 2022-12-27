import React from "react";
import {Select, View} from "native-base";
import {colorsVerifyCode} from "../colors";
import SmallText from "../texts/small-text";
import {Platform, StyleProp, ViewStyle} from 'react-native';

const {primary, tertiary, secondary, fail} = colorsVerifyCode;


export type ISelectOption = {
    value: string;
    label: string;
}

export type StyledSelectProps = {
    label?: string;
    accessibilityLabel?: string;
    placeholder?: string;
    disabled?: boolean;
    options: Array<ISelectOption>;
    onSelect: (value: string) => void;
    isError?: boolean;
    initialValue?: string;
    containerStyle?: StyleProp<ViewStyle>
}


export const StyledSelect: React.FunctionComponent<StyledSelectProps> = (props) => {

    return (
        <View style={props.containerStyle}>
            <SmallText>{props.label}</SmallText>
            <Select
                accessible={true}
                isDisabled={props.disabled}
                backgroundColor={primary}
                padding={"15px"}
                paddingLeft={"20px"}
                paddingRight={"55px"}
                borderRadius={"10px"}
                fontSize={"16px"}
                height={"60px"}
                marginTop={"3px"}
                marginBottom={"10px"}
                color={tertiary}
                borderColor={props.isError ? fail : secondary}
                borderWidth={"2px"}
                accessibilityLabel={props.accessibilityLabel || "Select an option"}
                placeholder={props.placeholder || "Select an option"}
                onValueChange={(value) => props.onSelect(value)}
                defaultValue={props.initialValue || props.options[0].value}
                _actionSheet={{
                    useRNModal: Platform.OS === 'ios',
                }}
            >
                {props.options && props.options.map((option) => (
                    <Select.Item
                        key={option.value}
                        value={option.value}
                        label={option.label}
                    />
                ))}
            </Select>
        </View>
    );
}

export default StyledSelect;
