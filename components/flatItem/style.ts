import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  text: { zIndex: 1, fontSize: verticalScale(12), color: dark.textPrimary, textAlign: "right" },
  textBox: { minWidth: 50 },
  row: { flexDirection: "row", borderRadius: commonStyles.borderRadius },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  left: { flex: 1, alignItems: "flex-start", justifyContent: "center" },
  right: { flex: 1, flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "flex-end" },
});
