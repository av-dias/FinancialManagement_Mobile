import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "../../utility/colors";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
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
  buttonList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 80,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#85754e",
  },
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
  buttonList: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 80,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#85754e",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
