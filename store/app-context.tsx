import React, { createContext, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAllPurchaseStats } from "../functions/purchase";
import { getAllTransactionsStats } from "../functions/transaction";
import { UserContext } from "./user-context";
import { ANALYSES_TYPE, TRANSACTION_TYPE, KEYS as KEYS_SERIALIZER, KEYS } from "../utility/keys";
import { KEYS as STORAGE_KEYS } from "../utility/storageKeys";
import { ExpenseType, PurchaseType, TransactionType } from "../models/types";
import { ExpensesByYear } from "../models/interfaces";
import { logTimeTook } from "../utility/logger";
import { addToStorage, getFromStorage, saveToStorage } from "../functions/secureStorage";
import { transferPurchase, transferTransaction } from "../pages/list/handler";
import { ExpensesService } from "../service/ExpensesService";

interface AppContext {
  email: any;
  expenses: any;
  setExpenses: any;
}

/* 
  Expenses
  {
    year: { month: Expenses[] }
    ...
    purchaseIndex: number,
    transactionIndex: number,
  }
*/
export const AppContext = createContext<AppContext>({
  email: "",
  expenses: {},
  setExpenses: () => {},
});

const calcExpensesByType = (resPurchases, resTransactions) => {
  let res = {};

  resPurchases.forEach((purchase) => {
    let month = new Date(purchase.dop).getMonth();
    let year = new Date(purchase.dop).getFullYear();

    let curr = purchase;

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(res[year][month][ANALYSES_TYPE.Total]).includes(curr.type)) {
      res[year][month][ANALYSES_TYPE.Total][curr.type] = 0;
      res[year][month][ANALYSES_TYPE.Personal][curr.type] = 0;
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) type1Value = (type0Value * (100 - parseFloat(curr.split.weight))) / 100;

    res[year][month][ANALYSES_TYPE.Total][curr.type] += type0Value;
    res[year][month][ANALYSES_TYPE.Personal][curr.type] += type1Value;
  });

  resTransactions.forEach((transaction) => {
    let month = new Date(transaction.dot).getMonth();
    let year = new Date(transaction.dot).getFullYear();

    let curr = transaction;
    let value = parseFloat(curr.amount);

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} };
    }

    // Verify if type already exists
    if (!Object.keys(res[year][month][ANALYSES_TYPE.Total]).includes(curr.type)) {
      res[year][month][ANALYSES_TYPE.Total][curr.type] = 0;
      res[year][month][ANALYSES_TYPE.Personal][curr.type] = 0;
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      res[year][month][ANALYSES_TYPE.Total][curr.type] -= value;
    } else {
      res[year][month][ANALYSES_TYPE.Total][curr.type] += value;
      res[year][month][ANALYSES_TYPE.Personal][curr.type] += value;
    }
  });

  return res;
};

const calcTotalExpensesByType = (resExpensesByType) => {
  let resTotal = {};

  for (let year of Object.keys(resExpensesByType)) {
    for (let month of Object.keys(resExpensesByType[year])) {
      for (let type of Object.keys(resExpensesByType[year][month][ANALYSES_TYPE.Total])) {
        if (!resTotal[year]) {
          resTotal[year] = { [type]: 0 };
        }

        if (!resTotal[year][type]) {
          resTotal[year][type] = 0;
        }

        resTotal[year][type] += resExpensesByType[year][month][ANALYSES_TYPE.Total][type];
      }
    }
  }
  return resTotal;
};

const calcExpensesTotal = (purchases, transaction) => {
  let res = {};
  let purchaseYearList = Object.keys(purchases);
  let transactionYearList = Object.keys(transaction);

  for (const year of purchaseYearList) {
    Object.keys(purchases[year]).forEach((month) => {
      let curr = purchases[year][month];

      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 } };
      }

      // Verify if month already exists
      if (!res[year][month]) {
        res[year][month] = { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 };
      }

      res[year][month][ANALYSES_TYPE.Total] += parseFloat(curr[ANALYSES_TYPE.Total]);
      res[year][month][ANALYSES_TYPE.Personal] += parseFloat(curr[ANALYSES_TYPE.Personal]);
    });
  }

  for (const year of transactionYearList) {
    Object.keys(transaction[year]).forEach((month) => {
      let curr = transaction[year][month];

      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 } };
      }

      // Verify if month already exists
      if (!res[year][month]) {
        res[year][month] = { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 };
      }

      res[year][month][ANALYSES_TYPE.Total] += parseFloat(curr[TRANSACTION_TYPE.Total]);
      res[year][month][ANALYSES_TYPE.Personal] += parseFloat(curr[TRANSACTION_TYPE.Sent]);
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
      res[year] = { [month]: { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 };
    }

    let type0Value = parseFloat(curr.value);
    let type1Value = parseFloat(curr.value);

    if (curr.split) {
      type1Value = (type0Value * (100 - parseFloat(curr.split.weight))) / 100;
    }

    res[year][month][ANALYSES_TYPE.Total] += type0Value;
    res[year][month][ANALYSES_TYPE.Personal] += type1Value;
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
      res[year] = { [month]: { [TRANSACTION_TYPE.Total]: 0, [TRANSACTION_TYPE.Sent]: 0, [TRANSACTION_TYPE.Received]: 0 } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [TRANSACTION_TYPE.Total]: 0, [TRANSACTION_TYPE.Sent]: 0, [TRANSACTION_TYPE.Received]: 0 };
    }

    // if transaction received expenses are reduced
    if (curr.user_origin_id) {
      res[year][month][TRANSACTION_TYPE.Total] -= value;
      res[year][month][TRANSACTION_TYPE.Received] += value;
    } else {
      res[year][month][TRANSACTION_TYPE.Total] += value;
      res[year][month][TRANSACTION_TYPE.Sent] += value;
    }
  });

  return res;
};

const calcExpensesTotalAverage = (expenses) => {
  let expensesAverage = {};
  let expensesYearList: string[] = Object.keys(expenses);
  for (const year of expensesYearList) {
    let monthCount = 0;
    Object.keys(expenses[year]).forEach((month) => {
      monthCount++;

      // Verify if year already exists
      if (!expensesAverage[year]) {
        expensesAverage[year] = { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 };
      }

      expensesAverage[year][ANALYSES_TYPE.Total] += expenses[year][month][ANALYSES_TYPE.Total];
      expensesAverage[year][ANALYSES_TYPE.Personal] += expenses[year][month][ANALYSES_TYPE.Personal];
    });
    expensesAverage[year][ANALYSES_TYPE.Total] /= monthCount;
    expensesAverage[year][ANALYSES_TYPE.Personal] /= monthCount;
  }
  return expensesAverage;
};

const calcExpensesByTypeAverage = (expenses) => {
  let expensesByTypeAverage = {};
  let expensesYearList = Object.keys(expenses);
  for (const year of expensesYearList) {
    let monthCount = 0;
    Object.keys(expenses[year]).forEach((month) => {
      monthCount++;

      // Verify if year already exists
      if (!expensesByTypeAverage[year]) {
        expensesByTypeAverage[year] = { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} };
      }

      let elementStatsList = Object.keys(expenses[year][month]);
      for (const stats of elementStatsList) {
        let elementTypeList = Object.keys(expenses[year][month][stats]);
        for (const type of elementTypeList) {
          // Verify if type already exists
          if (!expensesByTypeAverage[year][stats][type]) expensesByTypeAverage[year][stats][type] = 0;

          expensesByTypeAverage[year][stats][type] += expenses[year][month][stats][type];
        }
      }
    });

    for (const stats of Object.keys(expensesByTypeAverage[year])) {
      let elementTypeList = Object.keys(expensesByTypeAverage[year][stats]);
      for (const type of elementTypeList) {
        expensesByTypeAverage[year][stats][type] /= monthCount;
      }
    }
  }
  return expensesByTypeAverage;
};

const calcSplitDept = (expenses, splitDept) => {
  let res = {};
  let expensesYearList = Object.keys(expenses);

  for (const year of expensesYearList) {
    Object.keys(expenses[year]).forEach((month) => {
      // Verify if year already exists
      if (!res[year]) {
        res[year] = { [month]: 0 };
      }

      res[year][month] = expenses[year][month][ANALYSES_TYPE.Total] - expenses[year][month][ANALYSES_TYPE.Personal];
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

const loadPurchases = (purchases: PurchaseType[], expenses: ExpensesByYear) => {
  let resPurchases = {};
  let lastIndex = 0;

  purchases.forEach((curr: PurchaseType, index) => {
    let year = new Date(curr.dop).getFullYear();
    let month = new Date(curr.dop).getMonth();

    if (!resPurchases[year]) resPurchases[year] = { [month]: [] };
    if (!resPurchases[year][month]) resPurchases[year][month] = [];

    resPurchases[year][month].push(curr);

    if (!expenses[year]) expenses[year] = { [month]: [] };
    if (!expenses[year][month]) expenses[year][month] = [];

    let e: ExpenseType = { index: index, key: KEYS.PURCHASE, element: curr };
    expenses[year][month].push(e);
    lastIndex = index;
  });

  expenses.purchaseIndex = lastIndex;
  return resPurchases;
};

const loadTransactions = (transactions: TransactionType[], expenses: ExpensesByYear) => {
  let resTransactions = {};
  let lastIndex = 0;

  transactions.forEach((curr: TransactionType, index) => {
    let year = new Date(curr.dot).getFullYear();
    let month = new Date(curr.dot).getMonth();

    if (!resTransactions[year]) resTransactions[year] = { month: [] };
    if (!resTransactions[year][month]) resTransactions[year][month] = [];

    resTransactions[year][month].push(curr);

    if (!expenses[year]) expenses[year] = { [month]: [] };
    if (!expenses[year][month]) expenses[year][month] = [];

    let e: ExpenseType = { index: index, key: KEYS.TRANSACTION, element: curr };
    expenses[year][month].push(e);
    lastIndex = index;
  });

  expenses.transactionIndex = lastIndex;
  return resTransactions;
};

/*
  TODO: Performance Improvement
  In the future we may want to load just data from the current year
  And remove those from purchase and transaction
  Keeping only there the data not loaded into Expenses
*/

const AppContextProvider = ({ children }) => {
  const [purchases, setPurchases] = useState({});
  const [transactions, setTransactions] = useState({});
  const [expenses, setExpenses] = useState({});
  const expenseService = new ExpensesService();

  const userCtx = useContext(UserContext);
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (userCtx.email) {
          let resExpense = { [new Date().getFullYear()]: { [new Date().getMonth()]: [] }, purchaseIndex: 0, transactionIndex: 0 };
          console.log("App-Context: Fetching app data...");
          let startTime = performance.now();
          // PURCHASE
          // [Year][Month]
          // Index
          let resPurchases = await getAllPurchaseStats(userCtx.email);
          let purchaseSucceeded = [];

          // purchase migration process
          let migratedPList = [];
          try {
            migratedPList = JSON.parse(await getFromStorage(STORAGE_KEYS.MIGRATION_PURCHASE, userCtx.email));
          } catch (e) {
            console.log(e);
          }

          let pIndex = 0;
          console.log(migratedPList);
          for (let p of resPurchases) {
            try {
              if (!migratedPList.includes(pIndex.toString())) {
                console.log(p);
                await transferPurchase(userCtx.email, p as PurchaseType, expenseService);
                purchaseSucceeded.push(pIndex.toString());
                pIndex++;
              }
            } catch (e) {
              alert("Purchase migration failedd: " + pIndex);
              console.log("Purchase migration failed: " + pIndex);
            }
          }
          console.log(purchaseSucceeded);
          await addToStorage(STORAGE_KEYS.MIGRATION_PURCHASE, JSON.stringify(purchaseSucceeded), userCtx.email);
          // * END PURCHASE

          setPurchases(loadPurchases(resPurchases, resExpense));
          let purchaseTime = performance.now();
          logTimeTook("App-Context", "Load Purchase", purchaseTime, startTime);
          // TRANSACTION
          // [Year][Month]
          // Index
          let resTransactions = await getAllTransactionsStats(userCtx.email);
          let transactionSucceeded = [];

          // purchase migration process
          let migratedTList = [];
          try {
            migratedTList = JSON.parse(await getFromStorage(STORAGE_KEYS.MIGRATION_TRANSACTION, userCtx.email));
          } catch (e) {
            console.log(e);
          }
          let tIndex = 0;
          console.log(migratedTList);
          for (let t of resTransactions) {
            try {
              if (!migratedTList.includes(tIndex.toString())) {
                console.log(t);
                await transferTransaction(userCtx.email, t as TransactionType, expenseService);
                transactionSucceeded.push(tIndex.toString());
                tIndex++;
              }
            } catch (e) {
              alert("Transaction migration failed: " + tIndex);
              console.log("Transaction migration failed: " + tIndex);
            }
          }
          console.log(transactionSucceeded);
          await addToStorage(STORAGE_KEYS.MIGRATION_TRANSACTION, JSON.stringify(transactionSucceeded), userCtx.email);
          // * END TRANSACTION

          // Notify the user that the transaction process has been completed
          alert(
            `Migration Purchase - Initial: ${migratedPList.length} Finish: ${purchaseSucceeded.length}\nMigration Transaction - Initial: ${migratedTList.length} Finish: ${transactionSucceeded.length}`
          );

          /* // IN CASE DATABASE PURGE IS REQUIRED

          await saveToStorage(STORAGE_KEYS.MIGRATION_TRANSACTION, JSON.stringify([]), userCtx.email);
          await saveToStorage(STORAGE_KEYS.MIGRATION_PURCHASE, JSON.stringify([]), userCtx.email);

          console.log("CLEANED"); */

          setTransactions(loadTransactions(resTransactions, resExpense));
          let transactionTime = performance.now();
          logTimeTook("App-Context", "Load Transaction", transactionTime, purchaseTime);

          setExpenses(resExpense);
          let endTime = performance.now();
          logTimeTook("App-Context", "Load useFocusEffect", endTime, startTime);
        }
      }
      if (expenseService.isReady()) fetchData();
    }, [userCtx.email, expenseService.isReady()])
  );

  const value = {
    email: userCtx.email,
    expenses: expenses,
    setExpenses: setExpenses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
