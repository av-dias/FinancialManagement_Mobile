import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

export const _styles = StyleSheet.create({
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight, backgroundColor: "transparent" },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  calendar: { justifyContent: "center", alignItems: "center", flex: 1, width: "100%", backgroundColor: "transparent" },
  buttonList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    marginHorizontal: horizontalScale(20),
    marginVertical: verticalScale(10),
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  text: { fontSize: 20, textAlign: "center", zIndex: 1, backgroundColor: "transparent" },
  rowGap: { flexDirection: "row", justifyContent: "space-between", width: "100%", borderRadius: 4, backgroundColor: "transparent" },
  buttonText: {
    fontSize: verticalScale(12),
    color: "black",
  },
  button: {
    padding: 10,
    paddingHorizontal: horizontalScale(20),
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  seperatorText: {
    fontSize: 15,
    width: "100%",
    color: "black",
    textAlign: "right",
    paddingTop: 50,
  },
  listDate: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: "grey",
  },
  listDateBox: {
    alignSelf: "center",
    width: "80%",
    maxWidth: 550,
    borderRadius: 10,
    marginTop: verticalScale(10),
    marginBottom: -10,
  },
  listBox: {
    alignSelf: "center",
    width: "80%",
    maxWidth: 550,
    paddingVertical: 10,
    marginVertical: verticalScale(10),
    backgroundColor: color.backgroundComplementary,
    borderRadius: 10,
    gap: 10,
  },
});
