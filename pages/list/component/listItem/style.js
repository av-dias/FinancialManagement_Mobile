import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale } from "../../../../functions/responsive";
import commonStyles from "../../../../utility/commonStyles";
import { dark } from "../../../../utility/colors";

export const _styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  text: { fontSize: verticalScale(10), textAlign: "center", zIndex: 1, backgroundColor: "transparent", alignSelf: "center", color: dark.textPrimary },
  row: { flexDirection: "row", gap: verticalScale(15), borderRadius: commonStyles.borderRadius, backgroundColor: "transparent" },
  buttonText: {
    fontSize: verticalScale(12),
    color: dark.textPrimary,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
});
