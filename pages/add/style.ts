import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

export const _styles = StyleSheet.create({
  usableScreen: {
    height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight,
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
});
