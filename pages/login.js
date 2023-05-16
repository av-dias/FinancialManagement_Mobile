import { Text, View, TextInput, Image, Pressable } from "react-native";
import { CheckBox } from "@rneui/themed";
import { useState } from "react";

import navLogo from "../images/logo.png";
import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Login({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const handleLogin = async () => {
    try {
      await saveToStorage("email", email.toLowerCase());
      await saveToStorage("password", password);
      await saveToStorage("remember", checked.toString());

      navigation.navigate("Home");
    } catch (err) {
      console.log("Login: " + err);
    }
  };

  const toggleCheckbox = async () => {
    setChecked(!checked);
  };

  const rememberMeHandle = async () => {
    let remember = await getFromStorage("remember");
    if (remember == "true") {
      console.log("Remember: " + remember);
      console.log("Checked: " + checked);
      setEmail(await getFromStorage("email"));
      setPassword(await getFromStorage("password"));
      setChecked(true);
    }
  };

  rememberMeHandle();

  return (
    <View style={styles.pageLogin}>
      <View style={styles.header}>
        <Image style={styles.logo} source={navLogo} />
      </View>
      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputLogin}
            placeholder="email"
            onChangeText={(value) => setEmail(value.toLowerCase())}
          />
          <Text style={styles.textInputLogin}>@gmail.com</Text>
        </View>
        <View style={styles.row}>
          <TextInput style={styles.textInputLogin} secureTextEntry={true} value={password} placeholder="password" onChangeText={setPassword} />
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        <View style={styles.checkbox}>
          <CheckBox size={18} checked={checked} onPress={toggleCheckbox} title="Remember Me" />
        </View>
      </View>
    </View>
  );
}
