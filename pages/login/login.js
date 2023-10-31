import { Text, View, TextInput, Image, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import navLogo from "../../images/logo.png";
import { saveToStorage, getFromStorage } from "../../functions/secureStorage";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { KEYS } from "../../utility/storageKeys";

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
      await saveToStorage(KEYS.EMAIL, email.toLowerCase());
      await saveToStorage(KEYS.PASSWORDS, password);
      await saveToStorage(KEYS.REMEMBER_ME, checked.toString());

      await saveToStorage(KEYS.IP1, ip1);
      await saveToStorage(KEYS.IP2, ip2);
      await saveToStorage(KEYS.IP3, ip3);
      await saveToStorage(KEYS.IP4, ip4);

      let userEmail = email.toLowerCase();

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
          await saveToStorage(KEYS.ACCESS_TOKEN, response.access_token);
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
              saveToStorage(KEYS.USER_ID, resJson.userId.toString());
              saveToStorage(KEYS.SERVER, "on");
              console.log("Connected to the main server");
            })
            .catch(function (res) {
              console.log(res);
              saveToStorage(KEYS.SERVER, "off");
            });
        })
        .catch((res) => {
          console.log("Not connected to the main server");
          saveToStorage(KEYS.SERVER, "off");
        });
    } catch (err) {
      console.log("Error: " + err);
      saveToStorage(KEYS.SERVER, "off");
      alert(err);
    }
  };

  const toggleCheckbox = async () => {
    setChecked(!checked);
  };

  const rememberMeHandle = async () => {
    let remember = await getFromStorage(KEYS.REMEMBER_ME);
    if (remember == "true") {
      console.log("Remember: " + remember);
      console.log("Checked: " + checked);
      setEmail(await getFromStorage(KEYS.EMAIL));
      setPassword(await getFromStorage(KEYS.PASSWORD));
      setChecked(true);
      await saveToStorage(KEYS.SERVER, "off");
      let server = await getFromStorage(KEYS.SERVER);
      console.log("server: " + server);
    }
  };

  const rememberIP = async () => {
    let ip1 = await getFromStorage(KEYS.IP1);
    let ip2 = await getFromStorage(KEYS.IP2);
    let ip3 = await getFromStorage(KEYS.IP3);
    let ip4 = await getFromStorage(KEYS.IP4);

    if (ip1 && ip2 && ip3) {
      setip1(ip1);
      setip2(ip2);
      setip3(ip3);
      setip4(ip4);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      rememberIP();
      rememberMeHandle();
    }, [])
  );

  return (
    <View style={styles.pageLogin}>
      <View style={styles.loginCard}>
        <View style={styles.headerLogin}>
          <Image style={styles.logo} source={navLogo} />
        </View>
        <View style={styles.loginForm}>
          <View style={styles.row}>
            <TextInput
              value={email}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInputLogin}
              placeholder="email"
              onChangeText={(value) => setEmail(value.toLowerCase())}
            />
          </View>
          <View style={styles.row}>
            <TextInput style={styles.textInputLogin} secureTextEntry={true} value={password} placeholder="password" onChangeText={setPassword} />
          </View>
          <View style={styles.row}>
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
          </View>
        </View>
        <View style={styles.submitSection}>
          <View style={styles.checkbox}>
            <CheckBox
              size={15}
              containerStyle={{ backgroundColor: "transparent" }}
              textStyle={{ fontSize: verticalScale(10), color: "white" }}
              checked={checked}
              onPress={toggleCheckbox}
              title="Remember Me"
            />
          </View>
          <Pressable
            style={styles.button}
            onPress={() => {
              handleLogin();
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
