import React, { useState, useContext } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { _styles } from "./style";

//Context
import { UserContext } from "../../store/user-context";

import { verticalScale } from "../../functions/responsive";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { getSplitUser } from "../../functions/split";
import {
  expenseLabel,
  isIncomeOnDate,
  splitOption,
  settleOption,
  editOption,
  searchItem,
  searchExpenses,
  searchIncome,
  editIncomeOption,
  loadEditModal,
  isExpenseOnDate,
} from "./handler";
import { months } from "../../utility/calendar";

import Header from "../../components/header/header";
import CalendarCard from "../../components/calendarCard/calendarCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";

import { dark } from "../../utility/colors";
import { ExpenseEnum, IncomeType } from "../../models/types";
import { useDatabaseConnection } from "../../store/database-context";
import { IncomeEntity } from "../../store/database/Income/IncomeEntity";
import { CustomListItem } from "../../components/ListItem/ListItem";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import {
  AlertData,
  IncomeAlertData,
  PurchaseAlertData,
  TransactionAlertData,
} from "../../constants/listConstants/deleteDialog";
import { Checkbox, Searchbar } from "react-native-paper";
import { logTimeTook } from "../../utility/logger";
import { utilIcons } from "../../utility/icons";
import { ExpensesService } from "../../service/ExpensesService";
import {
  TransactionEntity,
  TransactionOperation,
} from "../../store/database/Transaction/TransactionEntity";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import { SubscriptionService } from "../../service/SubscriptionService";
import { SubscriptionEntity } from "../../store/database/Subscription/SubscriptionEntity";
import { getExpenseDate } from "../../functions/expenses";
import commonStyles from "../../utility/commonStyles";

export default function List({ navigation }) {
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();
  const expensesService = new ExpensesService();
  const subscriptionService = new SubscriptionService();

  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [incomeData, setIncomeData] = useState<IncomeEntity[]>([]);
  const [expenseData, setExpenseData] = useState<
    (PurchaseEntity | TransactionEntity)[]
  >([]);

  const [selectedItem, setSelectedItem] = useState<
    PurchaseEntity | TransactionEntity | IncomeEntity
  >();
  const [destination, setDestination] = useState({ email: "", name: "" });

  const [listDays, setListDays] = useState([]);

  const [editVisible, setEditVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [multiSelect, setMultiSelect] = useState<
    (PurchaseEntity | TransactionEntity | IncomeEntity)[]
  >([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          await getSplitUser(setDestination, email);
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
        if (email) {
          console.log("List: Fetching app data...");
          const startTime = performance.now();

          let incomeList = [];
          let expensesList = [];

          try {
            incomeList = await incomeRepository.getIncomeFromDate(
              email,
              currentMonth,
              currentYear
            );
            expensesList = await expensesService.getExpensesList(
              email,
              currentMonth + 1,
              currentYear
            );
            setExpenseData(expensesList);
            setIncomeData(incomeList);
          } catch (e) {
            console.log(e);
          }
          const endTime = performance.now();
          logTimeTook("List", "useFocusEffect", endTime, startTime);
        }
      }
      fetchData();
    }, [email, currentYear, currentMonth, incomeRepository, refresh])
  );

  /* Loads dates based on Expenses, Income Items and Search Query */
  useFocusEffect(
    React.useCallback(() => {
      const startTime = performance.now();
      let listOfDays = [];
      searchExpenses(expenseData, searchQuery, listOfDays);
      searchIncome(incomeData, searchQuery, listOfDays);

      let list = listOfDays.sort().reverse();
      setListDays([...new Set(list)]);
      const endTime = performance.now();
      logTimeTook("List", "useFocusEffect list days", endTime, startTime);
    }, [searchQuery, incomeData, expenseData])
  );

  const removeExpense = (item: PurchaseEntity | TransactionEntity) => {
    setExpenseData((prev: (TransactionEntity | PurchaseEntity)[]) => {
      const filteredList = prev.filter(
        (prevItem) =>
          !(prevItem.id === item.id && prevItem.entity === item.entity)
      );

      // If it is a transaction
      if (item.entity === ExpenseEnum.Transaction) {
        for (let prevItem of filteredList) {
          // We need to check if its associated with purchase
          if (
            prevItem.entity === ExpenseEnum.Purchase &&
            prevItem.wasRefunded &&
            prevItem.wasRefunded === item.id
          ) {
            prevItem.wasRefunded = null;
            break;
          }
        }
      }

      return filteredList;
    });
  };

  const addExpense = (item: PurchaseEntity | TransactionEntity) => {
    setExpenseData((prev) => [...prev, item]);
  };

  /* Load income options for list item */
  const incomeOptions = (income: IncomeEntity) => {
    return [editIncomeOption(income, setSelectedItem, setEditVisible)];
  };

  /* Load expenses options for list item */
  const expensesOptions = (expense: PurchaseEntity | TransactionEntity) => {
    let options = [];
    if (expense.entity === ExpenseEnum.Purchase && !expense.split) {
      options.push(
        splitOption(expense, destination.email, expensesService, reload)
      );
    } else if (
      expense.entity === ExpenseEnum.Purchase &&
      !expense?.wasRefunded
    ) {
      options.push(
        settleOption(
          email,
          expense,
          destination.email,
          expensesService,
          (expense: PurchaseEntity) => addExpense(expense)
        )
      );
    }

    options.push(editOption(setSelectedItem, expense, setEditVisible));

    return options;
  };

  const removeSelection = () => setMultiSelect([]);

  const loadModalDialog = (
    data: PurchaseEntity | TransactionEntity | IncomeType
  ) => {
    setAlertVisible(true);
    setSelectedItem(data);
  };

  const onRecurringHandle = async () => {
    if (multiSelect.length == 0) {
      navigation.navigate("Subscription");
    } else {
      for (const itemSelected of multiSelect) {
        const subscriptionEntity: SubscriptionEntity = {
          dayOfMonth: getExpenseDate(itemSelected),
          lastUpdateDate: null,
          entity: itemSelected?.entity,
          userId: email,
          item: itemSelected,
        };
        await subscriptionService.createSubscription(email, subscriptionEntity);
      }
    }
    removeSelection();
  };

  const onBulkDeleteHandle = () => {
    multiSelect.forEach((item) => {
      switch (item.entity) {
        case ExpenseEnum.Purchase: {
          expensesService.deletePurchase(item);
          removeExpense(item);
          break;
        }
        case ExpenseEnum.Transaction: {
          expensesService.deleteTransaction(item);
          removeExpense(item);
          break;
        }
        case ExpenseEnum.Income: {
          incomeRepository.delete(item.id);
          setIncomeData((prev) => prev.filter((item) => item.id !== item.id));
          break;
        }
      }
    });
    removeSelection();
  };

  /* Loads the dialog data when list item is pressed */
  const getModalDialogData = (
    data: IncomeEntity | PurchaseEntity | TransactionEntity
  ): AlertData => {
    if (data.entity === ExpenseEnum.Income) {
      const handleConfirm = async (income: IncomeEntity) => {
        await incomeRepository.delete(income.id);
        setIncomeData((prev) => prev.filter((item) => item.id !== income.id));
      };

      return IncomeAlertData(
        data.name,
        data.amount.toString(),
        async () => await handleConfirm(data)
      );
    } else if (data.entity === ExpenseEnum.Purchase) {
      const handleConfirm = async (purchase: PurchaseEntity) => {
        await expensesService.deletePurchase(purchase);
        removeExpense(purchase);
      };
      return PurchaseAlertData(
        data.name,
        data.amount.toString(),
        async () => await handleConfirm(data)
      );
    } else {
      const handleConfirm = async (transaction: TransactionEntity) => {
        await expensesService.deleteTransaction(transaction);
        removeExpense(transaction);
      };
      return TransactionAlertData(
        data.description,
        data.amount.toString(),
        async () => await handleConfirm(data)
      );
    }
  };

  // TODO This migrated to state change
  const reload = () => {
    setEditVisible(false);
    setRefresh((prev) => !prev);
  };

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {editVisible && (
            /* TODO Improve ModalList implementation to prevent code duplication */
            <ModalCustom
              modalVisible={editVisible}
              setModalVisible={setEditVisible}
              size={18}
              hasColor={true}
            >
              {loadEditModal(selectedItem, email, reload, setIncomeData)}
            </ModalCustom>
          )}
          {alertVisible && (
            <ModalDialog
              visible={alertVisible}
              setVisible={setAlertVisible}
              size={2.5}
              data={getModalDialogData(selectedItem)}
            />
          )}
          {/*
           * Searchbar to filter items
           */}
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
          {/*
           * CustomListItem for Expenses and Income
           */}
          <View style={{ flex: 1 }}>
            <ScrollView>
              {listDays.map((date) => (
                <View
                  key={
                    KEYS_SERIALIZER.EXPENSE +
                    KEYS_SERIALIZER.TOKEN_SEPARATOR +
                    date
                  }
                  style={{ paddingHorizontal: 5 }}
                >
                  <View style={styles.listDateBox}>
                    <Text style={styles.listDate}>
                      {new Date(date).getDate() +
                        " " +
                        months[new Date(date).getMonth()]}
                    </Text>
                    <Text style={styles.listTotalCost}>
                      {expenseData
                        ?.map(
                          (expense: PurchaseEntity | TransactionEntity) =>
                            isExpenseOnDate(expense, date) &&
                            searchItem(expense, searchQuery) &&
                            (expense.entity === ExpenseEnum.Transaction &&
                            expense.transactionType ===
                              TransactionOperation.RECEIVED
                              ? +expense.amount
                              : -expense.amount)
                        )
                        .reduce((a, b) => a + b, 0) +
                        incomeData
                          ?.map(
                            (income: IncomeEntity) =>
                              isIncomeOnDate(income.doi, date) &&
                              searchItem(income, searchQuery) &&
                              income.amount
                          )
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)}
                      <Text
                        style={{ fontSize: commonStyles.symbolSize }}
                      >{`€`}</Text>
                    </Text>
                  </View>
                  <CardWrapper key={date} style={styles.listBox}>
                    {expenseData?.map(
                      (expense: PurchaseEntity | TransactionEntity) =>
                        isExpenseOnDate(expense, date) &&
                        searchItem(expense, searchQuery) && (
                          <CustomListItem
                            key={`Expenses${expense.id}${expense.entity}${expense.type}`}
                            item={expense}
                            options={expensesOptions(expense)}
                            label={expenseLabel(expense)}
                            onPress={() => loadModalDialog(expense)}
                            onLongPress={setMultiSelect}
                            selected={multiSelect}
                          />
                        )
                    )}
                    {incomeData?.map(
                      (income) =>
                        isIncomeOnDate(income.doi, date) &&
                        searchItem(income, searchQuery) && (
                          <CustomListItem
                            key={`Income${income.id}`}
                            item={income}
                            options={incomeOptions(income)}
                            onPress={() =>
                              loadModalDialog({
                                ...income,
                                key: KEYS_SERIALIZER.INCOME,
                              })
                            }
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
          {/*
           * Bottom Options
           *  CheckBox  - Number of selected items
           *  Recurring - Show all recurring expenses
           *  Calendar  - Change current view date
           */}
          {multiSelect.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status={multiSelect.length > 0 ? "checked" : "unchecked"}
                onPress={removeSelection}
              />
              <Pressable onPress={removeSelection}>
                <Text
                  style={{ color: dark.textPrimary }}
                >{`Selected items: ${multiSelect.length}`}</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.calendar}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Pressable onPress={async () => await onRecurringHandle()}>
                <CardWrapper style={{ height: verticalScale(40), padding: 5 }}>
                  {
                    utilIcons(35, dark.textPrimary).find(
                      (icon) => icon.label === "Recurring"
                    ).icon
                  }
                </CardWrapper>
              </Pressable>
              {multiSelect.length > 0 && (
                <Pressable onPress={onBulkDeleteHandle}>
                  <CardWrapper
                    style={{ height: verticalScale(40), padding: 5 }}
                  >
                    {
                      utilIcons(35, dark.textPrimary).find(
                        (icon) => icon.label === "Delete"
                      ).icon
                    }
                  </CardWrapper>
                </Pressable>
              )}
            </View>
            <View>
              <CalendarCard
                monthState={[currentMonth, setCurrentMonth]}
                yearState={[currentYear, setCurrentYear]}
              />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
