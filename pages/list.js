import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { _styles } from "../utility/style";
import Header from "../components/header";

import { getPurchaseTotal } from "../functions/purchase";
import { getFromStorage, saveToStorage } from "../utility/secureStorage";
import { getUser } from "../functions/basic";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [archives, setArchives] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

  const PURCHASE_KEY = "PK-";
  const ARCHIVE_KEY = "AK-";
  const TOKEN_SEPARATOR = "-";

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = JSON.parse(await getFromStorage("purchases", email));
          setPurchases(res);
          console.log("Purchase len: " + res.length);
          res = await getPurchaseTotal(email).catch((error) => console.log(error));
          setPurchaseTotal(res);
        } catch (e) {
          console.log("Purchase: " + e);
        }
        try {
          let resArchive = JSON.parse(await getFromStorage("archived_purchases", email)) || [];
          setArchives(resArchive);
          console.log("Archive len: " + resArchive.length);
        } catch (e) {
          console.log("Archive: " + e);
        }
      }
      fetchData();
    }, [purchases.lenght])
  );

  const showAlert = (key) => {
    let [identifier, id] = key.split(TOKEN_SEPARATOR);
    console.log("id: " + identifier);
    let element,
      elementArray,
      setElement,
      title = "",
      description = "",
      leftButton = "Ok",
      rightButton = "Cancel";

    if (identifier == PURCHASE_KEY.split(TOKEN_SEPARATOR)[0]) {
      element = "purchases";
      elementArray = purchases;
      setElement = setPurchases.bind();
      title = "Delete Purchase";
      description = "Are you sure you want to remove this purchase permanently?" + "\n\n";
      leftButton = "Yes";
      rightButton = "No";
    } else if (identifier == ARCHIVE_KEY.split(TOKEN_SEPARATOR)[0]) {
      title = "Archived Purchase Detail";
      element = "archives";
      elementArray = archives;
      setElement = setArchives.bind();
    } else {
      console.log("error: " + identifier);
    }

    Alert.alert(
      title,
      description + `Name: ${elementArray[id].name}\nValue: ${elementArray[id].value}\nType: ${elementArray[id].type}\nDate: ${elementArray[id].dop}`,
      [
        {
          text: leftButton,
          onPress: async () => {
            if (identifier == PURCHASE_KEY.split(TOKEN_SEPARATOR)[0]) {
              arr = elementArray.filter((item) => item != elementArray[id]);
              await saveToStorage(element, JSON.stringify(arr), email);
              setElement(arr);
            }
          },
          style: "yes",
        },
        {
          text: rightButton,
          onPress: () => {},
          style: "no",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ScrollView>
        {purchases.map((cellData, cellIndex) => (
          <Pressable
            key={PURCHASE_KEY + cellIndex}
            style={styles.buttonList}
            onPress={() => {
              setSelected(PURCHASE_KEY + cellIndex);
              console.log(cellIndex);
              showAlert(PURCHASE_KEY + cellIndex);
            }}
          >
            <View style={styles.rowGap}>
              <Text style={styles.buttonText}>{cellData.name}</Text>
              <Text style={styles.buttonText}>{cellData.value}</Text>
            </View>
          </Pressable>
        ))}
        <Text>Archived</Text>
        {archives.map((cellData, cellIndex) => (
          <Pressable
            key={ARCHIVE_KEY + cellIndex}
            style={styles.buttonList}
            onPress={() => {
              setSelected(ARCHIVE_KEY + cellIndex);
              showAlert(ARCHIVE_KEY + cellIndex);
            }}
          >
            <View style={styles.rowGap}>
              <Text style={styles.buttonText}>{cellData.name}</Text>
              <Text style={styles.buttonText}>{cellData.value}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
