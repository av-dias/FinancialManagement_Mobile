import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 30,
    width: "100%",
    top: commonStyles.statusBarHeight,
    paddingHorizontal: 10,
    backgroundColor: dark.complementarySolid,
    borderRadius: 10,
    justifyContent: "center",
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
