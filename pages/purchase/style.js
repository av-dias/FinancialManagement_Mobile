import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

/* console.log(Dimensions.get("screen").height);
console.log(Dimensions.get("window").height);
console.log(statusBarHeight);
console.log(naviagtionBarHeight); */

const borderRadius = commonStyles.borderRadius;

export const _styles = StyleSheet.create({
  usableScreen: {
    height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight,
    backgroundColor: "transparent",
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
    paddingTop: verticalScale(20),
  },
  tableInfo: {
    width: "100%",
    height: "100%",
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
    fontSize: horizontalScale(60),
    textAlign: "center",
    backgroundColor: "transparent",
    width: "auto",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: color.button,
    elevation: 1,
  },
  submitButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "transparent " },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  textCenter: { textAlign: "center", borderRadius: borderRadius, height: "100%", gap: 10 },
  textCenterHead: { textAlign: "center", fontWeight: "bold" },
  tableText: { fontSize: verticalScale(10), textAlign: "center", padding: 0 },
  symbolBig: { fontSize: horizontalScale(25), textAlign: "center", width: "auto", alignSelf: "center" },
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
  // REMOVE
  rowNoBorder: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: "transparent",
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  scrollTable: { height: "100%", backgroundColor: "transparent" },
  divider: { margin: -5 },
});
