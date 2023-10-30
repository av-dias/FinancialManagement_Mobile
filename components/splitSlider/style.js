import { StyleSheet, Dimensions } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../utility/responsive";
const HEIGHT = Dimensions.get("window").height;

const borderRadius = 10;

export const _styles = StyleSheet.create({
  cardWrapperSlider: {
    flex: 2,
    maxHeight: HEIGHT > heightTreshold ? 150 : 100,
    paddingVertical: verticalScale(10),
    backgroundColor: "white",
    gap: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: borderRadius,
  },
  button: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    width: "100%",
    borderRadius: 10,
    backgroundColor: color.button,
    elevation: 1,
  },
});
