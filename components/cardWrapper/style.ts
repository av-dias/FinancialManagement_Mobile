import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  card: {
    backgroundColor: dark.complementary,
    borderRadius: commonStyles.borderRadius,
    justifyContent: "center",
  },
});
