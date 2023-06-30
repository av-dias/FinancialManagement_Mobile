import { Text, View, TextInput, Image, Pressable } from "react-native";
import { CheckBox } from "@rneui/themed";
import { useState, useEffect } from "react";

import navLogo from "../images/logo.png";
import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Login({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [ip1, setip1] = useState("");
  const [ip2, setip2] = useState("");
  const [ip3, setip3] = useState("");
  const [ip4, setip4] = useState("");

  const handleLogin = async () => {
    try {
      await saveToStorage("email", email.toLowerCase());
      await saveToStorage("password", password);
      await saveToStorage("remember", checked.toString());

      await saveToStorage("ip1", ip1);
      await saveToStorage("ip2", ip2);
      await saveToStorage("ip3", ip3);
      await saveToStorage("ip4", ip4);

      let userEmail = email.toLowerCase() + "@gmail.com";

      const controller = new AbortController();
      // 5 second timeout:
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${ip1}.${ip2}.${ip3}.${ip4}:8080/api/v1/login?username=${userEmail}&password=${password}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      })
        .then(async (res) => {
          let response = await res.json();
          await saveToStorage("access_token", response.access_token);
          await fetch(`http://${ip1}.${ip2}.${ip3}.${ip4}:8080/api/v1/user/email/${userEmail}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + response.access_token,
            },
            method: "GET",
          })
            .then(async (res) => {
              let resJson = await res.json();
              saveToStorage("userId", resJson.userId.toString());
            })
            .catch(function (res) {
              console.log(res);
            });
        })
        .catch((res) => {
          console.log("Not connected to the main server");
        });

      navigation.navigate("Home");
    } catch (err) {
      console.log("Login: " + err);
      alert(err);
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

  const rememberIP = async () => {
    let ip1 = await getFromStorage("ip1");
    let ip2 = await getFromStorage("ip2");
    let ip3 = await getFromStorage("ip3");
    let ip4 = await getFromStorage("ip4");

    if (ip1 && ip2 && ip3) {
      setip1(ip1);
      setip2(ip2);
      setip3(ip3);
      setip4(ip4);
    }
  };

  useEffect(() => {
    rememberIP();
    rememberMeHandle();
  }, []);

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
        <View style={styles.rowGap}>
          <TextInput
            value={ip1}
            autoCapitalize="none"
            keyboardType="numeric"
            autoCorrect={false}
            style={styles.textIP}
            placeholder="xxx"
            maxLength={3}
            onChangeText={(value) => setip1(value.toLowerCase())}
          />
          <TextInput
            value={ip2}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textIP}
            placeholder="xxx"
            maxLength={3}
            onChangeText={(value) => setip2(value.toLowerCase())}
          />
          <TextInput
            value={ip3}
            autoCapitalize="none"
            keyboardType="numeric"
            autoCorrect={false}
            style={styles.textIP}
            placeholder="xxx"
            maxLength={3}
            onChangeText={(value) => setip3(value.toLowerCase())}
          />
          <TextInput
            value={ip4}
            autoCapitalize="none"
            keyboardType="numeric"
            autoCorrect={false}
            style={styles.textIP}
            placeholder="xxx"
            maxLength={3}
            onChangeText={(value) => setip4(value.toLowerCase())}
          />
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
