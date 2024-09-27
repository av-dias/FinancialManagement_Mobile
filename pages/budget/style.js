import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
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
  colorIcon: {
    textAlign: "center",
    fontSize: verticalScale(20),
    padding: 5,
    margin: 5,
  },
  containerAverage: {
    height: 70,
    backgroundColor: dark.complementary,
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    gap: 10,
  },
  textTotal: {
    fontWeight: "bold",
    color: dark.textPrimary,
    fontSize: 20,
  },
  scrollviewContainer: {
    flexGrow: 1,
    paddingVertical: 0,
    gap: 10,
  },
  containerItem: {
    flexDirection: "row",
    height: "auto",
    backgroundColor: dark.complementary,
    gap: 5,
    padding: 10,
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
    width: 60,
  },
});
