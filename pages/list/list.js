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
import ListItem from "../../components/listItem/listItem";
import showAlert from "./showAlert";

import { categoryIcons, utilIcons } from "../../assets/icons";

export default function List({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [archives, setArchives] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [groupedArchivedPurchases, setGroupedArchivedPurchases] = useState([]);
  const [groupedArchivedTransactions, setGroupedArchivedTransactions] = useState([]);
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
          let resArchive = JSON.parse(await getFromStorage(KEYS.ARCHIVE_PURCHASE, email));

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
          setGroupedArchivedPurchases(groupByDate(resArchive));
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
        let list = Object.keys(groupedPurchases).concat(Object.keys(groupedTransactions)).concat(Object.keys(groupedArchivedPurchases)).sort();
        setListDays([...new Set(list)]);
      }
      fetchData();
    }, [groupedPurchases, groupedTransactions, groupedArchivedPurchases])
  );

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={{ flex: verticalScale(7), backgroundColor: "transparent" }}>
            <ScrollView>
              {listDays.map(
                (date) =>
                  new Date(date).getMonth() == currentMonth &&
                  new Date(date).getFullYear() == currentYear && (
                    <View key={KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date} style={{ paddingHorizontal: 5 }}>
                      <View style={styles.listDateBox}>
                        <Text style={styles.listDate}>{new Date(date).getDate() + " " + months[new Date(date).getMonth()]}</Text>
                      </View>
                      <CardWrapper key={date} style={styles.listBox}>
                        {groupedPurchases[date] &&
                          groupedPurchases[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              keys={KEYS_SERIALIZER.PURCHASE}
                              showAlert={() => {
                                showAlert(
                                  KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index,
                                  purchases,
                                  setPurchases,
                                  KEYS.PURCHASE,
                                  email,
                                  setRefreshTrigger,
                                  refreshTrigger
                                );
                              }}
                            />
                          ))}
                        {groupedTransactions[date] &&
                          groupedTransactions[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              keys={KEYS_SERIALIZER.TRANSACTION}
                              showAlert={() => {
                                showAlert(
                                  KEYS_SERIALIZER.TRANSACTION + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index,
                                  transactions,
                                  setTransactions,
                                  KEYS.TRANSACTION,
                                  email,
                                  setRefreshTrigger,
                                  refreshTrigger
                                );
                              }}
                            />
                          ))}
                        {groupedArchivedPurchases[date] &&
                          groupedArchivedPurchases[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              keys={KEYS_SERIALIZER.ARCHIVE}
                              gray={true}
                              showAlert={() => {
                                showAlert(
                                  KEYS_SERIALIZER.ARCHIVE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index,
                                  archives,
                                  setArchives,
                                  KEYS.ARCHIVE_PURCHASE,
                                  email,
                                  setRefreshTrigger,
                                  refreshTrigger
                                );
                              }}
                            />
                          ))}
                      </CardWrapper>
                    </View>
                  )
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
