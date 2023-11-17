import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  categoryScrollContainer: { backgroundColor: "transparent" },
  categoryContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "transparent", flex: 1 },
  categoryIconContainer: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: "center",
  },
  iconLabel: { fontSize: verticalScale(8) },
  labelContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: commonStyles.borderRadius,
    justifyContent: "center",
    height: 20,
  },
});
