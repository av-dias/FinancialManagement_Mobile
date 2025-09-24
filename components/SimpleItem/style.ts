import { StyleSheet, Dimensions } from "react-native";
import { dark } from "../../utility/colors";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  heightTreshold,
} from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

const borderRadius = commonStyles.borderRadius;
export const paddingHorizontal = 8;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    padding: verticalScale(10),
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textSmall: {
    color: dark.textPrimary,
    fontSize: commonStyles.smallTextSize,
  },
  textSymbol: {
    color: dark.textPrimary,
    fontSize: commonStyles.symbolSize,
  },
  padding: { paddingHorizontal: paddingHorizontal },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});
