import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, largeScale, inverseScale } from "../../utility/responsive";
import { StatusBar } from "react-native";

export const _styles = StyleSheet.create({
  pageLogin: {
    flex: 1,
    backgroundColor: color.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  headerLogin: {
    flex: 1,
    fontSize: 30,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  loginCard: {
    width: verticalScale(290),
    height: inverseScale(450),
    alignContent: "center",
    justifyContent: "center",
    padding: verticalScale(20),
    backgroundColor: color.backgroundSecundary,
    borderRadius: 10,
  },
  logo: {
    width: verticalScale(100),
    height: verticalScale(100),
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: {
    flex: 2,
    gap: verticalScale(20),
    width: "100%",
    paddingHorizontal: moderateScale(10),
    alignItems: "center",
    backgroundColor: "transparent",
    justifyContent: "center",
    maxHeight: 300,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  rowGap: { flex: 1, flexDirection: "row", justifyContent: "center", maxWidth: 500, borderRadius: 4, gap: 10 },
  textInputLogin: { fontSize: 20, padding: horizontalScale(5), textAlign: "center", backgroundColor: "white", borderRadius: 2, flex: 3 },
  gmailInputLogin: {
    fontSize: 20,
    padding: 1,
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 2,
    flex: 2,
  },
  textIP: { flex: 1, fontSize: 20, padding: horizontalScale(5), textAlign: "center", backgroundColor: "white", borderRadius: 2, width: "20%" },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
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
  submitSection: { flex: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" },
});
