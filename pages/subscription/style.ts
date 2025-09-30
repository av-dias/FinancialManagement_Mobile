import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  usableScreen: {
    height:
      Dimensions.get("window").height -
      commonStyles.statusBarHeight -
      commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  textInput: {
    backgroundColor: dark.glass,
    borderRadius: commonStyles.borderRadius,
    paddingLeft: 20,
    color: dark.textPrimary,
  },
  textTitle: { fontWeight: "bold", color: dark.textPrimary },
  mainContainer: { flex: 1, padding: commonStyles.paddingHorizontal, gap: 20 },
  formContainer: { flex: 1, gap: 20 },
  inputContainer: { gap: 15 },
  text: {
    color: dark.textPrimary,
    backgroundColor: dark.complementary,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "lightblue",
    borderRadius: 7,
    padding: 3,
    width: 50,
    alignItems: "center",
  },
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  centered: { justifyContent: "center", alignItems: "center" },
});
