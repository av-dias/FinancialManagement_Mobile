import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(110);
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: {
    height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
});
