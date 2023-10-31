import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);
const height = Dimensions.get("window").height;

/* console.log(Dimensions.get("screen").height);
console.log(Dimensions.get("window").height);
console.log(statusBarHeight);
console.log(naviagtionBarHeight); */

const borderRadius = 10;

export const _styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center", backgroundColor: "transparent" },
  textInput: {
    flex: 10,
    fontSize: verticalScale(15),
    paddingVertical: moderateScale(6),
    textAlign: "center",
    justifyContent: "center",
    borderRadius: borderRadius,
    width: "87%",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});
