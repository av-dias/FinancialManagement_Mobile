import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);
const height = Dimensions.get("window").height;

const borderRadius = 10;

export const _styles = StyleSheet.create({
  rowNoBorder: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: "transparent",
  },
  symbolBig: { fontSize: horizontalScale(25), textAlign: "center", width: "auto", alignSelf: "center", color: "white" },
  valueInput: {
    fontSize: horizontalScale(60),
    textAlign: "center",
    backgroundColor: "transparent",
    width: "auto",
    alignSelf: "center",
    color: "white",
  },
});
