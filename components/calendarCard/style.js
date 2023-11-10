import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { color } from "../../utility/colors";

export const _styles = StyleSheet.create({
  hitBox: {
    justifyContent: "center",
    height: "100%",
    width: horizontalScale(30),
    maxWidth: 40,
    alignSelf: "center",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  calendarBox: {
    width: verticalScale(100),
    height: "100%",
    maxWidth: 175,
    maxHeight: 80,
    backgroundColor: color.complementary,
    padding: verticalScale(0),
    justifyContent: "center",
    borderRadius: 10,
    elevation: 2,
  },
  iconCenterLeft: { display: "flex", justifyContent: "center", alignSelf: "flex-end" },
  iconCenterRight: { display: "flex", justifyContent: "center", alignSelf: "flex-start" },
  text: { fontSize: verticalScale(15), textAlign: "center", justifyContent: "center" },
  rowGap: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 250,
    backgroundColor: "transparent",
    alignSelf: "center",
    gap: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    alignSelf: "center",
    gap: 10,
  },
  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
});
