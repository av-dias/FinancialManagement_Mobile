import React, { useState } from "react";
import { Text, View, Pressable, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Checkbox from "expo-checkbox";
import { saveToStorage, getFromStorage } from "../../functions/secureStorage";
import { _styles } from "./style";
import { verticalScale } from "../../functions/responsive";
import { KEYS } from "../../utility/storageKeys";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import CustomInput from "../../components/customInput/customInput";
import { EvilIcons } from "@expo/vector-icons";
import { dark } from "../../utility/colors";

export default function Login({ navigation }) {
  const styles = _styles;
  const navLogo = require("../../images/logo.png");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const lastLogin = async () => {
    const email = await getFromStorage(KEYS.EMAIL);
    const password = await getFromStorage(KEYS.PASSWORD);
    if (email && email != "" && password && password != "") {
      navigation.navigate("Home");
    }
  };

  lastLogin();

  const handleLogin = async () => {
    try {
      await saveToStorage(KEYS.EMAIL, email.toLowerCase());
      await saveToStorage(KEYS.PASSWORD, password);
      await saveToStorage(KEYS.REMEMBER_ME, checked.toString());
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
      setEmail(await getFromStorage(KEYS.EMAIL));
      setPassword(await getFromStorage(KEYS.PASSWORD));
      setChecked(true);
      await saveToStorage(KEYS.SERVER, "off");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      rememberMeHandle();
    }, [])
  );

  return (
    <View style={styles.pageLogin}>
      <View style={styles.loginCard}>
        <CustomTitle
          icon={
            <View style={{ alignItems: "center", top: 2 }}>
              <Image style={styles.logo} source={navLogo} />
            </View>
          }
          textStyle={{ fontSize: 30, fontWeight: "bold" }}
          title={"Log In"}
        />
        <View style={{ gap: 20 }}>
          <CustomInput
            Icon={
              <AntDesign
                style={{ alignSelf: "center" }}
                name="user"
                size={16}
                color="white"
              />
            }
            placeholder={"email"}
            value={email}
            setValue={(value) => setEmail(value.toLowerCase())}
            textAlign="left"
          />
          <CustomInput
            Icon={
              <EvilIcons
                style={{ alignSelf: "center" }}
                name="lock"
                size={24}
                color="white"
              />
            }
            placeholder={"password"}
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
            textAlign="left"
          />
          <View style={styles.checkbox}>
            <Checkbox
              value={checked}
              onValueChange={toggleCheckbox}
              color="white"
              style={{ backgroundColor: "transparent" }}
            />
            <Text
              style={{
                fontSize: verticalScale(10),
                color: "white",
                marginLeft: 8,
              }}
            >
              Remember Me
            </Text>
          </View>
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
      <View style={{ position: "absolute", bottom: 50 }}>
        <Text style={{ color: dark.textComplementary, textAlign: "center" }}>
          Just insert an email and password.
        </Text>
      </View>
    </View>
  );
}
