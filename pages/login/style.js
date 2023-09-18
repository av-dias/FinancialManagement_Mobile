import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { StatusBar } from "react-native";
const statusBarHeight = StatusBar.currentHeight;

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
    width: "100%",
    fontSize: 30,
    paddingBottom: 50,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logo: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: { gap: 20, paddingBottom: 100, padding: 10, width: "100%", flex: 1, alignItems: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  rowGap: { flexDirection: "row", justifyContent: "center", maxWidth: 500, borderRadius: 4, gap: 10 },
  textInputLogin: { fontSize: 20, padding: 1, textAlign: "center", backgroundColor: "white", borderRadius: 2, flex: 3 },
  gmailInputLogin: { fontSize: 20, padding: 1, textAlign: "center", backgroundColor: "white", borderRadius: 2, flex: 2 },
  textIP: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2, width: "20%" },
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
    maxWidth: 500,
  },
});
