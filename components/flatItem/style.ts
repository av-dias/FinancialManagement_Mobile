import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const styles = StyleSheet.create({
  text: {
    zIndex: 1,
    fontSize: verticalScale(12),
    color: dark.textPrimary,
    textAlign: "right",
  },
  textSymbol: {
    zIndex: 1,
    fontSize: verticalScale(8),
    color: dark.textPrimary,
    textAlign: "right",
  },
  textBox: { minWidth: 50 },
  row: { flexDirection: "row", borderRadius: commonStyles.borderRadius },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  left: { flex: 1, alignItems: "flex-start", justifyContent: "center" },
  right: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "flex-end",
  },
  optionBox: {
    backgroundColor: dark.glass,
    borderRadius: commonStyles.borderRadius,
    width: verticalScale(30),
    maxWidth: 50,
    height: verticalScale(30),
    maxHeight: 50,
    justifyContent: "center",
    alignContent: "center",
  },
});
