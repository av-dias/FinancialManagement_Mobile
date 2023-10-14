import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../utility/responsive";
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
  usableScreen: {
    height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  form: {
    flex: 7,
    gap: verticalScale(20),
    //paddingVertical: verticalScale(10),
    justifyContent: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  tableInfo: {
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(10),
    justifyContent: "flex-start",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  textInput: {
    flex: 1,
    fontSize: verticalScale(15),
    paddingVertical: moderateScale(6),
    textAlign: "center",
    justifyContent: "center",
    borderRadius: borderRadius,
    width: "87%",
    alignSelf: "center",
    backgroundColor: "transparent",
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
    width: "100%",
    borderRadius: 10,
    backgroundColor: color.button,
    elevation: 1,
  },
  submitButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent " },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  textCenter: { textAlign: "center", borderRadius: 10 },
  textCenterHead: { textAlign: "center", fontWeight: "bold" },
  tableText: { fontSize: verticalScale(10), textAlign: "center", padding: 0 },
  symbolBig: { fontSize: moderateScale(25), textAlign: "center", width: "auto", alignSelf: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
  },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: verticalScale(5),
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
  categoryContainer: { justifyContent: "center", alignItems: "center" },
  categoryIconContainer: { paddingHorizontal: 20 },
  categoryScrollContainer: { backgroundColor: "transparent" },
  scrollTable: { height: "85%", backgroundColor: "transparent", paddingTop: verticalScale(10) },
  divider: { margin: -5 },
});
