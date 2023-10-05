import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../utility/responsive";
import { StatusBar } from "react-native";
const statusBarHeight = StatusBar.currentHeight;

export const _styles = StyleSheet.create({
  iconLeft: { justifyContent: "center", marginLeft: 0, marginRight: 0 },
  header: {
    fontSize: 30,
    padding: verticalScale(15),
    gap: 10,
    marginTop: statusBarHeight,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "black",
  },
  icon: { justifyContent: "center" },
  headerText: {
    fontSize: 20,
    width: "100%",
    color: "white",
  },
});
