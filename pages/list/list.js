import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import { MaterialIcons, FontAwesome, Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "@rneui/themed";

import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { color } from "../../utility/colors";

import { _styles } from "./style";
import { KEYS } from "../../utility/keys";
import Header from "../../components/header";

import { getPurchaseTotal } from "../../functions/purchase";
import { getFromStorage, saveToStorage } from "../../utility/secureStorage";
import { getUser } from "../../functions/basic";
import { months } from "../../utility/calendar";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [archives, setArchives] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(true);

  const getCurrentDate = () => {
    return months[currentMonth] + " " + currentYear;
  };

  const previousMonth = () => {
    if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
    else {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth < 11) setCurrentMonth(currentMonth + 1);
    else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

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
          let res = JSON.parse(await getFromStorage("purchases", email));
          if (!res) res = [];
          setPurchases(res);
          console.log("Purchase len: " + res.length);

          setGroupedPurchases(groupByDate(res));
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
    }, [refreshTrigger])
  );

  const showAlert = (key) => {
    let [identifier, id] = key.split(KEYS.TOKEN_SEPARATOR);
    let element,
      elementArray,
      setElement,
      title = "",
      description = "",
      leftButton = "Ok",
      rightButton = "Cancel";

    if (identifier == KEYS.PURCHASE) {
      element = "purchases";
      elementArray = purchases;
      setElement = setPurchases.bind();
      title = "Delete Purchase";
      description = "Are you sure you want to remove this purchase permanently?" + "\n\n";
      leftButton = "Yes";
      rightButton = "No";
    } else if (identifier == KEYS.ARCHIVE) {
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
            if (identifier == KEYS.PURCHASE) {
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
          <View style={{ flex: verticalScale(8), padding: 20, backgroundColor: "transparent" }}>
            <ScrollView>
              {Object.keys(groupedPurchases).map((key) => (
                <React.Fragment key={KEYS.PURCHASE + KEYS.TOKEN_SEPARATOR + key}>
                  <View
                    style={{
                      alignSelf: "center",
                      width: "80%",
                      maxWidth: 600,
                      borderRadius: 10,
                      marginTop: verticalScale(10),
                      marginBottom: -10,
                    }}
                  >
                    <Text>{new Date(key).getDate() + " " + months[new Date(key).getMonth()]}</Text>
                  </View>
                  <View
                    key={key}
                    style={{
                      alignSelf: "center",
                      width: "80%",
                      maxWidth: 600,
                      paddingVertical: 10,
                      marginVertical: verticalScale(10),
                      backgroundColor: color.backgroundComplementary,
                      borderRadius: 10,
                      gap: 10,
                    }}
                  >
                    {groupedPurchases[key].map((innerData) => (
                      <Pressable
                        key={KEYS.PURCHASE + KEYS.TOKEN_SEPARATOR + innerData.index}
                        style={{
                          padding: 10,
                          paddingHorizontal: horizontalScale(20),
                          width: "100%",
                          backgroundColor: "transparent",
                          alignSelf: "center",
                        }}
                        onPress={() => {
                          showAlert(KEYS.PURCHASE + KEYS.TOKEN_SEPARATOR + innerData.index);
                        }}
                      >
                        <View style={styles.rowGap}>
                          <Text style={styles.buttonText}>{innerData.name}</Text>
                          <Text style={styles.buttonText}>{innerData.value}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </React.Fragment>
              ))}
              {archives.length != 0 ? (
                <React.Fragment key={KEYS.ARCHIVE + KEYS.TOKEN_SEPARATOR + 1}>
                  <Text style={styles.seperatorText}>Archived</Text>
                  <Divider />
                </React.Fragment>
              ) : null}

              {archives.map((cellData, cellIndex) =>
                currentMonth == new Date(cellData.dop).getMonth() && currentYear == new Date(cellData.dop).getFullYear() ? (
                  <Pressable
                    key={KEYS.ARCHIVE + KEYS.TOKEN_SEPARATOR + cellIndex}
                    style={styles.buttonList}
                    onPress={() => {
                      setSelected(KEYS.ARCHIVE + KEYS.TOKEN_SEPARATOR + cellIndex);
                      showAlert(KEYS.ARCHIVE + KEYS.TOKEN_SEPARATOR + cellIndex);
                    }}
                  >
                    <View style={styles.rowGap}>
                      <Text style={styles.buttonText}>{cellData.name}</Text>
                      <Text style={styles.buttonText}>{cellData.value}</Text>
                    </View>
                  </Pressable>
                ) : null
              )}
            </ScrollView>
          </View>
          <View style={styles.calendar}>
            <View style={{ maxHeight: "80%", width: "70%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.hitBox}
                onPress={() => {
                  previousMonth();
                }}
              >
                <AntDesign style={styles.iconCenter} name="left" size={15} color="black" />
              </TouchableOpacity>
              <Card borderRadius={10} containerStyle={{ marginTop: 0, width: 170, marginHorizontal: -horizontalScale(5), marginBottom: -5 }}>
                <View style={styles.rowGap}>
                  <View style={{ flex: 1 }}>
                    <Feather name="calendar" size={24} color="black" />
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={styles.text}>{getCurrentDate()}</Text>
                  </View>
                </View>
              </Card>
              <TouchableOpacity
                style={styles.hitBox}
                onPress={() => {
                  nextMonth();
                }}
              >
                <AntDesign style={styles.iconCenter} name="right" size={15} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
