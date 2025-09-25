import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
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
    height: Dimensions.get("window").height - commonStyles.statusBarHeight - commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  colorIcon: {
    textAlign: "center",
    fontSize: verticalScale(20),
    padding: 5,
    margin: 5,
  },
  containerAverage: {
    height: verticalScale(60),
    backgroundColor: dark.complementary,
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: "center",
    gap: 5,
  },
  textValue: {
    fontWeight: "bold",
    color: dark.textPrimary,
    fontSize: 18,
  },
  textTotal: {
    color: dark.textPrimary,
  },
  scrollviewContainer: {
    flexGrow: 1,
    paddingVertical: 0,
    gap: 10,
  },
  containerItem: {
    flexDirection: "row",
    height: "auto",
    gap: 5,
    padding: 20,
    borderRadius: 5,
  },
  containerIcon: {
    width: verticalScale(50),
    maxWidth: 50,
    height: verticalScale(50),
    maxHeight: 50,
    borderRadius: commonStyles.borderRadius,
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  textItem: {
    fontSize: 10,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    color: dark.textPrimary,
  },
  textTitle: {
    color: dark.textPrimary,
    fontSize: 18,
  },
  containerNoData: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  progressStyle: { height: verticalScale(8), borderRadius: 10 },
  progressDataContainer: {
    flex: 1,
    gap: 10,
    padding: 5,
    backgroundColor: "transparent",
  },
  itemContainer: {
    justifyContent: "flex-end",
    width: 45,
  },
  averageTextTitle: { flexDirection: "row", justifyContent: "space-between" },
  averageTextValue: { flexDirection: "row", alignItems: "baseline" },
});
