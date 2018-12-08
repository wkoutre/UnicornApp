import { StyleProp, ViewStyle, ImageStyle } from "react-native";
import { NavigationScreenProp } from "react-navigation";

export interface INavLeftElementProps {
  renderArrowWithText?: boolean;
  style?: StyleProp<ViewStyle>;
  arrowStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  onPress?: () => void;
  imageSource?: number | string;
  navigation?: NavigationScreenProp<any>;
  commonTextProps?: object;
}
