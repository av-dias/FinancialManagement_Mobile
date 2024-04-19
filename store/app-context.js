import React, { createContext, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllPurchaseStats } from "../functions/purchase";
import { getAllTransactionsStats } from "../functions/transaction";
import { getUser } from "../functions/basic";
import { UserContext } from "./user-context";
import { STATS_TYPE, TRANSACTION_TYPE, KEYS as KEYS_SERIALIZER } from "../utility/keys";

export const AppContext = createContext({
  purchaseTotal: {},
  transactionTotal: {},
  expensesByDate: {},
  totalExpense: {},
  expenseByType: {},
  totalExpensesAverage: {},
  totalExpensesByTypeAverage: {},
  splitDept: {},
});

const calcExpensesByType = (resPurchases, resTransactions) => {
  let expensesByType = {};

  expensesByType = resPurchases.reduce((acc, curr) => {
    let currDate = new Date(curr.dop);
    let currMonth = currDate.getMonth().toString();
    let currYear = currDate.getFullYear().toString();

    // Verify if year already exists
    if (!acc[currYear]) {
      acc[currYear] = { [currMonth]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
    }

    // Verify if month already exists
    if (!acc[currYear][currMonth]) {
      acc[currYear][currMonth] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(acc[currYear][currMonth][STATS_TYPE[0]]).includes(curr.type)) {
      acc[currYear][currMonth][STATS_TYPE[0]][curr.type] = 0;
      acc[currYear][currMonth][STATS_TYPE[1]][curr.type] = 0;
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) type1Value = parseFloat((type0Value * (100 - curr.split.weight)) / 100);

    acc[currYear][currMonth][STATS_TYPE[0]][curr.type] += type0Value;
    acc[currYear][currMonth][STATS_TYPE[1]][curr.type] += type1Value;
    return acc;
  }, {});

  resTransactions.forEach((curr, index) => {
    let currDate = new Date(curr.dot);
    let currMonth = currDate.getMonth().toString();
    let currYear = currDate.getFullYear().toString();
    let value = parseFloat(curr.amount);

    // Verify if year already exists
    if (!expensesByType[currYear]) {
      expensesByType[currYear] = { [currMonth]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
    }

    // Verify if month already exists
    if (!expensesByType[currYear][currMonth]) {
      expensesByType[currYear][currMonth] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(expensesByType[currYear][currMonth][STATS_TYPE[0]]).includes(curr.type)) {
      expensesByType[currYear][currMonth][STATS_TYPE[0]][curr.type] = 0;
      expensesByType[currYear][currMonth][STATS_TYPE[1]][curr.type] = 0;
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      expensesByType[currYear][currMonth][STATS_TYPE[0]][curr.type] -= value;
    } else {
      expensesByType[currYear][currMonth][STATS_TYPE[0]][curr.type] += value;
      expensesByType[currYear][currMonth][STATS_TYPE[1]][curr.type] += value;
    }
  });

  return expensesByType;
};

const calcExpensesTotal = (purchases, transaction) => {
  let expenses = { ...purchases };
  let transactionYearList = Object.keys(transaction);

  for (year of transactionYearList) {
    Object.keys(transaction[year]).forEach((month) => {
      // Verify if year already exists
      if (!expenses[year]) {
        expenses[year] = { [month]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
      }

      // Verify if month already exists
      if (!expenses[year][month]) {
        expenses[year][month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
      }

      expenses[year][month][STATS_TYPE[0]] += parseFloat(transaction[year][month][TRANSACTION_TYPE[0]]);
      expenses[year][month][STATS_TYPE[1]] += parseFloat(transaction[year][month][TRANSACTION_TYPE[1]]);
    });
  }

  return expenses;
};

const calcPurchaseTotal = (purchases) => {
  const res = purchases.reduce((acc, curr) => {
    let currDate = new Date(curr.dop);
    let currMonth = currDate.getMonth().toString();
    let currYear = currDate.getFullYear().toString();

    // Verify if year already exists
    if (!acc[currYear]) {
      acc[currYear] = { [currMonth]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
    }

    // Verify if month already exists
    if (!acc[currYear][currMonth]) {
      acc[currYear][currMonth] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) type1Value = parseFloat((type0Value * (100 - curr.split.weight)) / 100);

    acc[currYear][currMonth][STATS_TYPE[0]] += type0Value;
    acc[currYear][currMonth][STATS_TYPE[1]] += type1Value;

    return acc;
  }, {});
  return res;
};

const calcTransactionTotal = (transactions) => {
  const res = transactions.reduce((acc, curr) => {
    let currDate = new Date(curr.dot);
    let currMonth = currDate.getMonth().toString();
    let currYear = currDate.getFullYear().toString();
    let value = parseFloat(curr.amount);

    // Verify if year already exists
    if (!acc[currYear]) {
      acc[currYear] = { [currMonth]: { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 } };
    }

    // Verify if month already exists
    if (!acc[currYear][currMonth]) {
      acc[currYear][currMonth] = { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 };
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      acc[currYear][currMonth][TRANSACTION_TYPE[0]] -= value;
      acc[currYear][currMonth][TRANSACTION_TYPE[2]] += value;
    } else {
      acc[currYear][currMonth][TRANSACTION_TYPE[0]] += value;
      acc[currYear][currMonth][TRANSACTION_TYPE[1]] += value;
    }
    return acc;
  }, {});
  return res;
};

const calcExpensesTotalAverage = (expenses) => {
  let expensesAverage = {};
  let expensesYearList = Object.keys(expenses);
  for (year of expensesYearList) {
    let monthCount = 0;
    Object.keys(expenses[year]).forEach((month) => {
      monthCount++;

      // Verify if year already exists
      if (!expensesAverage[year]) {
        expensesAverage[year] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
      }

      expensesAverage[year][STATS_TYPE[0]] += expenses[year][month][STATS_TYPE[0]];
      expensesAverage[year][STATS_TYPE[1]] += expenses[year][month][STATS_TYPE[1]];
    });
    expensesAverage[year][STATS_TYPE[0]] /= monthCount;
    expensesAverage[year][STATS_TYPE[1]] /= monthCount;
  }
  return expensesAverage;
};

const calcExpensesByTypeAverage = (expenses) => {
  let expensesByTypeAverage = {};
  let expensesYearList = Object.keys(expenses);
  for (year of expensesYearList) {
    let monthCount = 0;
    Object.keys(expenses[year]).forEach((month) => {
      monthCount++;

      // Verify if year already exists
      if (!expensesByTypeAverage[year]) {
        expensesByTypeAverage[year] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
      }

      let elementStatsList = Object.keys(expenses[year][month]);
      for (stats of elementStatsList) {
        let elementTypeList = Object.keys(expenses[year][month][stats]);
        for (type of elementTypeList) {
          // Verify if type already exists
          if (!expensesByTypeAverage[year][stats][type]) expensesByTypeAverage[year][stats][type] = 0;

          expensesByTypeAverage[year][stats][type] += expenses[year][month][stats][type];
        }
      }
    });

    for (stats of Object.keys(expensesByTypeAverage[year])) {
      let elementTypeList = Object.keys(expensesByTypeAverage[year][stats]);
      for (type of elementTypeList) {
        expensesByTypeAverage[year][stats][type] /= monthCount;
      }
    }
  }
  return expensesByTypeAverage;
};

const calcSplitDept = (expenses) => {
  let splitDept = {};
  let expensesYearList = Object.keys(expenses);
  for (year of expensesYearList) {
    let monthCount = 0;
    Object.keys(expenses[year]).forEach((month) => {
      monthCount++;

      // Verify if year already exists
      if (!splitDept[year]) {
        splitDept[year] = { [month]: 0 };
      }

      splitDept[year][month] = expenses[year][month][STATS_TYPE[0]] - expenses[year][month][STATS_TYPE[1]];
    });
  }
  return splitDept;
};

const groupExpensesByDate = (purchases, transactions) => {
  let groupedPurchases = {};

  purchases.forEach((curr, index) => {
    let dateValue = curr["dop"];
    curr["index"] = index;
    curr["key"] = KEYS_SERIALIZER.PURCHASE;
    (groupedPurchases[dateValue] = groupedPurchases[dateValue] || []).push(curr);
  });

  transactions.forEach((curr, index) => {
    let dateValue = curr["dot"];
    curr["index"] = index;
    curr["key"] = KEYS_SERIALIZER.TRANSACTION;
    (groupedPurchases[dateValue] = groupedPurchases[dateValue] || []).push(curr);
  });

  return groupedPurchases;
};

const AppContextProvider = ({ children }) => {
  const [purchases, setPurchases] = useState({});
  const [transactions, setTransactions] = useState({});
  const [purchaseTotal, setPurchaseTotal] = useState({});
  const [transactionTotal, setTransactionTotal] = useState({});
  const [expensesByDate, setExpensesByDate] = useState({});
  const [expenseTotal, setExpenseTotal] = useState({});
  const [expensesByType, setExpensesByType] = useState({});
  const [totalExpensesAverage, setTotalExpensesAverage] = useState({});
  const [totalExpensesByTypeAverage, setTotalExpensesByTypeAverage] = useState({});
  const [splitDept, setSplitDept] = useState({});
  const [updatePurchase, setUpdatePurchase] = useState({ updateCount: 0 });
  const [updateTransaction, setUpdateTransaction] = useState({ updateCount: 0 });

  const userCtx = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (userCtx.email) {
          console.log("App-Context: Fetching app data...");
          startTime = performance.now();
          // PURCHASE
          let resPurchases = await getAllPurchaseStats(userCtx.email);
          let resCalcPurchaseTotal = calcPurchaseTotal(resPurchases);
          setPurchaseTotal(resCalcPurchaseTotal);
          // TRANSACTION
          let resTransactions = await getAllTransactionsStats(userCtx.email);
          let resCalcTransactionTotal = calcTransactionTotal(resTransactions);
          setTransactionTotal(resCalcTransactionTotal);
          // EXPENSES
          let resGroupedExpensesByDate = groupExpensesByDate(resPurchases, resTransactions);
          setExpensesByDate(resGroupedExpensesByDate);
          let resExpensesTotal = calcExpensesTotal(resCalcPurchaseTotal, resCalcTransactionTotal);
          setExpenseTotal(resExpensesTotal);
          let resExpensesByType = calcExpensesByType(resPurchases, resTransactions);
          setExpensesByType(resExpensesByType);
          // EXPENSES AVERAGE
          let resExpensesTotalAverage = calcExpensesTotalAverage(resExpensesTotal);
          setTotalExpensesAverage(resExpensesTotalAverage);
          let resExpensesByTypeAverage = calcExpensesByTypeAverage(resExpensesByType);
          setTotalExpensesByTypeAverage(resExpensesByTypeAverage);
          // SPLIT
          let resSplitDept = calcSplitDept(resExpensesTotal);
          setSplitDept(resSplitDept);
          endTime = performance.now();
          console.log(`--> Call to App-Context useFocusEffect took ${endTime - startTime} milliseconds.`);
        }
      }
      fetchData();
    }, [userCtx.email, updatePurchase.updateCount, updateTransaction.updateCount])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("App-Context: Updating purchase data...");
      }
      fetchData();
    }, [updatePurchase.updateCount])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("App-Context: Updating transaction data...");
      }
      fetchData();
    }, [updateTransaction.updateCount])
  );

  const triggerReloadPurchase = (month, year) => {
    setUpdatePurchase({ month: month, year: year, updateCount: updatePurchase.updateCount + 1 });
    console.log("Triggered Reload...");
  };

  const triggerReloadTransaction = (month, year) => {
    setUpdateTransaction({ month: month, year: year, updateCount: updateTransaction.updateCount + 1 });
  };

  const value = {
    purchaseTotal: purchaseTotal,
    transactionTotal: transactionTotal,
    totalExpense: expenseTotal,
    expensesByDate: expensesByDate,
    expenseByType: expensesByType,
    totalExpensesAverage: totalExpensesAverage,
    totalExpensesByTypeAverage: totalExpensesByTypeAverage,
    splitDept: splitDept,
    triggerReloadPurchase: triggerReloadPurchase,
    triggerReloadTransaction: triggerReloadTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
