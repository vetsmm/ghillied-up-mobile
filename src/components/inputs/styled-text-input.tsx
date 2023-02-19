import React, {ComponentProps, ReactNode, useState} from 'react';
import {TextInputProps, View} from 'react-native';


// styled components
import styled from 'styled-components/native';
import {colorsVerifyCode} from '../colors';
import SmallText from "../texts/small-text";
import GhillieIcon from "../ghillie-icon";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Icon} from "native-base";

const {primary, secondary, tertiary, accent, lighterGray, fail} = colorsVerifyCode;

interface ExtraInputProps {
    label?: ReactNode;
    icon: ComponentProps<typeof GhillieIcon | typeof MaterialCommunityIcons>["name"];
    isPassword?: boolean;
    isError?: boolean;
    disabled?: boolean;
}

export type InputProps = TextInputProps & ExtraInputProps;

const InputField = styled.TextInput`
  background-color: ${primary};
  padding: 15px;
  padding-left: 65px;
  padding-right: 55px;
  border-radius: 10px;
  font-size: 16px;
  height: 60px;
  margin-top: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
  border-color: ${secondary};
  border-width: 2px;
`;

const LeftIcon = styled.View`
  position: absolute;
  top: 35px;
  left: 15px;
  z-index: 1;
  border-right-width: 2px;
  border-color: ${secondary};
  padding-right: 10px;
`;

const RightIcon = styled.TouchableOpacity`
  position: absolute;
  top: 35px;
  right: 15px;
  z-index: 1;
`;

const StyledTextInput = ({icon, label, isPassword, isError, disabled = false, ...props}: InputProps) => {

    const [inputBackgroundColor, setInputBackgroundColor] = useState(primary);
    const [hidePassword, setHidePassword] = useState(true);

    const customOnBlur = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props?.onBlur;
        setInputBackgroundColor(primary);
    };

    const customOnFocus = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props?.onFocus;
        setInputBackgroundColor(secondary);
    };

    const getIconType = () => {
        if (icon in GhillieIcon) return GhillieIcon;
        if (icon in MaterialCommunityIcons) return MaterialCommunityIcons;
    }

    return (
        <View>
            <LeftIcon>
                <Icon
                    as={getIconType()}
                    name={icon}
                    size={30}
                    color={tertiary}
                />
            </LeftIcon>
            {label && (
                <SmallText>{label}</SmallText>
            )}
            <InputField
                {...props}
                placeholderTextColor={lighterGray}
                style={{
                    backgroundColor: inputBackgroundColor,
                    // @ts-ignore
                    borderColor: isError ? fail : secondary, ...props?.style
                }}
                onBlur={customOnBlur}
                onFocus={customOnFocus}
                secureTextEntry={isPassword && hidePassword}
                disabled={disabled}
            />
            {isPassword && (
                <RightIcon
                    onPress={() => {
                        setHidePassword(!hidePassword);
                    }}
                >
                    <MaterialCommunityIcons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={tertiary}/>
                </RightIcon>
            )}
        </View>
    );
};

export default StyledTextInput;
