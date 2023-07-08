import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLegend } from "victory-native";

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

  const checkPosition = () => {
    let value = "100000";
    let size = value.length;
    let baseAnchor = 49;
    console.log(size);
    // 10 -> 47.5
    // 1000 -> 45.5
    let leftValue = baseAnchor - size + ".5%";
    return { left: leftValue, bottom: "-50%" };
  };

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View>
        <Text style={checkPosition()}>100000</Text>
        <VictoryPie
          innerRadius={80}
          data={[
            { x: "Supermarket", y: 10 },
            { x: "Home", y: 10 },
            { x: "Restaurant", y: 10 },
            { x: "Transport", y: 10 },
            { x: "Travel", y: 10 },
          ]}
          labelComponent={
            <VictoryLabel
              angle={({ datum }) => {
                console.log(datum.x + " " + (datum.startAngle + 35));
                let angle = datum.startAngle + 35;
                if (angle > 150 && angle < 200) return datum.startAngle + 35 - 180;
                else return datum.startAngle + 35;
              }}
              style={[{ fontSize: 10 }]}
            />
          }
        />
      </View>
    </View>
  );
}
