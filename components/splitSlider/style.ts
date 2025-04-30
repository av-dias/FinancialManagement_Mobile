import { StyleSheet, Dimensions } from "react-native";
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

const borderRadius = commonStyles.borderRadius;

export const _styles = StyleSheet.create({
  cardWrapperSlider: {
    paddingVertical: verticalScale(10),
    backgroundColor: "white",
    gap: verticalScale(10),
  },
});
