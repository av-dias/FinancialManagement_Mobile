import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

const borderRadius = commonStyles.borderRadius;

export const _styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    paddingHorizontal: 10,
    gap: 10,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center", backgroundColor: "transparent" },
  textInput: {
    flex: 10,
    fontSize: verticalScale(15),
    paddingVertical: moderateScale(6),
    textAlign: "center",
    justifyContent: "center",
    borderRadius: borderRadius,
    width: "87%",
    alignSelf: "center",
    backgroundColor: "transparent",
    color: dark.textPrimary,
  },
});
