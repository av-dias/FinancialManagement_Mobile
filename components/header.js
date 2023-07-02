import { Text, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";

import { _styles } from "../utility/style";
import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { getServerStatus } from "../functions/basic";

export default function Header(props) {
  const styles = _styles;
  const [server, setServer] = useState("");

  useEffect(() => {
    async function fetchData() {
      let server = await getServerStatus();
      setServer(server);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, [server]);

  const serverOn = () => {
    return (
      <View style={styles.icon}>
        <MaterialCommunityIcons name="server" size={18} color="gray" />
      </View>
    );
  };

  const serverOff = () => {
    return (
      <View style={styles.icon}>
        <MaterialCommunityIcons name="server-off" size={18} color="gray" />
      </View>
    );
  };

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerText}>{props.email}</Text>
      </View>
      {server == "on" ? serverOn() : serverOff()}
      <View style={styles.icon}>
        <MaterialIcons
          name="logout"
          size={20}
          color="white"
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        />
      </View>
    </View>
  );
}
