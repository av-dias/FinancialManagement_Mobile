import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  usableScreen: {
    height: Dimensions.get("window").height - commonStyles.statusBarHeight - commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  calendar: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "98%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  text: {
    fontSize: verticalScale(12),
    backgroundColor: "transparent",
    color: dark.textPrimary,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
  },
  row: { flexDirection: "row", gap: verticalScale(15), backgroundColor: "transparent" },
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
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: "grey",
    width: "100%",
    textAlign: "right",
    paddingTop: 20,
  },
  listDate: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: "grey",
  },
  listDateBox: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 750,
    borderRadius: commonStyles.borderRadius,
    marginTop: verticalScale(10),
    marginBottom: -10,
  },
  listBox: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 750,
    marginVertical: verticalScale(15),
    borderRadius: commonStyles.borderRadius,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  form: {
    flex: 7,
    gap: verticalScale(15),
    //paddingVertical: verticalScale(10),
    paddingTop: verticalScale(20),
  },
  optionBox: {
    width: verticalScale(40),
    maxWidth: 50,
    height: verticalScale(40),
    maxHeight: 50,
    justifyContent: "center",
    backgroundColor: dark.glass,
    alignContent: "center",
    borderRadius: commonStyles.borderRadius,
  },
});
