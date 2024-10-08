import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(110);
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: {
    height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  calendar: { justifyContent: "center", alignItems: "center", flex: 1, width: "100%", backgroundColor: "transparent" },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", gap: 20 },
  text: { fontSize: 20, textAlign: "center" },
  chart: {
    justifyContent: "center",
    alignItems: "center",
  },
  tableInfo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: commonStyles.boxPaddingHorizontal,
    backgroundColor: dark.complementary,
    borderRadius: commonStyles.borderRadius,
  },
  textCenter: { textAlign: "center", fontSize: verticalScale(12), gap: 10, color: dark.textPrimary },
  textCenterHead: { textAlign: "center", fontWeight: "bold", fontSize: verticalScale(15) },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderColor: "transparent",
    borderWidth: 0,
  },
  colorIcon: { textAlign: "center", fontSize: verticalScale(15), padding: 0, margin: 0 },
});
