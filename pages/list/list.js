import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import { MaterialIcons, FontAwesome, Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "@rneui/themed";

import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { color } from "../../utility/colors";

import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import Header from "../../components/header/header";

import { getFromStorage, saveToStorage } from "../../utility/secureStorage";
import { getUser } from "../../functions/basic";
import { months } from "../../utility/calendar";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { categoryIcons } from "../../assets/icons";
const TABLE_ICON_SIZE = 15;

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [archives, setArchives] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(true);

  const groupByDate = (data) => {
    if (!data || data.length == 0) return {};
    let grouped_data = data
      .map((value, index) => ({ ...value, index: index }))
      .reduce((rv, x) => {
        (rv[x["dop"]] = rv[x["dop"]] || []).push(x);
        return rv;
      }, {});

    return grouped_data;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));
          if (!res) res = [];
          setPurchases(res);
          console.log("Purchase len: " + res.length);

          setGroupedPurchases(groupByDate(res));
        } catch (e) {
          console.log("Purchase: " + e);
        }
        try {
          let resArchive = JSON.parse(await getFromStorage(KEYS.ARCHIVE, email)) || [];
          setArchives(resArchive);
          console.log("Archive: " + resArchive);
          console.log("Archive len: " + resArchive.length);
        } catch (e) {
          console.log("Archive: " + e);
        }
      }
      fetchData();
    }, [refreshTrigger])
  );

  const showAlert = (key) => {
    let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
    let element,
      elementArray,
      setElement,
      title = "",
      description = "",
      leftButton = "Ok",
      rightButton = "Cancel";

    if (identifier == KEYS_SERIALIZER.PURCHASE) {
      element = "purchases";
      elementArray = purchases;
      setElement = setPurchases.bind();
      title = "Delete Purchase";
      description = "Are you sure you want to remove this purchase permanently?" + "\n\n";
      leftButton = "Yes";
      rightButton = "No";
    } else if (identifier == KEYS_SERIALIZER.ARCHIVE) {
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
            if (identifier == KEYS_SERIALIZER.PURCHASE) {
              arr = elementArray.filter((item) => item != elementArray[id]);
              await saveToStorage(element, JSON.stringify(arr), email);
              setElement(arr);
              setRefreshTrigger(!refreshTrigger);
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
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={{ flex: verticalScale(7), backgroundColor: "transparent" }}>
            <ScrollView>
              {Object.keys(groupedPurchases).map((key) =>
                new Date(key).getMonth() == currentMonth && new Date(key).getFullYear() == currentYear ? (
                  <View key={KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + key} style={{ paddingHorizontal: 5 }}>
                    <View style={styles.listDateBox}>
                      <Text style={styles.listDate}>{new Date(key).getDate() + " " + months[new Date(key).getMonth()]}</Text>
                    </View>
                    <CardWrapper key={key} style={styles.listBox}>
                      {groupedPurchases[key].map((innerData) => (
                        <Pressable
                          key={KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
                          style={styles.button}
                          onPress={() => {
                            showAlert(KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index);
                          }}
                        >
                          <View style={styles.rowGap}>
                            <View style={styles.row}>
                              <View
                                style={{
                                  width: verticalScale(25),
                                  backgroundColor: "transparent",
                                  borderRadius: 10,
                                  borderWidth: 1,
                                  padding: verticalScale(2),
                                }}
                              >
                                {categoryIcons(15).find((category) => category.label === innerData.type).icon}
                              </View>
                              <Text style={styles.buttonText}>{innerData.name}</Text>
                            </View>
                            <Text style={styles.buttonText}>{innerData.value + " €"}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </CardWrapper>
                  </View>
                ) : (
                  console.log(key)
                )
              )}
              {archives.length != 0 ? (
                <React.Fragment key={KEYS_SERIALIZER.ARCHIVE + KEYS_SERIALIZER.TOKEN_SEPARATOR + 1}>
                  <Text style={styles.seperatorText}>Archived</Text>
                  <Divider />
                </React.Fragment>
              ) : null}

              {archives.map((cellData, cellIndex) =>
                currentMonth == new Date(cellData.dop).getMonth() && currentYear == new Date(cellData.dop).getFullYear() ? (
                  <CardWrapper key={cellIndex} style={styles.listBox}>
                    <Pressable
                      key={KEYS_SERIALIZER.ARCHIVE + KEYS_SERIALIZER.TOKEN_SEPARATOR + cellIndex}
                      style={styles.button}
                      onPress={() => {
                        showAlert(KEYS_SERIALIZER.ARCHIVE + KEYS_SERIALIZER.TOKEN_SEPARATOR + cellIndex);
                      }}
                    >
                      <View style={styles.rowGap}>
                        <View style={styles.row}>
                          <View
                            style={{
                              width: verticalScale(25),
                              backgroundColor: "transparent",
                              borderRadius: 10,
                              borderWidth: 1,
                              padding: verticalScale(2),
                            }}
                          >
                            {categoryIcons(15).find((category) => category.label === cellData.type).icon}
                          </View>
                          <Text style={styles.buttonText}>{cellData.name}</Text>
                        </View>
                        <Text style={styles.buttonText}>{cellData.value + " €"}</Text>
                      </View>
                    </Pressable>
                  </CardWrapper>
                ) : null
              )}
            </ScrollView>
          </View>
          <View style={styles.calendar}>
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
          </View>
        </View>
      </View>
    </View>
  );
}
