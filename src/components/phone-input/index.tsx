import React, {PureComponent} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleProp,
    ViewStyle,
    TextInputProps,
    TextStyle,
    TextInput
} from "react-native";
import CountryPicker, {
    getCallingCode,
    DEFAULT_THEME,
    CountryModalProvider,
    Flag, CountryCode, Country, CallingCode,
} from "react-native-country-picker-modal";
import {PhoneNumberUtil} from "google-libphonenumber";
import styles from "./styles";
import {CountryFilterProps} from "react-native-country-picker-modal/lib/CountryFilter";
import {colorsVerifyCode} from "../colors";
import styled from 'styled-components/native';
import {AntDesign} from "@expo/vector-icons";

const phoneUtil = PhoneNumberUtil.getInstance();

export interface PhoneInputProps {
    autoFocus?: boolean;
    defaultCode?: CountryCode;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    disableArrowIcon?: boolean;
    placeholder?: string;
    onChangeCountry?: (country: Country) => void;
    onChangeText?: (text: string) => void;
    onChangeFormattedText?: (text: string) => void;
    renderDropdownImage?: JSX.Element;
    containerStyle?: StyleProp<ViewStyle>;
    textContainerStyle?: StyleProp<ViewStyle>;
    textInputProps?: TextInputProps;
    textInputStyle?: StyleProp<TextStyle>;
    codeTextStyle?: StyleProp<TextStyle>;
    flagButtonStyle?: StyleProp<ViewStyle>;
    countryPickerButtonStyle?: StyleProp<ViewStyle>;
    layout?: "first" | "second";
    filterProps?: CountryFilterProps;
    countryPickerProps?: any;
    flagSize?: number;
}

export interface PhoneInputState {
    code: CallingCode | undefined;
    number: string;
    modalVisible: boolean;
    countryCode: CountryCode;
    disabled: boolean;
}

export default class PhoneInput extends PureComponent<PhoneInputProps, PhoneInputState> {
    constructor(props: PhoneInputProps, context: any) {
        super(props);
        this.state = {
            code: props.defaultCode ? undefined : "91",
            number: props.value
                ? props.value
                : props.defaultValue
                    ? props.defaultValue
                    : "",
            modalVisible: false,
            countryCode: props.defaultCode ? props.defaultCode : "IN",
            disabled: props.disabled || false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.disabled !== prevState.disabled) {
            if ((nextProps.value || nextProps.value === "") && nextProps.value !== prevState.number) {
                return ({disabled: nextProps.disabled, number: nextProps.value});
            }
            return ({disabled: nextProps.disabled});
        }
        return null;
    };

    async componentDidMount() {
        const {defaultCode} = this.props;
        if (defaultCode) {
            const code = await getCallingCode(defaultCode);
            this.setState({code});
        }
    }

    getCountryCode = (): CountryCode => {
        return this.state.countryCode;
    };

    getCallingCode = (): string | undefined => {
        return this.state.code;
    };

    isValidNumber = (number): boolean => {
        try {
            const {countryCode} = this.state;
            const parsedNumber = phoneUtil.parse(number, countryCode);
            return phoneUtil.isValidNumber(parsedNumber);
        } catch (err) {
            return false;
        }
    };

    onSelect = (country): void => {
        const {onChangeCountry} = this.props;
        this.setState(
            {
                countryCode: country.cca2,
                code: country.callingCode[0],
            },
            () => {
                const {onChangeFormattedText} = this.props;
                if (onChangeFormattedText) {
                    if (country.callingCode[0]) {
                        onChangeFormattedText(
                            `+${country.callingCode[0]}${this.state.number}`
                        );
                    } else {
                        onChangeFormattedText(this.state.number);
                    }
                }
            }
        );
        if (onChangeCountry) {
            onChangeCountry(country);
        }
    };

    onChangeText = (text): void => {
        this.setState({number: text});
        const {onChangeText, onChangeFormattedText} = this.props;
        if (onChangeText) {
            onChangeText(text);
        }
        if (onChangeFormattedText) {
            const {code} = this.state;
            if (code) {
                onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
            } else {
                onChangeFormattedText(text);
            }
        }
    };

    getNumberAfterPossiblyEliminatingZero(): { number: string, formattedNumber: string } {
        let {number, code} = this.state;
        if (number.length > 0 && number.startsWith("0")) {
            number = number.substr(1);
            return {number, formattedNumber: code ? `+${code}${number}` : number};
        } else {
            return {number, formattedNumber: code ? `+${code}${number}` : number};
        }
    }

    renderDropdownImage = () => {
        return (
            <AntDesign name="caretdown" size={14} color={colorsVerifyCode.tertiary}/>
        )
    };

    renderFlagButton = (props) => {
        const {layout = "first", flagSize} = this.props;
        const {countryCode} = this.state;
        if (layout === "first") {
            return (
                <Flag
                    countryCode={countryCode}
                    flagSize={flagSize ? flagSize : DEFAULT_THEME.flagSize}
                />
            );
        }
        return <View/>;
    };

    render(): JSX.Element {
        const {
            autoFocus,
            placeholder,
            disableArrowIcon,
            renderDropdownImage,
            countryPickerProps = {},
            filterProps = {},
            countryPickerButtonStyle,
            textInputProps,
            layout = "first",
        } = this.props;
        const {modalVisible, code, countryCode, number, disabled} = this.state;
        return (
            <CountryModalProvider>
                <View
                    style={[
                        styles.container,
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.flagButtonView,
                            layout === "second" ? styles.flagButtonExtraWidth : {},
                            countryPickerButtonStyle ? countryPickerButtonStyle : {},
                        ]}
                        disabled={disabled}
                        onPress={() => this.setState({modalVisible: true})}
                    >
                        <CountryPicker
                            onSelect={this.onSelect}
                            withEmoji
                            withFilter
                            withFlag
                            filterProps={{
                                placeholder: "Search",
                                cursorColor: colorsVerifyCode.tertiary,
                                placeholderTextColor: colorsVerifyCode.tertiary,
                                selectionColor: colorsVerifyCode.tertiary,
                                color: colorsVerifyCode.tertiary,
                            }}
                            countryCode={countryCode}
                            withCallingCode
                            disableNativeModal={disabled}
                            visible={modalVisible}
                            containerButtonStyle={{
                                backgroundColor: colorsVerifyCode.primary,
                                color: colorsVerifyCode.tertiary,
                            }}
                            theme={{
                                backgroundColor: colorsVerifyCode.primary,
                                borderColor: colorsVerifyCode.tertiary,
                                color: colorsVerifyCode.tertiary,
                                primaryColor: colorsVerifyCode.tertiary,
                                onBackgroundTextColor: colorsVerifyCode.tertiary,
                                filterPlaceholderTextColor: colorsVerifyCode.tertiary,
                            }}
                            renderFlagButton={this.renderFlagButton}
                            onClose={() => this.setState({modalVisible: false})}
                            {...countryPickerProps}
                        />
                        {code && layout === "second" && (
                            <Text
                                style={[styles.codeText]}
                            >{`+${code}`}</Text>
                        )}
                        {!disableArrowIcon && (
                            <React.Fragment>
                                {renderDropdownImage
                                    ? renderDropdownImage
                                    : this.renderDropdownImage()}
                            </React.Fragment>
                        )}
                    </TouchableOpacity>
                    <View
                        style={[
                            styles.textContainer,
                        ]}
                    >
                        {code && layout === "first" && (
                            <Text
                                style={styles.codeText}
                            >{`+${code}`}</Text>
                        )}
                        <TextInput
                            style={styles.numberText}
                            placeholderTextColor={colorsVerifyCode.lighterGray}
                            placeholder={placeholder ? placeholder : "Enter a phone number"}
                            onChangeText={this.onChangeText}
                            value={number}
                            editable={disabled ? false : true}
                            selectionColor="black"
                            keyboardType="number-pad"
                            autoFocus={autoFocus}
                            {...textInputProps}
                        />
                    </View>
                </View>
            </CountryModalProvider>
        );
    }
}

export const isValidNumber = (number: string, countryCode: CountryCode): boolean => {
    try {
        const parsedNumber = phoneUtil.parse(number, countryCode);
        return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
        return false;
    }
};
