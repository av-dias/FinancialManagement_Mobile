import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../utility/responsive";
import { color } from "../../utility/colors";

export const _styles = StyleSheet.create({
  card: {
    backgroundColor: color.complementary,
    borderRadius: commonStyles.borderRadius,
    elevation: 2,
    justifyContent: "center",
  },
});
