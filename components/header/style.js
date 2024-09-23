import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { StatusBar } from "react-native";
const statusBarHeight = StatusBar.currentHeight;

const headerSize = 35;
const fontSize = 15;

export const _styles = StyleSheet.create({
  iconLeft: { marginLeft: `${verticalScale(25)}%` },
  header: {
    paddingVertical: verticalScale(15),
    paddingHorizontal: verticalScale(20),
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
  userContainer: {
    aspectRatio: 1,
    borderRadius: 100,
    width: verticalScale(headerSize),
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "white", fontSize: verticalScale(fontSize) },
  leftContainer: { flex: 1, flexDirection: "row", gap: horizontalScale(5) },
  exitContainer: { borderRadius: 100, width: verticalScale(headerSize), aspectRatio: 1, justifyContent: "center" },
});
