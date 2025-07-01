import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
  button: {
    padding: 10,
    paddingHorizontal: verticalScale(20),
    width: "100%",
    alignSelf: "center",
    borderRadius: commonStyles.borderRadius,
  },
  row: {
    flexDirection: "row",
    gap: verticalScale(10),
    borderRadius: commonStyles.borderRadius,
    backgroundColor: "transparent",
  },
  titleText: {
    fontSize: verticalScale(14),
    color: dark.textPrimary,
    textAlignVertical: "bottom",
  },
  text: {
    fontSize: verticalScale(12),
    textAlign: "center",
    zIndex: 1,
    backgroundColor: "transparent",
    alignSelf: "center",
    color: dark.textPrimary,
  },
  optionsContainer: {
    flex: 3,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderRadius: commonStyles.borderRadius,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    gap: 5,
  },
  optionBox: {
    zIndex: 1000,
    width: verticalScale(40),
    maxWidth: 50,
    height: verticalScale(40),
    maxHeight: 50,
    justifyContent: "center",
    backgroundColor: dark.glass,
    alignContent: "center",
    borderRadius: commonStyles.borderRadius,
  },
  rightContainerSwipe: {
    flex: 1,
    backgroundColor: "transparent",
    height: verticalScale(40),
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 2,
  },
  textSymbol: {
    color: dark.textPrimary,
    fontSize: verticalScale(8),
    textAlignVertical: "bottom",
  },
  badgeContainer: { top: -9, right: -5, zIndex: 1, position: "absolute" },
});
