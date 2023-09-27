import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight },
  calendar: { justifyContent: "center", alignItems: "center", flex: 1, width: "100%" },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center" },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", borderRadius: 4, gap: 20 },
  text: { fontSize: 20, textAlign: "center" },
  chart: { flex: 5, justifyContent: "center", alignItems: "center", backgroundColor: "transparent", margin: largeScale(5) },
  tableInfo: { gap: 30, paddingLeft: 30, paddingRight: 30, width: "100%", height: "100%", backgroundColor: "transparent" },
  textCenter: { textAlign: "center", fontSize: verticalScale(15), padding: 5, margin: 5 },
  textCenterHead: { textAlign: "center", fontWeight: "bold", fontSize: verticalScale(15) },
  rowTable: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRadius: 1,
    borderColor: "rgba(255,255,255, 1)",
    borderWidth: verticalScale(1),
  },
  colorIcon: { textAlign: "center", fontSize: verticalScale(20), padding: 5, margin: 5 },
});
