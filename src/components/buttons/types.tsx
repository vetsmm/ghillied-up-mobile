import { ReactNode } from "react";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface ButtonProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: ((event: any) => void) | undefined;
  disabled?: boolean;
  accessibilityLabel?: string;
}
