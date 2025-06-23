import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 30,
    width: "99%",
    top: commonStyles.statusBarHeight + 5,
    paddingHorizontal: 10,
    alignSelf: "center",
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
