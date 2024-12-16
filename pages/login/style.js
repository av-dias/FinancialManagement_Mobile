import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, inverseScale } from "../../functions/responsive";
import { StatusBar } from "react-native";
const borderRadius = 5;

export const _styles = StyleSheet.create({
  pageLogin: {
    flex: 1,
    backgroundColor: dark.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  headerLogin: {
    flex: 1,
    fontSize: 30,
    paddingVertical: 10,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  loginCard: {
    width: "100%",
    padding: verticalScale(20),
    gap: 30,
  },
  logo: {
    width: verticalScale(25),
    height: verticalScale(25),
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: {
    flex: 2,
    gap: verticalScale(20),
    width: "100%",
    paddingHorizontal: moderateScale(5),
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
    borderRadius: borderRadius,
    backgroundColor: "transparent",
  },
  rowGap: { flex: 1, flexDirection: "row", justifyContent: "center", maxWidth: 500, borderRadius: 4, gap: 10 },
  textInputLogin: {
    fontSize: verticalScale(12),
    paddingVertical: horizontalScale(5),
    paddingHorizontal: verticalScale(12),
    backgroundColor: "white",
    borderRadius: borderRadius,
    flex: 3,
  },
  textIP: {
    flex: 1,
    fontSize: verticalScale(10),
    padding: horizontalScale(5),
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: borderRadius,
    width: "20%",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: borderRadius,
    backgroundColor: dark.button,
    elevation: 1,
  },
  submitSection: { flex: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center", paddingHorizontal: moderateScale(5) },
  rememberMe: { flex: 1, fontSize: 50 },
});
