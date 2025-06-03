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
  rowGap: {
    flexDirection: "row",
    gap: 10,
  },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderColor: "transparent",
    borderWidth: 0,
  },
  textCenter: { textAlign: "center", fontSize: verticalScale(12), gap: 10, color: dark.textPrimary },
  textTitle: { fontSize: verticalScale(15), color: dark.textPrimary, padding: 10 },
  tableInfo: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: commonStyles.boxPaddingHorizontal,
    borderRadius: commonStyles.borderRadius,
  },
  iconButton: { padding: 11 },
  dividerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, paddingBottom: 0, paddingRight: 0 },
  mainContainer: { flexDirection: "row", gap: 10, padding: 10 },
  wrapperContainer: { padding: 20, flex: 1, justifyContent: "center" },
  titleContainer: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  titleStyle: { fontSize: 14, color: dark.textPrimary },
  AverageTitleStyle: { fontSize: 10, color: dark.textPrimary },
});
