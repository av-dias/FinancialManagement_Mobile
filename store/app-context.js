import React, { createContext, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllPurchaseStats } from "../functions/purchase";
import { getAllTransactionsStats } from "../functions/transaction";
import { getUser } from "../functions/basic";
import { UserContext } from "./user-context";
import { STATS_TYPE, TRANSACTION_TYPE, KEYS as KEYS_SERIALIZER, RELOAD_TYPE, TRIGGER_KEYS } from "../utility/keys";

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

const calcExpensesByType = (resPurchases, resTransactions) => {
  let res = {};

  resPurchases.forEach((purchase) => {
    let month = new Date(purchase.dop).getMonth();
    let year = new Date(purchase.dop).getFullYear();

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

const calcTotalExpensesByType = (resExpensesByType) => {
  let resTotal = {};

  for (let year of Object.keys(resExpensesByType)) {
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

const calcExpensesTotal = (purchases, transaction) => {
  let res = {};
  let purchaseYearList = Object.keys(purchases);
  let transactionYearList = Object.keys(transaction);

  for (year of purchaseYearList) {
    Object.keys(purchases[year]).forEach((month) => {
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
    Object.keys(transaction[year]).forEach((month) => {
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

const calcPurchaseTotal = (purchases) => {
  let res = {};

  purchases.forEach((curr) => {
    let month = new Date(curr.dop).getMonth();
    let year = new Date(curr.dop).getFullYear();

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

const calcTransactionTotal = (transactions) => {
  let res = {};

  transactions.forEach((curr) => {
    let month = new Date(curr.dot).getMonth().toString();
    let year = new Date(curr.dot).getFullYear().toString();

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

const calcSplitDept = (expenses, splitDept) => {
  let res = {};
  let expensesYearList = Object.keys(expenses);

  for (year of expensesYearList) {
    Object.keys(expenses[year]).forEach((month) => {
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
          resPurchases = await getAllPurchaseStats(userCtx.email);
          resCalcPurchaseTotal = calcPurchaseTotal(resPurchases);
          setPurchases(resPurchases);
          setPurchaseTotal(resCalcPurchaseTotal);
          let purchaseTime = performance.now();
          console.log(`--> Load Purchase useFocusEffect took ${purchaseTime - startTime} milliseconds.`);
          // TRANSACTION
          resTransactions = await getAllTransactionsStats(userCtx.email);
          resCalcTransactionTotal = calcTransactionTotal(resTransactions);
          setTransactions(resTransactions);
          setTransactionTotal(resCalcTransactionTotal);
          let transactionTime = performance.now();
          console.log(`--> Load Transaction useFocusEffect took ${transactionTime - purchaseTime} milliseconds.`);
          // EXPENSES
          let resGroupedExpensesByDate = groupExpensesByDate(resPurchases, resTransactions);
          setExpensesByDate(resGroupedExpensesByDate);
          let resExpensesTotal = calcExpensesTotal(resCalcPurchaseTotal, resCalcTransactionTotal);
          setExpenseTotal(resExpensesTotal);
          let resExpensesByType = calcExpensesByType(resPurchases, resTransactions);
          setExpensesByType(resExpensesByType);
          let resTotalExpensesByType = calcTotalExpensesByType(resExpensesByType);
          setTotalExpensesByType(resTotalExpensesByType);
          let expensesTime = performance.now();
          console.log(`--> Load Expenses useFocusEffect took ${expensesTime - transactionTime} milliseconds.`);
          // AVERAGE
          let resExpensesTotalAverage = calcExpensesTotalAverage(resExpensesTotal);
          setTotalExpensesAverage(resExpensesTotalAverage);
          let resExpensesByTypeAverage = calcExpensesByTypeAverage(resExpensesByType);
          setTotalExpensesByTypeAverage(resExpensesByTypeAverage);
          let averageTime = performance.now();
          console.log(`--> Load Average useFocusEffect took ${averageTime - expensesTime} milliseconds.`);
          // SPLIT
          let resSplitDept = calcSplitDept(resExpensesTotal);
          setSplitDept(resSplitDept);
          let splitTime = performance.now();
          console.log(`--> Load Split useFocusEffect took ${splitTime - averageTime} milliseconds.`);
          setUpdatePurchase(false);
          setUpdateTransaction(false);
          console.log(`-----> Load useFocusEffect took ${performance.now() - startTime} milliseconds.`);
          setReload((prev) => !prev);
        }
      }
      fetchData();
    }, [userCtx.email])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (userCtx.email) {
          console.log("App-Context Update: Fetching app data...");
          startTime = performance.now();

          let resPurchases, resTransactions;
          // PURCHASE
          if (updatePurchase) {
            resPurchases = await getAllPurchaseStats(userCtx.email);
          } else {
            resPurchases = purchases;
          }
          let purchaseTime = performance.now();
          console.log(`--> Load Purchase useFocusEffect took ${purchaseTime - startTime} milliseconds.`);
          // TRANSACTION
          if (updateTransaction) {
            resTransactions = await getAllTransactionsStats(userCtx.email);
          } else {
            resTransactions = transactions;
          }
          let transactionTime = performance.now();
          console.log(`--> Load Transaction useFocusEffect took ${transactionTime - purchaseTime} milliseconds.`);

          // EXPENSES
          let resGroupedExpensesByDate = groupExpensesByDate(resPurchases, resTransactions);
          setExpensesByDate(resGroupedExpensesByDate);

          console.log(update.trigger);
          if (update.trigger[TRIGGER_KEYS[1]] == RELOAD_TYPE[0]) {
            // Add
            console.log("Add");
          } else if (update.trigger[TRIGGER_KEYS[1]] == RELOAD_TYPE[1]) {
            // Update
            console.log("Update");
            let curr = update.trigger[TRIGGER_KEYS[2]];
            let prev = update.trigger[TRIGGER_KEYS[3]];
            let index = update.trigger[TRIGGER_KEYS[2]].index;
            console.log(purchases[index]);
          } else if (update.trigger[TRIGGER_KEYS[1]] == RELOAD_TYPE[2]) {
            // Delete
            console.log("Delete");
          } else if (update.trigger[TRIGGER_KEYS[1]] == RELOAD_TYPE[3]) {
            // Split
            console.log("Split");
            let value = update.trigger[TRIGGER_KEYS[2]].value;
            let type = update.trigger[TRIGGER_KEYS[2]].type;
            let index = update.trigger[TRIGGER_KEYS[2]].index;
            console.log(purchases[index]);
          }

          endTime = performance.now();
          console.log(`--> Load useFocusEffect took ${endTime - startTime} milliseconds.`);
          setUpdatePurchase(false);
          setUpdateTransaction(false);
          setReload((prev) => !prev);
        }
      }
      fetchData();
    }, [update.updateCount])
  );

  // (month, year, refreshTrigger);
  // {key: _key, type: RELOAD_TYPE, curr: _curr, prev:_prev}

  const triggerReloadPurchase = (month, year, trigger) => {
    setUpdatePurchase(true);
    setUpdate({ month: month, year: year, updateCount: update.updateCount + 1, trigger: trigger });
    console.log("Triggered Purchase Reload...");
  };

  const triggerReloadTransaction = (month, year, trigger) => {
    setUpdateTransaction(true);
    setUpdate({ month: month, year: year, updateCount: update.updateCount + 1, trigger: trigger });
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
