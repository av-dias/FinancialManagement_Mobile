import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  categoryScrollContainer: { backgroundColor: "transparent" },
  categoryContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "transparent", flex: 1 },
  categoryIconContainer: {
    flex:1
  },
  iconLabel: { fontSize: verticalScale(10), color: dark.textPrimary, fontWeight:"bold" },
  labelContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: commonStyles.borderRadius,
    justifyContent: "center",
    height: 20,
  },
});
