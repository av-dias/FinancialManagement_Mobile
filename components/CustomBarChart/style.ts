import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { dark, ProgressBarColors } from "../../utility/colors";

export const _styles = StyleSheet.create({
  scrollviewContainer: { flexDirection: "row", gap: 10, height: 200 },
  barContainer: { flex: 1, width: 40, gap: 10 },
  barValueContainer: { position: "absolute", width: 40, top: 5, justifyContent: "center", zIndex: 1 },
  barValueText: { textAlign: "center", color: dark.textPrimary, fontSize: 10 },
  barOutterStyle: {
    flex: 1,
  },
  barUnfilledStyle: {
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  barFilledStyle: {
    justifyContent: "flex-end",
    borderRadius: verticalScale(10),
    backgroundColor: ProgressBarColors.blue,
  },
});
