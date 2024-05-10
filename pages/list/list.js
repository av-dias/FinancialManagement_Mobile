import React, { useState, useContext } from "react";
import { Text, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { _styles } from "./style";

//Context
import { AppContext } from "../../store/app-context";
import { UserContext } from "../../store/user-context";

import { verticalScale } from "../../functions/responsive";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
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
  const appCtx = useContext(AppContext);
  const email = useContext(UserContext).email;

  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expensesGroupedByDate, setExpensesGroupedByDate] = useState([]);

  const [selectedItem, setSelectedItem] = useState({ date: new Date().toISOString().split("T")[0] });
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);

  const [listDays, setListDays] = useState([]);
  const [editVisible, setEditVisible] = useState(false);

  const [expenses, setExpenses] = useState(appCtx.expenses);

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        if (expenses && expenses.hasOwnProperty(currentYear) && expenses[currentYear].hasOwnProperty(currentMonth)) {
          console.log("List: Fetching app data...");
          startTime = performance.now();

          let resExpensesGroupedByDate = groupExpensesByDate(expenses, currentYear, currentMonth);
          setExpensesGroupedByDate(resExpensesGroupedByDate);
          let list = Object.keys(resExpensesGroupedByDate).sort();
          setListDays([...new Set(list)]);
          endTime = performance.now();
          console.log(`--> Call to List useFocusEffect took ${endTime - startTime} milliseconds.`);
        } else {
          // There is no data for the selected month
          setListDays([]);
        }
      }
      fetchData();
    }, [appCtx.expenses, expenses, currentYear, currentMonth])
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
                setEditVisible,
                styles,
                setExpenses
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
                      expensesGroupedByDate[date].map((expenses) => (
                        <ListItem
                          key={expenses.index + expenses.key + KEYS_SERIALIZER.TOKEN_SEPARATOR + date}
                          innerData={expenses.element}
                          handleSplit={async () => {
                            setSelectedItem({ ...expenses });
                            await handleSplit(email, expenses, getSplitEmail(splitUser), setExpenses);
                          }}
                          handleEdit={async () => {
                            setSelectedItem({ ...expenses });
                            setSliderStatus("split" in expenses.element ? true : false);
                            setEditVisible(true);
                          }}
                          keys={expenses.key}
                          showAlert={() => {
                            showAlert(expenses.key + KEYS_SERIALIZER.TOKEN_SEPARATOR + expenses.index, expenses, email, setExpenses);
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
