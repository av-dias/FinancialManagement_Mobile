import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../functions/responsive";
import { color } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  card: {
    backgroundColor: color.complementary,
    borderRadius: commonStyles.borderRadius,
    elevation: 2,
    justifyContent: "center",
  },
});
