import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");

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
      setEmail(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{email}</Text>
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
            let purchases = await getFromStorage("purchases");
            ip1 = await getFromStorage("ip1");
            ip2 = await getFromStorage("ip2");
            ip3 = await getFromStorage("ip3");
            ip4 = await getFromStorage("ip4");
            let userId = await getFromStorage("userId");
            await fetch(`http://${ip1}.${ip2}.${ip3}.${ip4}:8080/api/v1/purchase/mobile/user/${userId}/update/purchases`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
              },
              method: "POST",
              body: purchases,
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
