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
  totalExpensesByType: {},
  totalExpensesAverage: {},
  totalExpensesByTypeAverage: {},
  splitDept: {},
  reload: false,
});

const calcExpensesByType = (resPurchases, resTransactions, expensesByType, update) => {
  let res = { ...expensesByType };

  // If updating clear data from that year and month
  if (update.month && update.year) {
    res[update.year][update.month] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
  }

  resPurchases.forEach((purchase) => {
    let month = new Date(purchase.dop).getMonth();
    let year = new Date(purchase.dop).getFullYear();

    if (update.month && update.year && (month != update.month || year != update.year)) return;

    let curr = purchase;

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(res[year][month][STATS_TYPE[0]]).includes(curr.type)) {
      res[year][month][STATS_TYPE[0]][curr.type] = 0;
      res[year][month][STATS_TYPE[1]][curr.type] = 0;
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) type1Value = parseFloat((type0Value * (100 - curr.split.weight)) / 100);

    res[year][month][STATS_TYPE[0]][curr.type] += type0Value;
    res[year][month][STATS_TYPE[1]][curr.type] += type1Value;
  });

  resTransactions.forEach((transaction) => {
    let month = new Date(transaction.dot).getMonth();
    let year = new Date(transaction.dot).getFullYear();

    if (update.month && update.year && (month != update.month || year != update.year)) return;

    let curr = transaction;
    let value = parseFloat(curr.amount);

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(res[year][month][STATS_TYPE[0]]).includes(curr.type)) {
      res[year][month][STATS_TYPE[0]][curr.type] = 0;
      res[year][month][STATS_TYPE[1]][curr.type] = 0;
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      res[year][month][STATS_TYPE[0]][curr.type] -= value;
    } else {
      res[year][month][STATS_TYPE[0]][curr.type] += value;
      res[year][month][STATS_TYPE[1]][curr.type] += value;
    }
  });

  return res;
};

const calcTotalExpensesByType = (resExpensesByType, totalExpensesByType, update) => {
  let resTotal = { ...totalExpensesByType };

  // If updating clear data from that year and month
  if (update.month && update.year) {
    resTotal[update.year] = {};
  }

  for (let year of Object.keys(resExpensesByType)) {
    if (update.year && year != update.year) continue;
    for (let month of Object.keys(resExpensesByType[year])) {
      for (let type of Object.keys(resExpensesByType[year][month][STATS_TYPE[0]])) {
        if (!resTotal[year]) {
          resTotal[year] = { [type]: 0 };
        }

        if (!resTotal[year][type]) {
          resTotal[year][type] = 0;
        }

        resTotal[year][type] += resExpensesByType[year][month][STATS_TYPE[0]][type];
      }
    }
  }
  return resTotal;
};

const calcExpensesTotal = (purchases, transaction, expenses, update) => {
  let res = { ...expenses };
  let purchaseYearList = Object.keys(purchases);
  let transactionYearList = Object.keys(transaction);

  // If updating clear data from that year and month
  if (update.month && update.year) {
    res[update.year][update.month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
  }

  for (year of purchaseYearList) {
    if (update.year && year != update.year) continue;
    Object.keys(purchases[year]).forEach((month) => {
      if (update.month && month != update.month) return;

      let curr = purchases[year][month];

      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
      }

      // Verify if month already exists
      if (!res[year][month]) {
        res[year][month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
      }

      res[year][month][STATS_TYPE[0]] += parseFloat(curr[STATS_TYPE[0]]);
      res[year][month][STATS_TYPE[1]] += parseFloat(curr[STATS_TYPE[1]]);
    });
  }

  for (year of transactionYearList) {
    if (update.year && year != update.year) continue;
    Object.keys(transaction[year]).forEach((month) => {
      if (update.month && month != update.month) return;

      let curr = transaction[year][month];

      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
      }

      // Verify if month already exists
      if (!res[year][month]) {
        res[year][month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
      }

      res[year][month][STATS_TYPE[0]] += parseFloat(curr[TRANSACTION_TYPE[0]]);
      res[year][month][STATS_TYPE[1]] += parseFloat(curr[TRANSACTION_TYPE[1]]);
    });
  }

  return res;
};

const calcPurchaseTotal = (purchases, purchaseTotal, update) => {
  let res = { ...purchaseTotal };
  // If updating clear data from that year and month
  if (update.month && update.year) {
    res[update.year][update.month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
  }
  purchases.forEach((curr) => {
    let month = new Date(curr.dop).getMonth();
    let year = new Date(curr.dop).getFullYear();

    if (update.month && update.year && (month != update.month || year != update.year)) return;

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) {
      type1Value = parseFloat((type0Value * (100 - curr.split.weight)) / 100);
    }

    res[year][month][STATS_TYPE[0]] += type0Value;
    res[year][month][STATS_TYPE[1]] += type1Value;
  });

  return res;
};

const calcTransactionTotal = (transactions, transactionTotal, update) => {
  let res = { ...transactionTotal };

  // If updating clear data from that year and month
  if (update.month && update.year) {
    res[update.year][update.month] = { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 };
  }

  transactions.forEach((curr) => {
    let month = new Date(curr.dot).getMonth().toString();
    let year = new Date(curr.dot).getFullYear().toString();

    if (update.month && update.year && (month != update.month || year != update.year)) return;

    let value = parseFloat(curr.amount);

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 };
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      res[year][month][TRANSACTION_TYPE[0]] -= value;
      res[year][month][TRANSACTION_TYPE[2]] += value;
    } else {
      res[year][month][TRANSACTION_TYPE[0]] += value;
      res[year][month][TRANSACTION_TYPE[1]] += value;
    }
  });

  return res;
};

const calcExpensesTotalAverage = (expenses, update) => {
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

const calcExpensesByTypeAverage = (expenses, update) => {
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

const calcSplitDept = (expenses, splitDept, update) => {
  let res = { ...splitDept };
  let expensesYearList = Object.keys(expenses);

  // If updating clear data from that year and month
  if (update.month && update.year) {
    res[update.year][update.month] = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
  }

  for (year of expensesYearList) {
    if (update.year && update.year != year) continue;
    Object.keys(expenses[year]).forEach((month) => {
      if (update.month && month != update.month) return;

      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: 0 };
      }

      res[year][month] = expenses[year][month][STATS_TYPE[0]] - expenses[year][month][STATS_TYPE[1]];
    });
  }
  return res;
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
  const [totalExpensesByType, setTotalExpensesByType] = useState({});
  const [totalExpensesAverage, setTotalExpensesAverage] = useState({});
  const [totalExpensesByTypeAverage, setTotalExpensesByTypeAverage] = useState({});
  const [splitDept, setSplitDept] = useState({});
  const [update, setUpdate] = useState({ updateCount: 0 });
  const [updatePurchase, setUpdatePurchase] = useState(true);
  const [updateTransaction, setUpdateTransaction] = useState(true);
  const [reload, setReload] = useState(true);

  const userCtx = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (userCtx.email) {
          console.log("App-Context: Fetching app data...");
          startTime = performance.now();
          let resPurchases, resCalcPurchaseTotal, resTransactions, resCalcTransactionTotal;
          // PURCHASE
          if (updatePurchase) {
            resPurchases = await getAllPurchaseStats(userCtx.email);
            resCalcPurchaseTotal = calcPurchaseTotal(resPurchases, purchaseTotal, update);
          } else {
            resPurchases = purchases;
            resCalcPurchaseTotal = purchaseTotal;
            console.log("App-Context: Using purchase data cache...");
          }
          setPurchases(resPurchases);
          setPurchaseTotal(resCalcPurchaseTotal);
          // TRANSACTION
          if (updateTransaction) {
            resTransactions = await getAllTransactionsStats(userCtx.email);
            resCalcTransactionTotal = calcTransactionTotal(resTransactions, transactionTotal, update);
          } else {
            resTransactions = transactions;
            resCalcTransactionTotal = transactionTotal;
            console.log("App-Context: Using transaction data cache...");
          }
          setTransactions(resTransactions);
          setTransactionTotal(resCalcTransactionTotal);
          // EXPENSES
          let resGroupedExpensesByDate = groupExpensesByDate(resPurchases, resTransactions);
          setExpensesByDate(resGroupedExpensesByDate);
          let resExpensesTotal = calcExpensesTotal(resCalcPurchaseTotal, resCalcTransactionTotal, expenseTotal, update);
          setExpenseTotal(resExpensesTotal);
          let resExpensesByType = calcExpensesByType(resPurchases, resTransactions, expensesByType, update);
          setExpensesByType(resExpensesByType);
          let resTotalExpensesByType = calcTotalExpensesByType(resExpensesByType, totalExpensesByType, update);
          setTotalExpensesByType(resTotalExpensesByType);
          // EXPENSES AVERAGE
          let resExpensesTotalAverage = calcExpensesTotalAverage(resExpensesTotal, update);
          setTotalExpensesAverage(resExpensesTotalAverage);
          let resExpensesByTypeAverage = calcExpensesByTypeAverage(resExpensesByType, update);
          setTotalExpensesByTypeAverage(resExpensesByTypeAverage);
          // SPLIT
          let resSplitDept = calcSplitDept(resExpensesTotal, splitDept, update);
          setSplitDept(resSplitDept);
          endTime = performance.now();
          console.log(`--> Call to App-Context useFocusEffect took ${endTime - startTime} milliseconds.`);
          setUpdatePurchase(false);
          setUpdateTransaction(false);
          setReload((prev) => !prev);
        }
      }
      fetchData();
    }, [userCtx.email, update.updateCount])
  );

  const triggerReloadPurchase = (month, year) => {
    setUpdatePurchase(true);
    setUpdate({ month: month, year: year, updateCount: update.updateCount + 1 });
    console.log("Triggered Purchase Reload...");
  };

  const triggerReloadTransaction = (month, year) => {
    setUpdateTransaction(true);
    setUpdate({ month: month, year: year, updateCount: update.updateCount + 1 });
    console.log("Triggered Transaction Reload...");
  };

  const value = {
    email: userCtx.email,
    purchaseTotal: purchaseTotal,
    transactionTotal: transactionTotal,
    totalExpense: expenseTotal,
    expensesByDate: expensesByDate,
    expenseByType: expensesByType,
    totalExpensesByType: totalExpensesByType,
    totalExpensesAverage: totalExpensesAverage,
    totalExpensesByTypeAverage: totalExpensesByTypeAverage,
    splitDept: splitDept,
    triggerReloadPurchase: triggerReloadPurchase,
    triggerReloadTransaction: triggerReloadTransaction,
    reload: reload,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
