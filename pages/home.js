import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";
import { getUser } from "../functions/basic";

import Header from "../components/header";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
    </View>
  );
}
