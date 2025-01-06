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
import { expenseLabel, isIncomeOnDate, splitOption, settleOption, editOption, searchItem, searchExpenses, searchIncome, editIncomeOption, loadEditModal } from "./handler";
import { months } from "../../utility/calendar";

import Header from "../../components/header/header";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";

import { deleteExpenses, groupExpensesByDate } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { ExpenseType, ExpensesByDateType, IncomeType, PurchaseType, TransactionType } from "../../models/types";
import { useDatabaseConnection } from "../../store/database-context";
import { IncomeEntity, IncomeModel } from "../../store/database/Income/IncomeEntity";
import { CustomListItem } from "../../components/ListItem/ListItem";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import { AlertData, IncomeAlertData, PurchaseAlertData, TransactionAlertData } from "../../constants/listConstants/deleteDialog";
import { removeFromStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { Checkbox, Searchbar } from "react-native-paper";
import { logTimeTook } from "../../utility/logger";

export default function List({ navigation }) {
  const appCtx = useContext(AppContext);
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expensesGroupedByDate, setExpensesGroupedByDate] = useState<ExpensesByDateType>({});
  const [incomeData, setIncomeData] = useState<IncomeEntity[]>([]);

  const [selectedItem, setSelectedItem] = useState<ExpenseType | IncomeType>();
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);
  const [destination, setDestination] = useState("");

  const [listDays, setListDays] = useState([]);

  const [editVisible, setEditVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const [expenses, setExpenses] = useState(appCtx.expenses);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);

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
        setListDays([]); // There is no data for the selected month
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
          const endTime = performance.now();
          logTimeTook("List", "useFocusEffect", endTime, startTime);
        }
      }
      fetchData();
    }, [appCtx.expenses, email, expenses, currentYear, currentMonth, incomeData.length, incomeRepository])
  );

  /* Loads dates based on Expenses, Income Items and Search Query */
  useFocusEffect(
    React.useCallback(() => {
      const startTime = performance.now();
      let listOfDays = [];
      searchExpenses(expensesGroupedByDate, searchQuery, listOfDays);
      searchIncome(incomeData, searchQuery, listOfDays);

      let list = listOfDays.sort().reverse();
      setListDays([...new Set(list)]);
      const endTime = performance.now();
      logTimeTook("List", "useFocusEffect list days", endTime, startTime);
    }, [searchQuery, incomeData, expensesGroupedByDate])
  );

  /* Load income options for list item */
  const incomeOptions = (income: IncomeEntity) => {
    return [editIncomeOption(income, setSelectedItem, setEditVisible)];
  };

  /* Load expenses options for list item */
  const expensesOptions = (expenses: ExpenseType) => {
    let options = [];
    const innerData = expenses.element;
    if (expenses.key === KEYS_SERIALIZER.PURCHASE && !(innerData as PurchaseType).split) {
      options.push(splitOption(setSelectedItem, expenses, email, getSplitEmail(splitUser), setExpenses));
    } else if (expenses.key === KEYS_SERIALIZER.PURCHASE && (innerData as PurchaseType)) {
      options.push(settleOption(email, expenses, destination, setExpenses));
    }
    options.push(editOption(setSelectedItem, expenses, setSliderStatus, setEditVisible));

    return options;
  };

  const loadModalDialog = (data: ExpenseType | IncomeType) => {
    setAlertVisible(true);
    setSelectedItem(data);
  };

  /* Loads the dialog data when list item is pressed */
  const getModalDialogData = (data: ExpenseType | IncomeType): AlertData => {
    if (data.hasOwnProperty("doi")) {
      data = data as IncomeType;

      const handleConfirm = async (data: IncomeType) => {
        await incomeRepository.delete(data.id);
        setIncomeData((prev) => prev.filter((item) => item.id !== data.id));
      };

      return IncomeAlertData(data.name, data.amount.toString(), async () => await handleConfirm(data as IncomeType));
    } else {
      data = data as ExpenseType;

      const handleConfirm = async (data: ExpenseType) => {
        const key = data.key == KEYS_SERIALIZER.PURCHASE ? KEYS.PURCHASE : KEYS.TRANSACTION;
        await removeFromStorage(key, data.index, email);
        deleteExpenses(data, setExpenses);
      };

      if (data.key == KEYS_SERIALIZER.PURCHASE) {
        const element = data.element as PurchaseType;
        return PurchaseAlertData(element.name, element.value, async () => await handleConfirm(data as ExpenseType));
      } else if (data.key == KEYS_SERIALIZER.TRANSACTION) {
        const element = data.element as TransactionType;
        return TransactionAlertData(element.description, element.amount, async () => await handleConfirm(data as ExpenseType));
      }
      return null;
    }
  };

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {editVisible && (
            /* TODO Improve ModalList implementation to prevent code duplication */
            <ModalCustom modalVisible={editVisible} setModalVisible={setEditVisible} size={18} hasColor={true}>
              {loadEditModal(selectedItem, email, sliderStatus, setEditVisible, setExpenses, setIncomeData)}
            </ModalCustom>
          )}
          {alertVisible && <ModalDialog visible={alertVisible} setVisible={setAlertVisible} size={2.5} data={getModalDialogData(selectedItem)} />}
          <View style={{ paddingHorizontal: 5 }}>
            <Searchbar
              iconColor="white"
              placeholderTextColor="lightgray"
              style={{ backgroundColor: dark.complementary, borderRadius: 10 }}
              placeholder="Search"
              inputStyle={{ color: "white" }}
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView>
              {listDays.map((date) => (
                <View key={KEYS_SERIALIZER.EXPENSE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date} style={{ paddingHorizontal: 5 }}>
                  <View style={styles.listDateBox}>
                    <Text style={styles.listDate}>{new Date(date).getDate() + " " + months[new Date(date).getMonth()]}</Text>
                  </View>
                  <CardWrapper key={date} style={styles.listBox}>
                    {expensesGroupedByDate[date] &&
                      expensesGroupedByDate[date].map(
                        (expenses: ExpenseType) =>
                          searchItem(expenses, searchQuery) && (
                            <CustomListItem
                              key={`Expenses${expenses.index}${expenses.key}${expenses.element.type}`}
                              id={`Expenses${expenses.index}${expenses.key}${expenses.element.type}`}
                              innerData={{ ...expenses.element }}
                              options={expensesOptions(expenses)}
                              label={expenseLabel(expenses.element)}
                              onPress={() => loadModalDialog(expenses)}
                              onLongPress={setMultiSelect}
                              selected={multiSelect}
                            />
                          )
                      )}
                    {incomeData &&
                      incomeData.map(
                        (income) =>
                          isIncomeOnDate(income.doi, date) &&
                          searchItem(income, searchQuery) && (
                            <CustomListItem
                              key={`Income${income.id}`}
                              id={`Income${income.id}`}
                              innerData={{ ...income, type: "Income" }}
                              options={incomeOptions(income)}
                              onPress={() => loadModalDialog({ ...income, key: KEYS_SERIALIZER.INCOME })}
                              onLongPress={setMultiSelect}
                              selected={multiSelect}
                            />
                          )
                      )}
                  </CardWrapper>
                </View>
              ))}
            </ScrollView>
          </View>
          {multiSelect.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={multiSelect.length > 0 ? "checked" : "unchecked"}
                onPress={() => {
                  setMultiSelect([]);
                }}
              />
              <Text style={{ color: dark.textPrimary }}>{`Selected items: ${multiSelect.length}`}</Text>
            </View>
          )}
          <View style={styles.calendar}>
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
