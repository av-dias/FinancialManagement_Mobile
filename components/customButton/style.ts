import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { dark } from "../../utility/colors";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  heightTreshold,
} from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: dark.button,
    elevation: 1,
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent ",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
