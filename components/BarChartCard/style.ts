import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { dark, ProgressBarColors } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    top: 10,
    width: "100%",
    padding: 10,
    alignSelf: "center",
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: dark.textPrimary,
  },
  secundaryTextStyle: {
    fontSize: 13,
    color: dark.textPrimary,
  },
  symbolStyle: {
    fontSize: commonStyles.symbolSize,
    color: dark.textPrimary,
  },
  chartContainer: {
    paddingTop: verticalScale(60),
    paddingHorizontal: 10,
    paddingRight: verticalScale(20),
    flexDirection: "row",
  },
});
