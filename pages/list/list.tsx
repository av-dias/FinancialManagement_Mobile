import React, { useState, useContext, Children } from "react";
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
import { expenseLabel, isIncomeOnDate, splitOption, settleOption, editOption, searchItemm } from "./handler";
import { months } from "../../utility/calendar";

import Header from "../../components/header/header";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";

import { deleteExpenses, groupExpensesByDate } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { ExpenseType, ExpensesByDateType, PurchaseType, TransactionType } from "../../models/types";
import { useDatabaseConnection } from "../../store/database-context";
import { IncomeEntity, IncomeModel } from "../../store/database/Income/IncomeEntity";
import { CustomListItem } from "../../components/ListItem/ListItem";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import { AlertData, IncomeAlertData, PurchaseAlertData, TransactionAlertData } from "../../constants/listConstants/deleteDialog";
import { removeFromStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import ModalList from "./component/modalList/modalList";
import { Searchbar } from "react-native-paper";

export default function List({ navigation }) {
  const appCtx = useContext(AppContext);
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [expensesGroupedByDate, setExpensesGroupedByDate] = useState<ExpensesByDateType>({});
  const [incomeData, setIncomeData] = useState<IncomeEntity[]>([]);

  const [selectedItem, setSelectedItem] = useState<ExpenseType | IncomeEntity>();
  const [splitUser, setSplitUser] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);
  const [destination, setDestination] = useState("");

  const [listDays, setListDays] = useState([]);
  const [listSearchDays, setListSearchDays] = useState({});

  const [editVisible, setEditVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const [expenses, setExpenses] = useState(appCtx.expenses);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      setListSearchDays({});
    }, [searchQuery])
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
    }, [appCtx.expenses, email, expenses, currentYear, currentMonth, incomeData.length, incomeRepository])
  );

  /* Load income options for list item */
  const incomeOptions = () => {
    return [{ callback: () => {}, type: "Edit" }];
  };

  /* Load expenses options for list item */
  const expensesOptions = (expenses, keys) => {
    let options = [];
    const innerData = expenses.element;
    if (!innerData.split && keys === KEYS_SERIALIZER.PURCHASE) {
      options.push(splitOption(setSelectedItem, expenses, email, getSplitEmail(splitUser), setExpenses));
    }
    if (innerData.split) {
      options.push(settleOption(email, expenses, destination, setExpenses));
    }
    options.push(editOption(setSelectedItem, expenses, setSliderStatus, setEditVisible));

    return options;
  };

  const loadModalDialog = (data) => {
    setAlertVisible(true);
    setSelectedItem(data);
  };

  /* Loads the dialog data when list item is pressed */
  const getModalDialogData = (data: ExpenseType | IncomeEntity): AlertData => {
    if (data.hasOwnProperty("doi")) {
      data = data as IncomeEntity;

      const handleConfirm = async (data: IncomeEntity) => {
        await incomeRepository.delete(data.id);
        setIncomeData((prev) => prev.filter((item) => item.id !== data.id));
      };

      return IncomeAlertData(data.name, data.amount.toString(), async () => await handleConfirm(data as IncomeEntity));
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

  const ItemsCounter = ({ date, children }) => {
    const hasDate = children.find((child) => child != false)[0];
    if (!listSearchDays.hasOwnProperty(date)) {
      setListSearchDays((prev) => ({ ...prev, [date]: hasDate == false ? false : true }));
    }
    return <>{children}</>;
  };

  console.log(listSearchDays);

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {editVisible && (
            /* TODO Improve ModalList implementation to prevent code duplication */
            <ModalCustom modalVisible={editVisible} setModalVisible={setEditVisible} size={14} hasColor={true}>
              {ModalList(email, selectedItem, setSelectedItem, getSplitEmail(splitUser), sliderStatus, setSliderStatus, setEditVisible, styles, setExpenses)}
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
          <View style={{ flex: verticalScale(7), backgroundColor: "transparent" }}>
            <ScrollView>
              {listDays.map((date) => (
                <View key={KEYS_SERIALIZER.EXPENSE + KEYS_SERIALIZER.TOKEN_SEPARATOR + date} style={{ paddingHorizontal: 5 }}>
                  {listSearchDays[date] && (
                    <View style={styles.listDateBox}>
                      <Text style={styles.listDate}>{new Date(date).getDate() + " " + months[new Date(date).getMonth()]}</Text>
                    </View>
                  )}
                  <CardWrapper key={date} style={styles.listBox}>
                    <ItemsCounter date={date}>
                      {expensesGroupedByDate[date] &&
                        expensesGroupedByDate[date].map(
                          (expenses: ExpenseType) =>
                            searchItemm(expenses, searchQuery) && (
                              <CustomListItem
                                key={`Income${expenses.index}`}
                                innerData={expenses.element}
                                options={expensesOptions(expenses, expenses.key)}
                                label={expenseLabel(expenses.element)}
                                onPress={() => loadModalDialog(expenses)}
                              />
                            )
                        )}
                      {incomeData &&
                        incomeData.map(
                          (income) =>
                            isIncomeOnDate(income.doi, date) &&
                            searchItemm(income, searchQuery) && (
                              <CustomListItem key={`Income${income.id}`} innerData={{ ...income, type: "Income" }} options={incomeOptions()} onPress={() => loadModalDialog(income)} />
                            )
                        )}
                    </ItemsCounter>
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
