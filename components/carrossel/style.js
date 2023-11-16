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
  categoryScrollContainer: { backgroundColor: "transparent" },
  categoryContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "transparent", flex: 1 },
  categoryIconContainer: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: "center",
  },
  iconLabel: { fontSize: verticalScale(8) },
  labelContainer: { backgroundColor: "transparent", alignItems: "center", borderRadius: 5, justifyContent: "center", height: 20 },
});
