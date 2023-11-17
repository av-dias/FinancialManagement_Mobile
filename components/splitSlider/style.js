import { StyleSheet, Dimensions } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

const borderRadius = commonStyles.borderRadius;

export const _styles = StyleSheet.create({
  cardWrapperSlider: {
    paddingVertical: verticalScale(10),
    backgroundColor: "white",
    gap: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
  },
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: color.button,
    elevation: 1,
  },
});
