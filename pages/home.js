import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Home({ navigation }) {
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
        <Pressable style={styles.button} onPress={() => navigation.navigate("Purchase")}>
          <Text style={styles.buttonText}>Purchase</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => alert("Transaction")}>
          <Text style={styles.buttonText}>Transaction</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            let access_token = await getFromStorage("access_token");
            await fetch("http://192.168.0.102:8080/api/v1/purchase/mobile/user/1/update/purchases", {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
              },
              method: "POST",
              body: await getFromStorage("purchases"),
            })
              .then(function (res) {
                console.log(JSON.stringify(res));
              })
              .catch(function (res) {
                console.log(res);
              });
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            let info = await getFromStorage("purchases");
            alert(info);
          }}
        >
          <Text style={styles.buttonText}>Logs</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            let info = await saveToStorage("purchases", "");
            alert("Cleared");
          }}
        >
          <Text style={styles.buttonText}>Clear Logs</Text>
        </Pressable>
      </View>
    </View>
  );
}
