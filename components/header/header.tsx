import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";

import { _styles } from "./style";
import { saveToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { UserContext } from "../../store/user-context";
import CardWrapper from "../cardWrapper/cardWrapper";
import Feather from "@expo/vector-icons/Feather";
import { dark } from "../../utility/colors";
import { useFocusEffect } from "@react-navigation/native";
import { eventEmitter, PrivacyEvent } from "../../utility/eventEmitter";

const title = "Financial Manager";

const PrivacyIcon = ({ privacy }) =>
  privacy ? (
    <Feather
      name="eye-off"
      size={18}
      color={dark.textPrimary}
      style={{ alignItems: "center" }}
    />
  ) : (
    <Feather
      name="eye"
      size={18}
      color={dark.textPrimary}
      style={{ justifyContent: "center" }}
    />
  );

export default function Header(props) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const { privacyShield, setPrivacyShield } =
    useContext(UserContext).privacyShield;
  let nameLetter: string = "";

  if (email) nameLetter = email[0]?.toUpperCase();

  useFocusEffect(
    React.useCallback(() => {
      async function emitEvent() {
        eventEmitter.emit(PrivacyEvent, privacyShield);
      }
      emitEvent();
    }, [privacyShield])
  );

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
        <Pressable
          style={{
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: 1,
          }}
          onPress={() => setPrivacyShield((p) => !p)}
        >
          <PrivacyIcon privacy={privacyShield} />
        </Pressable>
      </CardWrapper>
    </View>
  );
}
