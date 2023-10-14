import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../utility/responsive";
import { color } from "../../utility/colors";

export const _styles = StyleSheet.create({
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: horizontalScale(30),
    maxWidth: 40,
    alignSelf: "center",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  calendarBox: {
    marginTop: 0,
    width: "45%",
    maxWidth: 220,
    maxHeight: 80,
    backgroundColor: "transparent",
    padding: verticalScale(2),
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: color.calendarBorder,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  text: { fontSize: verticalScale(15), textAlign: "center", justifyContent: "center" },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", maxWidth: 250, backgroundColor: "transparent", alignSelf: "center" },
  calendarContainer: { width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row", backgroundColor: "transparent" },
});
