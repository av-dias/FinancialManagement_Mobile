import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";

import { _styles } from "./style";
import { saveToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { UserContext } from "../../store/user-context";
import CardWrapper from "../cardWrapper/cardWrapper";
const title = "Financial Manager";

export default function Header(props) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  let nameLetter: string = "";
  if (email) nameLetter = email[0]?.toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <CardWrapper style={styles.userContainer}>
          <Pressable
            style={styles.centerContainer}
            onPress={() => {
              props.navigation.navigate("Settings");
            }}
          >
            <Text style={styles.text}>{nameLetter}</Text>
          </Pressable>
        </CardWrapper>
        <CardWrapper style={styles.titleContainer}>
          <Pressable
            onPress={() => {
              props.navigation.navigate("Dashboard");
            }}
          >
            <Text style={styles.text}>{title}</Text>
          </Pressable>
        </CardWrapper>
      </View>
      <CardWrapper style={styles.exitContainer}>
        <View style={styles.iconLeft}>
          <MaterialIcons
            testID="logout_icon"
            name="logout"
            size={20}
            color="white"
            onPress={async () => {
              await saveToStorage(KEYS.PASSWORD, "");
              props.navigation.navigate("Login");
            }}
          />
        </View>
      </CardWrapper>
    </View>
  );
}
