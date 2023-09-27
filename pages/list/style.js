import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { StatusBar, Dimensions } from "react-native";
const statusBarHeight = StatusBar.currentHeight;
const naviagtionBarHeight = verticalScale(90);

export const _styles = StyleSheet.create({
  usableScreen: { height: Dimensions.get("window").height - statusBarHeight - naviagtionBarHeight, backgroundColor: "transparent" },
  page: {
    backgroundColor: color.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  calendar: { justifyContent: "center", alignItems: "center", flex: 1, width: "100%", backgroundColor: "transparent" },
  buttonList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(32),
    marginHorizontal: horizontalScale(80),
    marginVertical: verticalScale(10),
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#85754e",
  },
  hitBox: {
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: horizontalScale(30),
    alignSelf: "center",
    zIndex: -1,
  },
  text: { fontSize: 20, textAlign: "center", zIndex: 1, backgroundColor: "transparent" },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", borderRadius: 4, gap: 20 },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  seperatorText: {
    fontSize: 15,
    width: "100%",
    color: "black",
    textAlign: "right",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
