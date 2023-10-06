import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../utility/responsive";
import { color } from "../../utility/colors";

export const _styles = StyleSheet.create({
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
    backgroundColor: "transparent",
  },
  calendarBox: {
    marginTop: 0,
    width: "35%",
    maxWidth: 140,
    marginHorizontal: -horizontalScale(8),
    backgroundColor: color.glass,
    padding: verticalScale(5),
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  text: { fontSize: 20, textAlign: "center", justifyContent: "center" },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%" },
  calendarContainer: { width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: "transparent" },
});
