import { StyleSheet } from "react-native";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: commonStyles.borderRadius,
    padding: 2,
    zIndex: 1,
  },
  button: { padding: 5, width: 100, borderRadius: commonStyles.borderRadius },
  text: { color: dark.textPrimary, flex: 1, textAlignVertical: "center", textAlign: "center" },
});
