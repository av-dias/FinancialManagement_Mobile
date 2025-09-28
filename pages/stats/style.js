import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale } from "../../functions/responsive";
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
  text: { fontSize: 15, color: dark.textPrimary },
  textTitle: { fontSize: 15, fontWeight: "bold", color: dark.textPrimary },
  textSecundary: { fontSize: 13, color: dark.textSecundary },
  textSymbol: { fontSize: commonStyles.symbolSize, color: dark.textSecundary },
  chart: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    height: "auto",
    elevation: 0,
    backgroundColor: dark.glass,
    padding: 20,
    paddingBottom: 10,
  },
  tableInfo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: commonStyles.boxPaddingHorizontal,
    backgroundColor: "transparent",
  },
  textCenter: { textAlign: "center", fontSize: verticalScale(12), gap: 10 },
  textCenterHead: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: verticalScale(15),
  },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderColor: dark.complementary,
    borderWidth: verticalScale(1),
  },
  colorIcon: {
    textAlign: "center",
    fontSize: verticalScale(20),
    padding: 5,
    margin: 5,
  },
  chartHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    width: "100%",
    padding: 10,
    alignSelf: "center",
  },
  containerJustifyCenter: { justifyContent: "center" },
  containerRowGap: { flexDirection: "row", gap: 10 },
  splitModalTitle: { color: dark.textPrimary, fontWeight: "bold", fontSize: 24, paddingVertical: 10 },
  splitModalText: { color: dark.textPrimary, fontSize: 14, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: dark.complementary, borderRadius: commonStyles.borderRadius },
});
