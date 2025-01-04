import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
import { Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: {
    height: Dimensions.get("window").height - commonStyles.statusBarHeight - commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  calendarBox: { width: 50, padding: 10, borderRadius: 10, justifyContent: "center", alignContent: "center" },
  calendarMonthContainer: { width: 50, borderRadius: 5, height: 16 },
  primaryText: { color: dark.textPrimary, textAlign: "center", fontSize: 12 },
  primaryTextDates: { color: dark.textPrimary, textAlign: "center", fontWeight: "bold" },
});
