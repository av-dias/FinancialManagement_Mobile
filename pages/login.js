import { StyleSheet, Text, View, TextInput, Image, Button } from "react-native";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { clearElementValueById } from "../functions/elements";

import navLogo from "../images/logo.png";
import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Login({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await saveToStorage("email", email);
      await saveToStorage("password", password);

      navigation.navigate("Home");
    } catch (err) {
      console.log("Login: " + err);
    }
  };

  return (
    <View style={styles.pageLogin}>
      <View style={styles.header}>
        <Image style={styles.logo} source={navLogo} />
      </View>
      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput style={styles.textInputLogin} placeholder="email" onChangeText={setEmail} />
          <Text style={styles.textInputLogin}>@gmail.com</Text>
        </View>
        <TextInput style={styles.textInputLogin} secureTextEntry={true} placeholder="password" onChangeText={setPassword} />
        <Button style={styles.button} title="Submit" onPress={handleLogin} />
      </View>
    </View>
  );
}
