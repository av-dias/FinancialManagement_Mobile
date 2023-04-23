import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import { color } from "./colors";

export const _styles = StyleSheet.create({
  pageLogin: {
    flex: 1,
    backgroundColor: color.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  page: {
    flex: 1,
    backgroundColor: color.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  container: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  title: { fontSize: 40, alignContent: "center", textAlign: "center" },
  textInputLogin: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2 },
  text: { fontSize: 20, textAlign: "center" },
  emailText: { fontSize: 20, textAlign: "center" },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  form: { gap: 20, padding: 10, width: "100%", flex: 2 },
  row: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "white", borderRadius: 4 },
  test: { backgroundColor: "black" },
  header: {
    padding: 10,
    flex: 1,
    width: "100%",
    fontSize: 30,
    textAlign: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 30,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    width: "100%",
    borderRadius: 0,
    elevation: 3,
    backgroundColor: "#f4da7ddd",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2296F3",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});
