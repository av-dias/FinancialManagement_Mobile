import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

/* console.log(Dimensions.get("screen").height);
console.log(Dimensions.get("window").height);
console.log(statusBarHeight);
console.log(naviagtionBarHeight); */

export const _styles = StyleSheet.create({
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  form: {
    flex: 6,
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(50),
    paddingVertical: verticalScale(50),
    justifyContent: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  tableInfo: { flex: 3, gap: verticalScale(30), paddingHorizontal: horizontalScale(50), width: "100%", backgroundColor: "transparent" },
  textInput: {
    fontSize: 22,
    padding: moderateScale(6),
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 2,
    width: "80%",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(50),
    marginVertical: 10,
    borderRadius: 4,
    backgroundColor: "#2296F3",
  },
  submitButton: { alignSelf: "center", justifyContent: "center", paddingVertical: moderateScale(20) },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  textCenter: { textAlign: "center" },
  textCenterHead: { textAlign: "center", fontWeight: "bold" },
  tableText: { fontSize: verticalScale(15), textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "white", borderRadius: 4 },
});
