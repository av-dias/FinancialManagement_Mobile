import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Purchase() {
  const styles = _styles;
  const [onLoadData, setOnLoadData] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const getUser = async () => {
    try {
      const email = await getFromStorage("email");
      return email;
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  const handlePurchase = async () => {
    try {
      let purchases = await getFromStorage("purchases");
      let newPurchase = { type: type, name: name, value: value, dop: date };

      if (purchases) {
        purchases = JSON.parse(purchases);
        purchases.push(newPurchase);
      } else {
        purchases = [newPurchase];
      }

      await saveToStorage("purchases", JSON.stringify(purchases));
      console.log("Purchase: " + purchases);
    } catch (err) {
      console.log("Purchase: " + err);
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
      <View style={styles.title}>
        <Text style={styles.headerText}>Purchase</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.textInputLogin} placeholder="Type" onChangeText={setType} />
        <TextInput style={styles.textInputLogin} placeholder="Name" onChangeText={setName} />
        <TextInput keyboardType="numeric" style={styles.textInputLogin} placeholder="Value" onChangeText={setValue} />
        <Calendar
          onDayPress={(day) => {
            setDate(day.dateString);
          }}
          markedDates={{
            [date]: { selected: true, disableTouchEvent: true, selectedDotColor: "orange" },
          }}
        />
      </View>
      <Pressable style={styles.button} onPress={handlePurchase}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}
