import { StyleSheet } from "react-native";
import { verticalScale, moderateScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

const borderRadius = commonStyles.borderRadius;

export const _styles = StyleSheet.create({
  textInput: { color: dark.textPrimary, fontSize: verticalScale(14), paddingVertical: moderateScale(6) },
});
