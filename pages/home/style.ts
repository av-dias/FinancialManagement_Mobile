import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { dark } from "../../utility/colors";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  largeScale,
} from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: {
    height:
      Dimensions.get("window").height -
      commonStyles.statusBarHeight -
      commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  calendar: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
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
  rowGap: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 20,
  },
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
  textCenter: {
    textAlign: "center",
    fontSize: verticalScale(12),
    gap: 10,
    color: dark.textPrimary,
  },
  textCenterHead: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: verticalScale(15),
  },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderColor: "transparent",
    borderWidth: 0,
  },
  colorIcon: {
    textAlign: "center",
    fontSize: verticalScale(15),
    padding: 0,
    margin: 0,
  },
  savingsContainer: {
    position: "absolute",
    width: 70,
    aspectRatio: 1,
    borderRadius: 1000,
    borderColor: "lightgreen",
    borderWidth: 4,
    left: verticalScale(40),
    bottom: -30,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  savingsText: {
    textAlign: "center",
    color: "white",
    fontSize: verticalScale(12),
  },
  textSavingsSymbol: {
    alignSelf: "center",
    fontSize: verticalScale(8),
    color: "white",
  },
  mainContainer: {
    flex: verticalScale(4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  expensesText: {
    alignSelf: "center",
    fontSize: verticalScale(35),
    color: "white",
  },
  textSymbol: {
    alignSelf: "center",
    fontSize: verticalScale(20),
    color: "white",
  },
  expensesContainer: {
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "transparent",
  },
  typeCardContainer: {
    flex: 1,
    alignSelf: "flex-end",
    flexDirection: "row",
    maxHeight: 35,
    gap: 10,
    paddingHorizontal: 5,
  },
  noDataContainer: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    bottom: 85,
  },
  splitModalTitle: {
    color: dark.textPrimary,
    fontWeight: "bold",
    fontSize: 24,
    paddingVertical: 10,
  },
  splitModalText: {
    color: dark.textPrimary,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: dark.complementary,
    borderRadius: commonStyles.borderRadius,
  },
});
