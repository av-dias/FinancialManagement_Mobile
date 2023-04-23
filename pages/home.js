import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";
export default function Home() {
  const styles = _styles;
  const [onLoadData, setOnLoadData] = useState("");

  const getUser = async () => {
    try {
      const email = await getFromStorage("email");
      return email;
    } catch (err) {
      console.log("Home: " + err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setOnLoadData(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{onLoadData}</Text>
      </View>
      <View style={styles.form}>
        <Pressable style={styles.button} onPress={() => alert("Purchase")}>
          <Text style={styles.buttonText}>Purchase</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => alert("Income")}>
          <Text style={styles.buttonText}>Income</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => alert("Transaction")}>
          <Text style={styles.buttonText}>Transaction</Text>
        </Pressable>
      </View>
    </View>
  );
}