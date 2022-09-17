import {StyleSheet} from 'react-native';
import {colorsVerifyCode} from "../colors";
const {  secondary, tertiary } = colorsVerifyCode;

export default StyleSheet.create({
  container: {
    height: 40,
    marginHorizontal: 15,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: secondary,
    paddingHorizontal: 24,
    fontWeight: '400',
    color: tertiary,
    paddingLeft: 75,
  },
});
