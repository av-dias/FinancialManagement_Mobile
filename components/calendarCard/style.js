import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../utility/responsive";

export const _styles = StyleSheet.create({
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  calendarBox: {
    marginTop: 0,
    width: 170,
    marginHorizontal: -horizontalScale(5),
    marginBottom: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  text: { fontSize: 20, textAlign: "center" },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", borderRadius: 4, gap: 20 },
  calendarContainer: { maxHeight: "80%", width: "70%", justifyContent: "center", alignItems: "center", flexDirection: "row" },
});
