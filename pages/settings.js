import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import { saveToStorage, getFromStorage, addToStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";
import { getUser } from "../functions/basic";

import Header from "../components/header";

export default function Settings({ navigation }) {
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

  const showAlert = () =>
    Alert.alert(
      "Clear All",
      "Are you sure you want to remove all purchases permanently?",
      [
        {
          text: "Yes",
          onPress: async () => {
            let info = await saveToStorage("purchases", "[]", email);
            alert("Cleared");
          },
          style: "yes",
        },
        {
          text: "No",
          onPress: () => {},
          style: "no",
        },
      ],
      {
        cancelable: true,
      }
    );

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.form}>
        <Pressable style={styles.button} onPress={() => alert("Transaction not available yet")}>
          <Text style={styles.buttonText}>Transaction</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            let server = await getFromStorage("server");
            if (server == "on") {
              let access_token = await getFromStorage("access_token");
              let purchases = await getFromStorage("purchases", email);
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
                .then(async (res) => {
                  console.log("Update Status: " + res.status);
                  await addToStorage("archived_purchases", purchases, email);
                  let info = await saveToStorage("purchases", "[]", email);
                  alert("Data uploaded to main server.");
                })
                .catch(function (res) {
                  console.log(res);
                });
            } else {
              alert("Main server not connected.");
              if (true) {
                // For testing purpose only
                let purchases = await getFromStorage("purchases", email);
                await addToStorage("archived_purchases", purchases, email);
                await saveToStorage("purchases", "[]", email);
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            let info = await getFromStorage("purchases", email);
            alert(info);
          }}
        >
          <Text style={styles.buttonText}>Logs</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            showAlert();
          }}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </Pressable>
      </View>
    </View>
  );
}
