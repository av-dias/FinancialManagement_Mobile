import React, { useState, useContext } from "react";
import { Text, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { _styles } from "./style";

//Context
import { AppContext } from "../../store/app-context";
import { UserContext } from "../../store/user-context";

import { verticalScale } from "../../functions/responsive";
import { KEYS as KEYS_SERIALIZER, TRIGGER_KEYS } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import { getSplitEmail } from "../../functions/split";
import { handleSplit, handleEditPurchase, groupByDate, handleEditTransaction, isCtxLoaded } from "./handler";
import { getFromStorage } from "../../functions/secureStorage";
import { months } from "../../utility/calendar";
import { ModalList } from "../../utility/modalContent";
import showAlert from "./showAlert";

import Header from "../../components/header/header";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";
import ListItem from "../../components/listItem/listItem";
import { groupExpensesByDate } from "../../functions/expenses";

export default function List({ navigation }) {
  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expensesGroupedByDate, setExpensesGroupedByDate] = useState([]);

  const [selectedItem, setSelectedItem] = useState({ date: new Date().toISOString().split("T")[0] });
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);

  const [listDays, setListDays] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState({});
  const [editVisible, setEditVisible] = useState(false);

  const appCtx = useContext(AppContext);
  const email = useContext(UserContext).email;

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        if (appCtx && appCtx.expenses && appCtx.expenses.hasOwnProperty(currentYear) && appCtx.expenses[currentYear].hasOwnProperty(currentMonth)) {
          console.log("List: Fetching app data...");
          startTime = performance.now();

          let resExpensesGroupedByDate = groupExpensesByDate(appCtx.expenses, currentYear, currentMonth);
          setExpensesGroupedByDate(resExpensesGroupedByDate);
          let list = Object.keys(resExpensesGroupedByDate).sort();
          setListDays([...new Set(list)]);
          endTime = performance.now();
          console.log(`--> Call to List useFocusEffect took ${endTime - startTime} milliseconds.`);
        }
      }
      fetchData();
    }, [appCtx, currentYear, currentMonth, refreshTrigger])
  );

  /* useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (!email) return;
        try {
          if (refreshTrigger[TRIGGER_KEYS[0]] == KEYS_SERIALIZER.PURCHASE) {
            appCtx.triggerReloadPurchase(new Date(selectedItem.dop).getMonth(), new Date(selectedItem.dop).getFullYear(), refreshTrigger);
          } else if (refreshTrigger[TRIGGER_KEYS[0]] == KEYS_SERIALIZER.TRANSACTION) {
            appCtx.triggerReloadTransaction(new Date(selectedItem.dot).getMonth(), new Date(selectedItem.dot).getFullYear(), refreshTrigger);
          } else if (refreshTrigger[TRIGGER_KEYS[0]] == KEYS_SERIALIZER.ARCHIVE_PURCHASE) {
            let resArchivePurchase = JSON.parse(await getFromStorage(KEYS.ARCHIVE_PURCHASE, email));
            if (!resArchivePurchase) resArchivePurchase = [];
            setGroupedArchivedPurchases(groupByDate(resArchivePurchase));
            appCtx.triggerReloadPurchase(new Date(selectedItem.date).getMonth(), new Date(selectedItem.date).getFullYear(), refreshTrigger);
            console.log("Archive Purchase  len: " + resArchivePurchase.length);
          } else if (refreshTrigger[TRIGGER_KEYS[0]] == KEYS_SERIALIZER.ARCHIVE_TRANSACTION) {
            let resArchiveTransaction = JSON.parse(await getFromStorage(KEYS.ARCHIVE_TRANSACTION, email));
            if (!resArchiveTransaction) resArchiveTransaction = [];
            setGroupedArchivedTransactions(groupByDate(resArchiveTransaction));
            appCtx.triggerReloadTransaction(new Date(selectedItem.date).getMonth(), new Date(selectedItem.date).getFullYear(), refreshTrigger);
            console.log("Archive Transaction  len: " + resArchiveTransaction.length);
          }
          setRefreshTrigger({ [TRIGGER_KEYS[0]]: "reset" }); // Reset refresh trigger
        } catch (e) {
          console.log("Archive: " + e);
        }
      }
      fetchData();
    }, [refreshTrigger[TRIGGER_KEYS[0]], email])
  ); */

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
                handleEditPurchase,
                handleEditTransaction,
                setEditVisible,
                styles
              )}
            </ModalCustom>
          )}
          <View style={{ flex: verticalScale(7), backgroundColor: "transparent" }}>
            <ScrollView>
              {listDays.map((date) => (
                <View key={KEYS_SERIALIZER.EXPENSE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date} style={{ paddingHorizontal: 5 }}>
                  <View style={styles.listDateBox}>
                    <Text style={styles.listDate}>{new Date(date).getDate() + " " + months[new Date(date).getMonth()]}</Text>
                  </View>
                  <CardWrapper key={date} style={styles.listBox}>
                    {expensesGroupedByDate[date] &&
                      expensesGroupedByDate[date].map((innerData) => (
                        <ListItem
                          key={innerData.index + innerData.key + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                          innerData={innerData.element}
                          handleSplit={async () => {
                            setSelectedItem({ ...innerData });
                            await handleSplit(email, innerData, getSplitEmail(splitUser), setRefreshTrigger);
                          }}
                          handleEdit={async () => {
                            setSelectedItem({ ...innerData });
                            setSliderStatus("split" in innerData.element ? true : false);
                            setEditVisible(true);
                          }}
                          keys={innerData.key}
                          showAlert={() => {
                            showAlert(innerData.key + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index, innerData.element, email, setRefreshTrigger);
                          }}
                        />
                      ))}
                  </CardWrapper>
                </View>
              ))}
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
