import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale, moderateScale } from "../../../../functions/responsive";
import commonStyles from "../../../../utility/commonStyles";
import { dark } from "../../../../utility/colors";

export const _styles = StyleSheet.create({
  button: {
    padding: 10,
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  text: {
    fontSize: verticalScale(10),
    textAlign: "center",
    zIndex: 1,
    backgroundColor: "transparent",
    alignSelf: "center",
    color: dark.textPrimary,
  },
  row: {
    flexDirection: "row",
    gap: verticalScale(15),
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: verticalScale(12),
    color: dark.textPrimary,
  },
  amountText: {
    fontSize: verticalScale(12),
    color: "lightgreen",
    textAlign: "center",
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  optionsContainer: {
    flex: 3,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    width: verticalScale(40),
    maxWidth: 130,
    height: verticalScale(40),
    maxHeight: 50,
    borderRadius: commonStyles.borderRadius,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  editContainer: {
    width: verticalScale(40),
    maxWidth: 50,
    height: verticalScale(40),
    maxHeight: 50,
    justifyContent: "center",
    backgroundColor: "transparent",
    alignContent: "center",
  },
});
