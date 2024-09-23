import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";

import { _styles } from "./style";
import { saveToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { AppContext } from "../../store/app-context";
import CardWrapper from "../cardWrapper/cardWrapper";

export default function Header(props) {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  let nameLetter: string = "";
  console.log(appCtx);
  if (appCtx?.email) nameLetter = appCtx?.email[0]?.toUpperCase();

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
        <CardWrapper
          style={{
            borderRadius: 100,
            paddingHorizontal: 10,
          }}
        >
          <Pressable
            onPress={() => {
              props.navigation.navigate("Dashboard");
            }}
          >
            <Text style={styles.text}>{"Financial Manager"}</Text>
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
