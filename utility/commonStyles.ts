import { StatusBar, Dimensions } from "react-native";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  largeScale,
} from "../functions/responsive";

const statusBarHeight = verticalScale(StatusBar.currentHeight);
const navigationBarHeight = verticalScale(120);
const paddingHorizontal = moderateScale(15);

const commonStyles = {
  usableScreen: {
    height:
      Dimensions.get("window").height - statusBarHeight - navigationBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: paddingHorizontal,
  },
  mainPaddingHorizontal: 5,
  paddingHorizontal: moderateScale(15),
  borderRadius: 10,
  boxPaddingVertical: moderateScale(10),
  boxPaddingHorizontal: moderateScale(0),
  naviagtionBarHeight: verticalScale(110),
  textSizeLarge: verticalScale(30),
  symbolSize: verticalScale(8),
  smallTextSize: verticalScale(9),
  statusBarHeight: verticalScale(StatusBar.currentHeight),
  onPressBounce: (pressed, style, onPressCallback, padding = 2) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && padding : null,
    },
  ],
  onBarPressBounce: (pressed, style, onPressCallback) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && 1 : null,
    },
  ],
};

export default commonStyles;
