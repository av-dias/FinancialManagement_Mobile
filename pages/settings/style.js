import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  form: { gap: verticalScale(20), paddingHorizontal: horizontalScale(50), paddingVertical: verticalScale(50), width: "100%" },
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: 10,
    backgroundColor: color.button,
    elevation: 1,
  },
  buttonChoice: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: 10,
    backgroundColor: color.secundary,
    elevation: 1,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
