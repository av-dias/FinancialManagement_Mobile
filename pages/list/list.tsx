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
import { getSplitEmail, getSplitUser } from "../../functions/split";
import { handleSplit, handleSettleSplit } from "./handler";
import { months } from "../../utility/calendar";
import showAlert from "./showAlert";

import ModalList from "./component/modalList/modalList";
import Header from "../../components/header/header";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";
import { ListItem } from "./component/listItem/listItem";

import { groupExpensesByDate } from "../../functions/expenses";
import { handleTransaction } from "../transaction/handler";
import { dark } from "../../utility/colors";
import { Expense, ExpensesByDate } from "../../models/types";
import { useDatabaseConnection } from "../../store/database-context";
import { IncomeEntity, IncomeModel } from "../../store/database/Income/IncomeEntity";
import { IncomeItem } from "./component/IncomeItem/incomeItem";

export default function List({ navigation }) {
  const appCtx = useContext(AppContext);
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expensesGroupedByDate, setExpensesGroupedByDate] = useState<ExpensesByDate>({});
  const [incomeData, setIncomeData] = useState<IncomeEntity[]>([]);

  const [selectedItem, setSelectedItem] = useState<Expense>();
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);
  const [destination, setDestination] = useState("");

  const [listDays, setListDays] = useState([]);
  const [editVisible, setEditVisible] = useState(false);

  const [expenses, setExpenses] = useState(appCtx.expenses);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        await getSplitUser(setDestination, email);
        try {
        } catch (e) {
          console.log("Transaction: " + e);
        }
      }
      fetchData();
    }, [email])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (expenses && email && expenses.hasOwnProperty(currentYear) && expenses[currentYear].hasOwnProperty(currentMonth)) {
          console.log("List: Fetching app data...");
          const startTime = performance.now();

          let resExpensesGroupedByDate = groupExpensesByDate(expenses, currentYear, currentMonth);
          setExpensesGroupedByDate(resExpensesGroupedByDate);

          let incomeList: IncomeModel[] = [];

          try {
            incomeList = await incomeRepository.getIncomeFromDate(email, currentMonth, currentYear);
            setIncomeData(incomeList);
          } catch (e) {
            console.log(e);
          }

          let dates = Object.keys(resExpensesGroupedByDate);
          if (incomeList) {
            incomeList.forEach((income) => {
              const date = income.doi.toString().split(" ")[0];
              if (!dates.includes(date)) {
                dates.push(date);
              }
            });
          }

          let list = dates.sort().reverse();
          setListDays([...new Set(list)]);
          const endTime = performance.now();
          console.log(`--> Call to List useFocusEffect took ${endTime - startTime} milliseconds.`);
        } else {
          // There is no data for the selected month
          setListDays([]);
        }
      }
      fetchData();
    }, [appCtx.expenses, email, expenses, currentYear, currentMonth, incomeData.length])
  );

  const isIncomeOnDate = (i_doi, date) => {
    return i_doi.toString().split(" ")[0] == date ? true : false;
  };

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {editVisible && (
            <ModalCustom modalVisible={editVisible} setModalVisible={setEditVisible} size={14} hasColor={true}>
              {ModalList(email, selectedItem, setSelectedItem, getSplitEmail(splitUser), sliderStatus, setSliderStatus, setEditVisible, styles, setExpenses)}
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
                      expensesGroupedByDate[date].map((expenses: Expense) => (
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
                          handleSettleSplit={async () => {
                            await handleSettleSplit(email, expenses, handleTransaction, destination, setExpenses);
                          }}
                          keys={expenses.key}
                          showAlert={() => {
                            showAlert(expenses.key + KEYS_SERIALIZER.TOKEN_SEPARATOR + expenses.index, expenses, email, setExpenses);
                          }}
                        />
                      ))}
                    {incomeData &&
                      incomeData.map(
                        (income) =>
                          isIncomeOnDate(income.doi, date) && (
                            <IncomeItem
                              key={income.id}
                              incomeData={income}
                              handleEdit={() => {}}
                              handlePress={async () => {
                                await incomeRepository.delete(income.id);
                                setIncomeData((prev) => prev.filter((item) => item.id !== income.id));
                              }}
                            />
                          )
                      )}
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
