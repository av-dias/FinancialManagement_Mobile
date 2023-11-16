import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";

const borderRadius = 10;

export const _styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: 10,
    backgroundColor: color.button,
    elevation: 1,
  },
  submitButton: { bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "transparent " },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
