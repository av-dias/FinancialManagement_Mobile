import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Divider } from "react-native-paper";

import { horizontalScale, verticalScale, moderateScale } from "../../functions/responsive";

import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import { getSplitUser, getSplitEmail, getSplitFirstName } from "../../functions/split";
import { handleSplit, groupByDate } from "./handler";

import Header from "../../components/header/header";
import { getFromStorage, saveToStorage } from "../../functions/secureStorage";
import { getUser } from "../../functions/basic";
import { months } from "../../utility/calendar";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { categoryIcons, utilIcons } from "../../assets/icons";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [archives, setArchives] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(true);
  const [splitUser, setSplitUser] = useState("");
  const [listDays, setListDays] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        await getSplitUser(setSplitUser, email);
        try {
          let resPurchase = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));
          let resTransaction = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));
          let resArchive = JSON.parse(await getFromStorage(KEYS.ARCHIVE, email));

          if (!resPurchase) resPurchase = [];
          if (!resTransaction) resTransaction = [];
          if (!resArchive) resArchive = [];

          setPurchases(resPurchase);
          setTransactions(resTransaction);
          setArchives(resArchive);

          console.log("Purchase len: " + resPurchase.length);
          console.log("Transaction len: " + resTransaction.length);
          console.log("Archive len: " + resArchive.length);

          setGroupedPurchases(groupByDate(resPurchase));
          setGroupedTransactions(groupByDate(resTransaction));
        } catch (e) {
          console.log("Archive: " + e);
        }
      }
      fetchData();
    }, [refreshTrigger, email])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let list = Object.keys(groupedPurchases).concat(Object.keys(groupedTransactions)).sort();
        setListDays([...new Set(list)]);
      }
      fetchData();
    }, [groupedPurchases, groupedTransactions])
  );

  const showAlert = (key) => {
    let [identifier, id] = key.split(KEYS_SERIALIZER.TOKEN_SEPARATOR);
    let element,
      elementArray,
      setElement,
      title = "",
      description = "",
      body = "",
      leftButton = "Ok",
      rightButton = "Cancel";

    if (identifier == KEYS_SERIALIZER.PURCHASE) {
      element = KEYS.PURCHASE;
      elementArray = purchases;
      setElement = setPurchases.bind();
      title = "Delete Purchase";
      description = "Are you sure you want to remove this purchase permanently?" + "\n\n";
      leftButton = "Yes";
      rightButton = "No";
      body =
        description +
        `Name: ${elementArray[id].name}\nValue: ${elementArray[id].value}\nType: ${elementArray[id].type}\nDate: ${elementArray[id].dop}`;
    } else if (identifier == KEYS_SERIALIZER.TRANSACTION) {
      element = KEYS.TRANSACTION;
      elementArray = transactions;
      setElement = setTransactions.bind();
      title = "Delete Transaction";
      description = "Are you sure you want to remove this transaction permanently?" + "\n\n";
      leftButton = "Yes";
      rightButton = "No";
      body = description + `Description: ${elementArray[id].description}\nAmount: ${elementArray[id].amount}\nDate: ${elementArray[id].dot}`;
    } else if (identifier == KEYS_SERIALIZER.ARCHIVE) {
      title = "Archived Purchase Detail";
      element = KEYS.ARCHIVE;
      elementArray = archives;
      setElement = setArchives.bind();
      vody =
        description +
        `Name: ${elementArray[id].name}\nValue: ${elementArray[id].value}\nType: ${elementArray[id].type}\nDate: ${elementArray[id].dop}`;
    } else {
      console.log("error: " + identifier);
    }

    Alert.alert(
      title,
      body,
      [
        {
          text: leftButton,
          onPress: async () => {
            if (identifier == KEYS_SERIALIZER.PURCHASE || identifier == KEYS_SERIALIZER.TRANSACTION) {
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
              {listDays.map((key) =>
                new Date(key).getMonth() == currentMonth && new Date(key).getFullYear() == currentYear ? (
                  <View key={KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + key} style={{ paddingHorizontal: 5 }}>
                    <View style={styles.listDateBox}>
                      <Text style={styles.listDate}>{new Date(key).getDate() + " " + months[new Date(key).getMonth()]}</Text>
                    </View>
                    <CardWrapper key={key} style={styles.listBox}>
                      {groupedPurchases[key] &&
                        groupedPurchases[key].map((innerData) => (
                          <Pressable
                            key={KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
                            style={styles.button}
                            onPress={() => {
                              showAlert(KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index);
                            }}
                          >
                            <View style={styles.rowGap}>
                              <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
                                <View
                                  style={{
                                    width: verticalScale(40),
                                    maxWidth: 50,
                                    height: verticalScale(40),
                                    maxHeight: 50,
                                    backgroundColor: "transparent",
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  {categoryIcons(20).find((category) => category.label === innerData.type).icon}
                                </View>
                                <View style={{ justifyContent: "center" }}>
                                  <Text style={styles.buttonText}>{innerData.name}</Text>
                                </View>
                              </View>
                              <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
                                <View style={{ justifyContent: "center", flex: 1, backgroundColor: "transparent", alignItems: "flex-end" }}>
                                  <Text style={styles.buttonText}>{innerData.value + " €"}</Text>
                                </View>
                                <View
                                  style={{
                                    flex: 2,
                                    alignContent: "center",
                                    alignItems: "center",
                                    width: verticalScale(40),
                                    maxWidth: 50,
                                    height: verticalScale(40),
                                    maxHeight: 50,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    justifyContent: "center",
                                    backgroundColor: "transparent",
                                  }}
                                >
                                  {innerData.split ? (
                                    <Text style={styles.text}>{innerData.split.weight + "%"}</Text>
                                  ) : (
                                    <Pressable
                                      style={{
                                        width: verticalScale(40),
                                        maxWidth: 50,
                                        height: verticalScale(40),
                                        maxHeight: 50,
                                        justifyContent: "center",
                                        backgroundColor: "transparent",
                                        alignContent: "center",
                                      }}
                                      onPress={async () => {
                                        await handleSplit(
                                          email,
                                          purchases,
                                          setPurchases,
                                          innerData.index,
                                          splitUser,
                                          getSplitEmail(splitUser),
                                          refreshTrigger,
                                          setRefreshTrigger
                                        );
                                      }}
                                    >
                                      {utilIcons(verticalScale(20)).find((type) => type.label === "Split").icon}
                                    </Pressable>
                                  )}
                                </View>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                      {groupedTransactions[key] && groupedTransactions[key]
                        ? groupedTransactions[key].map((innerData) => (
                            <Pressable
                              key={KEYS_SERIALIZER.TRANSACTION + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
                              style={styles.button}
                              onPress={() => {
                                showAlert(KEYS_SERIALIZER.TRANSACTION + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index);
                              }}
                            >
                              <View style={styles.rowGap}>
                                <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
                                  <View
                                    style={{
                                      width: verticalScale(40),
                                      maxWidth: 50,
                                      height: verticalScale(40),
                                      maxHeight: 50,
                                      backgroundColor: "transparent",
                                      borderRadius: 10,
                                      borderWidth: 1,
                                      justifyContent: "center",
                                    }}
                                  >
                                    {utilIcons().find((type) => type.label === "Transaction").icon}
                                  </View>
                                  <View style={{ justifyContent: "center" }}>
                                    <Text style={styles.buttonText}>{innerData.description}</Text>
                                  </View>
                                </View>
                                <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
                                  <View style={{ justifyContent: "center", flex: 1, backgroundColor: "transparent", alignItems: "flex-end" }}>
                                    <Text style={styles.buttonText}>{innerData.amount + " €"}</Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 2,
                                      alignContent: "center",
                                      alignItems: "center",
                                      width: verticalScale(40),
                                      maxWidth: 50,
                                      height: verticalScale(40),
                                      maxHeight: 50,
                                      borderRadius: 20,
                                      borderWidth: 0,
                                      justifyContent: "center",
                                      backgroundColor: "transparent",
                                    }}
                                  ></View>
                                </View>
                              </View>
                            </Pressable>
                          ))
                        : null}
                    </CardWrapper>
                  </View>
                ) : null
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
                        <View style={{ ...styles.row, flex: 2, backgroundColor: "transparent" }}>
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
                        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
                          <Text style={styles.buttonText}>{cellData.value + " €"}</Text>
                        </View>
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
