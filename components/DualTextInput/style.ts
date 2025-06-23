import { StyleSheet } from "react-native";
import { verticalScale, moderateScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

const borderRadius = commonStyles.borderRadius;

export const styles = StyleSheet.create({
  textInput: {
    color: dark.textPrimary,
    fontSize: verticalScale(14),
    paddingVertical: moderateScale(6),
  },
  suggestBtn: {
    marginRight: verticalScale(5),
    padding: 5,
    backgroundColor: dark.button,
    borderRadius: commonStyles.borderRadius / 2,
  },
});
