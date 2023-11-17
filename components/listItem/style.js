import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  text: { fontSize: verticalScale(10), textAlign: "center", zIndex: 1, backgroundColor: "transparent", alignSelf: "center" },

  row: { flexDirection: "row", gap: verticalScale(15), borderRadius: commonStyles.borderRadius, backgroundColor: "transparent" },
  buttonText: {
    fontSize: verticalScale(12),
    color: "black",
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
});
