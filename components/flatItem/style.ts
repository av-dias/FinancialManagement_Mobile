import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  text: { zIndex: 1, fontSize: verticalScale(12), textAlign: "center", backgroundColor: "transparent", alignSelf: "center", color: dark.textPrimary },
  row: { flexDirection: "row", justifyContent: "space-between", borderRadius: commonStyles.borderRadius },
});
