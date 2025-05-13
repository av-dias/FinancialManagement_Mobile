import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import { Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  usableScreen: {
    height: Dimensions.get("window").height - commonStyles.statusBarHeight - commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
});
