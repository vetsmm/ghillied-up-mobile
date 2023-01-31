import {StyleSheet, Dimensions} from 'react-native';
import {colorsVerifyCode} from "../colors";
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
function hp(percentage) {
    const value = (percentage * viewportHeight) / 100;
    return Math.round(value);
}
const styles = StyleSheet.create({
    container: {
        // width: wp(80),
        flexDirection: 'row',
        borderColor: colorsVerifyCode.secondary,
        borderRadius: 10,
        borderWidth: 3,
        color: colorsVerifyCode.tertiary,
    },
    flagButtonView: {
        width: wp(20),
        height: '100%',
        minWidth: 32,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorsVerifyCode.primary,
        color: colorsVerifyCode.tertiary,
        borderRadius: 10,
    },
    flagButtonExtraWidth: {
        width: wp(23),
    },
    dropDownImage: {
        height: 14,
        width: 12,
        color: colorsVerifyCode.tertiary,
    },
    textContainer: {
        flex: 1,
        backgroundColor: colorsVerifyCode.primary,
        color: colorsVerifyCode.tertiary,
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        textAlign: 'left',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    codeText: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: '500',
        color: colorsVerifyCode.tertiary,
    },
    numberText: {
        fontSize: 16,
        color: colorsVerifyCode.tertiary,
        backgroundColor: colorsVerifyCode.primary,
        flex: 1,
    },
});

export default styles;
