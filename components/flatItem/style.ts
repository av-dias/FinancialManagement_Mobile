import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  text: { zIndex: 1, fontSize: verticalScale(12), backgroundColor: "transparent", color: dark.textPrimary },
  row: { flexDirection: "row", borderRadius: commonStyles.borderRadius },
  center: { flex: 1, alignItems: "center" },
  left: { flex: 1, alignItems: "flex-start" },
  right: { flex: 1, alignItems: "flex-end" },
});
