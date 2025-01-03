import { StatusBar } from "react-native";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../functions/responsive";

const commonStyles = {
  paddingHorizontal: moderateScale(15),
  borderRadius: 10,
  boxPaddingVertical: moderateScale(10),
  boxPaddingHorizontal: moderateScale(0),
  naviagtionBarHeight: verticalScale(110),
  statusBarHeight: verticalScale(StatusBar.currentHeight),
  onPressBounce: (pressed, style, onPressCallback, padding = 2) => [{ ...style, opacity: pressed ? onPressCallback && 0.8 : 1, paddingHorizontal: pressed ? onPressCallback && padding : null }],
  onBarPressBounce: (pressed, style, onPressCallback) => [{ ...style, opacity: pressed ? onPressCallback && 0.8 : 1, paddingHorizontal: pressed ? onPressCallback && 1 : null }],
};

export default commonStyles;
