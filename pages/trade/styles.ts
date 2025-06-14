import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
import { Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const styles = StyleSheet.create({
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
  titleStyle: { padding: 0, fontSize: 18, fontWeight: "bold" },
  mainTitleStyle: {
    padding: 0,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  tradeButton: {
    borderRadius: 10,
    padding: 10,
    margin: 0,
    alignItems: "center",
    backgroundColor: dark.button,
  },
  tradeButtonPressed: {
    borderRadius: 10,
    padding: 10,
    margin: 1,
    alignItems: "center",
    backgroundColor: "orange",
  },
  submitTextStyle: { color: "white", fontSize: 18 },
  normalText: {
    zIndex: 1,
    fontSize: 12,
    color: dark.textPrimary,
    textAlign: "center",
  },
  smallText: {
    zIndex: 1,
    fontSize: 10,
    color: dark.textComplementary,
    textAlign: "center",
  },
  symbolText: {
    zIndex: 1,
    fontSize: 8,
    color: dark.textComplementary,
    textAlign: "center",
  },
  securityIconContainer: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    width: 50,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingBottom: 5,
    gap: 4,
  },
  headerOptions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  optionBtnStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: dark.textPrimary,
  },
});
