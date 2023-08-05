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

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = JSON.parse(await getFromStorage("purchases", email));
          setPurchases(res);
          console.log(res.length);
          res = await getPurchaseTotal(email).catch((error) => console.log(error));
          setPurchaseTotal(res);
        } catch (e) {
          console.log("Purchase: " + e);
        }
        try {
          let resArchive = JSON.parse(await getFromStorage("archived_purchases", email)) || [];
          setArchives(resArchive);
          console.log(resArchive.length);
        } catch (e) {
          console.log("Archive: " + e);
        }
      }
      fetchData();
    }, [purchases.lenght])
  );

  const showAlert = (id) =>
    Alert.alert(
      "Delete Purchase",
      "Are you sure you want to remove this purchase permanently?" +
        "\n\n" +
        `Name: ${purchases[id].name}\nValue: ${purchases[id].value}\nType: ${purchases[id].type}\nDate: ${purchases[id].dop}`,
      [
        {
          text: "Yes",
          onPress: async () => {
            arr = purchases.filter((item) => item != purchases[id]);
            await saveToStorage("purchases", JSON.stringify(arr), email);
            setPurchases(arr);
          },
          style: "yes",
        },
        {
          text: "No",
          onPress: () => {},
          style: "no",
        },
      ],
      {
        cancelable: true,
      }
    );

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ScrollView>
        {purchases.map((cellData, cellIndex) => (
          <Pressable
            key={cellIndex}
            style={styles.buttonList}
            onPress={() => {
              setSelected(cellIndex);
              console.log(cellIndex);
              showAlert(cellIndex);
            }}
          >
            <View style={styles.rowGap}>
              <Text style={styles.buttonText}>{cellData.name}</Text>
              <Text style={styles.buttonText}>{cellData.value}</Text>
            </View>
          </Pressable>
        ))}
        <Text>Archived</Text>
      </ScrollView>
    </View>
  );
}
