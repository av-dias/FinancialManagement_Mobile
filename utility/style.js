import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "./colors";
import { horizontalScale, verticalScale, moderateScale } from "../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

/* console.log(Dimensions.get("screen").height);
console.log(Dimensions.get("window").height);
console.log(statusBarHeight);
console.log(naviagtionBarHeight); */

export const _styles = StyleSheet.create({
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight },
  pageLogin: {
    flex: 1,
    backgroundColor: color.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  container: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  title: { padding: 10, fontSize: 40, alignContent: "center", textAlign: "center", width: "100%" },
  centered: { alignItems: "center", justifyContent: "center", backgroundColor: "red" },
  textCenter: { textAlign: "center" },
  textCenterHead: { textAlign: "center", fontWeight: "bold" },
  textInputLogin: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2 },
  text: { fontSize: 20, textAlign: "center" },
  smallText: { fontSize: 12, textAlign: "center" },
  emailText: { fontSize: 20, textAlign: "center" },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: { gap: 20, paddingBottom: 100, padding: 10, width: "100%", flex: 1 },
  form: { gap: verticalScale(20), paddingHorizontal: horizontalScale(50), paddingVertical: verticalScale(50), width: "100%" },
  tableInfo: { gap: 30, paddingLeft: 30, paddingRight: 30, width: "100%", height: "100%" },
  row: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "white", borderRadius: 4 },
  rowTable: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "transparent", borderRadius: 4 },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", borderRadius: 4, gap: 20 },
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  test: { backgroundColor: "red" },
  header: {
    fontSize: 30,
    padding: verticalScale(15),
    gap: 10,
    marginTop: statusBarHeight,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "black",
  },
  headerLogin: {
    flex: 1,
    width: "100%",
    fontSize: 30,
    paddingBottom: 50,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: {
    fontSize: 20,
    width: "100%",
    color: "white",
  },
  seperatorText: {
    fontSize: 15,
    width: "100%",
    color: "black",
    textAlign: "right",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2296F3",
  },
  buttonList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 80,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#85754e",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  submitButton: { position: "absolute", bottom: 10, alignSelf: "center", justifyContent: "center" },
  textIP: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2, width: "20%" },
  icon: { justifyContent: "center" },
  iconLeft: { justifyContent: "center", marginLeft: 0, marginRight: 0 },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  calendar: { justifyContent: "center", alignItems: "center", flex: 1, width: "100%" },
  chart: { flex: 3, justifyContent: "center", alignItems: "center" },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
});
