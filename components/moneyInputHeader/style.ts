import { StyleSheet } from "react-native";
import { horizontalScale } from "../../functions/responsive";

const borderRadius = 10;

export const _styles = StyleSheet.create({
  rowNoBorder: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
    backgroundColor: "transparent",
  },
  symbolBig: { fontSize: horizontalScale(25), textAlign: "center", width: "auto", alignSelf: "center", color: "white" },
  valueInput: {
    fontSize: horizontalScale(60),
    textAlign: "center",
    backgroundColor: "transparent",
    width: "auto",
    alignSelf: "center",
    color: "white",
  },
});
