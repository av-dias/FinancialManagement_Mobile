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

const borderRadius = 10;

export const _styles = StyleSheet.create({
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  form: {
    flex: 7,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(50),
    //paddingVertical: verticalScale(10),
    justifyContent: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  tableInfo: {
    flex: 2,
    paddingHorizontal: horizontalScale(50),
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 22,
    padding: moderateScale(6),
    textAlign: "center",
    borderRadius: borderRadius,
    width: "80%",
    alignSelf: "center",
  },
  valueInput: {
    fontSize: moderateScale(40),
    textAlign: "center",
    backgroundColor: "transparent",
    width: "auto",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(30),
    borderRadius: 4,
    backgroundColor: "#2296F3",
  },
  submitButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent" },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  textCenter: { textAlign: "center", backgroundColor: color.backgroundComplementary, borderRadius: 10 },
  textCenterHead: { textAlign: "center", fontWeight: "bold" },
  tableText: { fontSize: verticalScale(10), textAlign: "center", padding: 8 },
  symbolBig: { fontSize: moderateScale(25), textAlign: "center", width: "auto", alignSelf: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: color.backgroundComplementary,
  },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  rowNoBorder: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: "transparent",
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  iconLabel: { fontSize: verticalScale(8), alignSelf: "center", backgroundColor: "transparent" },
  categoryContainer: { borderColor: color.backgroundComplementary, borderWidth: 1, justifyContent: "center", alignItems: "center", borderRadius: 10 },
  categoryIconContainer: { paddingHorizontal: 20 },
  categoryScrollContainer: { backgroundColor: "transparent" },
});
