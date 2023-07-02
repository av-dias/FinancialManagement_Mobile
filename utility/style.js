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
    //alignItems: "center",
    //justifyContent: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  title: { padding: 10, fontSize: 40, alignContent: "center", textAlign: "center", width: "100%" },
  textInputLogin: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2 },
  text: { fontSize: 20, textAlign: "center" },
  smallText: { fontSize: 12, textAlign: "center" },
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
  loginForm: { gap: 20, paddingBottom: 100, padding: 10, width: "100%", flex: 3 },
  tableInfo: { gap: 20, padding: 10, width: "100%", flex: 3, paddingTop: 40 },
  form: { gap: 20, padding: 50, width: "100%" },
  tableInfo: { gap: 20, padding: 10, width: "100%", paddingTop: 40 },
  row: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "white", borderRadius: 4 },
  rowGap: { flexDirection: "row", justifyContent: "center", width: "100%", borderRadius: 4, gap: 20 },
  checkbox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  test: { backgroundColor: "black" },
  header: {
    padding: 30,
    width: "100%",
    fontSize: 30,
    flexDirection: "row",
    backgroundColor: "#f4da7ddd",
  },
  headerLogin: {
    flex: 1,
    width: "100%",
    fontSize: 30,
    paddingTop: "50%",
    textAlign: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    width: "100%",
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
  textIP: { fontSize: 20, padding: 5, textAlign: "center", backgroundColor: "white", borderRadius: 2, width: "20%" },
});
