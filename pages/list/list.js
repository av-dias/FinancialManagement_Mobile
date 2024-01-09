import React, { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { verticalScale } from "../../functions/responsive";

import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { handleSplit, handleEditPurchase, groupByDate, handleEditTransaction } from "./handler";

import Header from "../../components/header/header";
import { getFromStorage } from "../../functions/secureStorage";
import { getUser } from "../../functions/basic";
import { months } from "../../utility/calendar";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ListItem from "../../components/listItem/listItem";
import showAlert from "./showAlert";
import ModalCustom from "../../components/modal/modal";
import { ModalList } from "../../utility/modalContent";

export default function List({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [groupedArchivedPurchases, setGroupedArchivedPurchases] = useState([]);
  const [groupedArchivedTransactions, setGroupedArchivedTransactions] = useState([]);

  const [selectedItem, setSelectedItem] = useState({ date: new Date().toISOString().split("T")[0] });
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);

  const [listDays, setListDays] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState();
  const [editVisible, setEditVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        await getSplitUser(setSplitUser, email);
        try {
          if (!refreshTrigger || refreshTrigger == KEYS_SERIALIZER.PURCHASE) {
            let resPurchase = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));
            if (!resPurchase) resPurchase = [];
            setGroupedPurchases(groupByDate(resPurchase));
            console.log("Purchase len: " + resPurchase.length);
          }
          if (!refreshTrigger || refreshTrigger == KEYS_SERIALIZER.TRANSACTION) {
            let resTransaction = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));
            if (!resTransaction) resTransaction = [];
            setGroupedTransactions(groupByDate(resTransaction));
            console.log("Transaction len: " + resTransaction.length);
          }
          if (!refreshTrigger || refreshTrigger == KEYS_SERIALIZER.ARCHIVE_PURCHASE) {
            let resArchivePurchase = JSON.parse(await getFromStorage(KEYS.ARCHIVE_PURCHASE, email));
            if (!resArchivePurchase) resArchivePurchase = [];
            setGroupedArchivedPurchases(groupByDate(resArchivePurchase));
            console.log("Archive Purchase  len: " + resArchivePurchase.length);
          }
          if (!refreshTrigger || refreshTrigger == KEYS_SERIALIZER.ARCHIVE_TRANSACTION) {
            let resArchiveTransaction = JSON.parse(await getFromStorage(KEYS.ARCHIVE_TRANSACTION, email));
            if (!resArchiveTransaction) resArchiveTransaction = [];
            setGroupedArchivedTransactions(groupByDate(resArchiveTransaction));
            console.log("Archive Transaction  len: " + resArchiveTransaction.length);
          }
          setRefreshTrigger("reset"); // Reset refresh trigger
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
        let list = Object.keys(groupedPurchases)
          .concat(Object.keys(groupedTransactions))
          .concat(Object.keys(groupedArchivedPurchases))
          .concat(Object.keys(groupedArchivedTransactions))
          .sort();
        setListDays([...new Set(list)]);
      }
      fetchData();
    }, [groupedPurchases, groupedTransactions, groupedArchivedPurchases, groupedArchivedTransactions])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {editVisible && (
            <ModalCustom modalVisible={editVisible} setModalVisible={setEditVisible} size={14} hasColor={true}>
              {ModalList(
                email,
                selectedItem,
                setSelectedItem,
                getSplitEmail(splitUser),
                sliderStatus,
                setSliderStatus,
                setRefreshTrigger,
                modalContentFlag,
                handleEditPurchase,
                handleEditTransaction,
                setEditVisible,
                styles
              )}
            </ModalCustom>
          )}
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
                              handleSplit={async () => {
                                await handleSplit(email, innerData, getSplitEmail(splitUser), setRefreshTrigger);
                              }}
                              handleEdit={async () => {
                                setModalContentFlag("Purchase");
                                setSelectedItem({ ...innerData });
                                setSliderStatus("split" in innerData ? true : false);
                                setEditVisible(true);
                              }}
                              keys={KEYS_SERIALIZER.PURCHASE}
                              showAlert={() => {
                                showAlert(
                                  KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index,
                                  innerData,
                                  KEYS.PURCHASE,
                                  email,
                                  setRefreshTrigger
                                );
                              }}
                            />
                          ))}
                        {groupedTransactions[date] &&
                          groupedTransactions[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              handleEdit={async () => {
                                setModalContentFlag("Transaction");
                                setSelectedItem({ ...innerData });
                                setEditVisible(true);
                              }}
                              keys={KEYS_SERIALIZER.TRANSACTION}
                              showAlert={() => {
                                showAlert(
                                  KEYS_SERIALIZER.TRANSACTION + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index,
                                  innerData,
                                  KEYS.TRANSACTION,
                                  email,
                                  setRefreshTrigger
                                );
                              }}
                            />
                          ))}
                        {groupedArchivedPurchases[date] &&
                          groupedArchivedPurchases[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.ARCHIVE_PURCHASE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              keys={KEYS_SERIALIZER.ARCHIVE_PURCHASE}
                              gray={true}
                              showAlert={() => {}}
                            />
                          ))}
                        {groupedArchivedTransactions[date] &&
                          groupedArchivedTransactions[date].map((innerData) => (
                            <ListItem
                              key={innerData.index + KEYS_SERIALIZER.ARCHIVE_TRANSACTION + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                              innerData={innerData}
                              keys={KEYS_SERIALIZER.ARCHIVE_TRANSACTION}
                              gray={true}
                              showAlert={() => {}}
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
    </LinearGradient>
  );
}
