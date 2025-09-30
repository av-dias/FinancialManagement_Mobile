import { StyleSheet } from "react-native";
import { dark } from "../../utility/colors";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from "../../functions/responsive";
import { StatusBar, Dimensions } from "react-native";
import commonStyles from "../../utility/commonStyles";

export const _styles = StyleSheet.create({
  usableScreen: {
    height:
      Dimensions.get("window").height -
      commonStyles.statusBarHeight -
      commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  text: { color: dark.textSecundary },
  rowGap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: verticalScale(12),
    color: "black",
  },
  button: {
    padding: 10,
    paddingHorizontal: horizontalScale(20),
    width: "100%",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  iconCenter: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  form: {
    flex: 1,
    gap: verticalScale(15),
    //paddingVertical: verticalScale(10),
    paddingTop: verticalScale(0),
  },
});
