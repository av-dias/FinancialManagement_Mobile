import { StyleSheet } from "react-native";
import { dark } from "./utility/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4e4fc",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    backgroundColor: dark.complementary,
    height: 50,
    aspectRatio: 1,
    borderRadius: 100,
    marginBottom: 10,
  },
  mainIcon: { left: 2, bottom: 1 },
  tab: {
    height: 45,
    paddingHorizontal: 5,
    paddingTop: 0,
    backgroundColor: "#12102E",
    position: "absolute",
    borderTopWidth: 0,
  },
});
