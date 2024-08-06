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
  text: { fontSize: 15, textAlign: "center", color: dark.textPrimary },
  chart: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: { flex: 1, justifyContent: "center", alignItems: "center", elevation: 0, backgroundColor: dark.complementary },
  tableInfo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: commonStyles.boxPaddingHorizontal,
    backgroundColor: "transparent",
  },
  textCenter: { textAlign: "center", fontSize: verticalScale(12), gap: 10 },
  textCenterHead: { textAlign: "center", fontWeight: "bold", fontSize: verticalScale(15) },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderColor: dark.complementary,
    borderWidth: verticalScale(1),
  },
  colorIcon: { textAlign: "center", fontSize: verticalScale(20), padding: 5, margin: 5 },
});
