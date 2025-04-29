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
  trigger: any;
  purge: any;
  purchase: any;
  transaction: any;
  setRefresh: any;
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
  trigger: {},
  purge: {},
  purchase: {},
  transaction: {},
  setRefresh: {},
});

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
  const [triggerMigration, setTriggerMigration] = useState(false);
  const [purchaseProgress, setPurchaseProgress] = useState({ total: 0, current: 0, migration: 0 });
  const [transactionProgress, setTransactionProgress] = useState({ total: 0, current: 0, migration: 0 });
  const [triggerPurge, setTriggerPurge] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
          let resTransactions = await getAllTransactionsStats(userCtx.email);
          let transactionSucceeded = [];
          let purchaseTime;

          let migratedPList = [];
          let migratedTList = [];

          if (triggerMigration || triggerPurge || refresh) {
            try {
              migratedPList = JSON.parse(await getFromStorage(STORAGE_KEYS.MIGRATION_PURCHASE, userCtx.email));
              setPurchaseProgress({ current: 0, total: resPurchases.length, migration: migratedPList.length });
            } catch (e) {
              console.log(e);
            }

            try {
              migratedTList = JSON.parse(await getFromStorage(STORAGE_KEYS.MIGRATION_TRANSACTION, userCtx.email));
              setTransactionProgress({ current: 0, total: resTransactions.length, migration: migratedTList.length });
            } catch (e) {
              console.log(e);
            }
            setRefresh(false);
          }

          if (triggerMigration) {
            // purchase migration process
            //alert("Migration process triggered!");

            let pIndex = 0;
            console.log(migratedPList);
            console.log("Start purchase migration.");
            for (let p of resPurchases) {
              try {
                if (!migratedPList.includes(pIndex.toString())) {
                  console.log(p);
                  const isSucc = await transferPurchase(userCtx.email, p as PurchaseType, expenseService);
                  if (isSucc) {
                    purchaseSucceeded.push(pIndex.toString());
                  }
                  pIndex++;
                  setPurchaseProgress({ ...purchaseProgress, current: pIndex });
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
            purchaseTime = performance.now();
            logTimeTook("App-Context", "Load Purchase", purchaseTime, startTime);

            // TRANSACTION
            // [Year][Month]
            // Index

            let tIndex = 0;
            console.log(migratedTList);
            console.log("Start transaction migration.");
            for (let t of resTransactions) {
              try {
                if (!migratedTList.includes(tIndex.toString())) {
                  console.log(t);
                  const isSucc = await transferTransaction(userCtx.email, t as TransactionType, expenseService);
                  if (isSucc) {
                    transactionSucceeded.push(tIndex.toString());
                  }
                  tIndex++;
                  setTransactionProgress({ ...transactionProgress, current: tIndex });
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
            setTriggerMigration(false);
          }

          if (triggerPurge) {
            // IN CASE DATABASE PURGE IS REQUIRED
            await saveToStorage(STORAGE_KEYS.MIGRATION_TRANSACTION, JSON.stringify([]), userCtx.email);
            await saveToStorage(STORAGE_KEYS.MIGRATION_PURCHASE, JSON.stringify([]), userCtx.email);

            alert("Migration data was purged, please retry migration process now.");
            setTriggerPurge(false);
          }

          setTransactions(loadTransactions(resTransactions, resExpense));
          let transactionTime = performance.now();
          logTimeTook("App-Context", "Load Transaction", transactionTime, purchaseTime);

          setExpenses(resExpense);
          let endTime = performance.now();
          logTimeTook("App-Context", "Load useFocusEffect", endTime, startTime);
        }
      }
      if (expenseService.isReady()) fetchData();
    }, [userCtx.email, expenseService.isReady(), triggerMigration, triggerPurge, refresh])
  );

  const value = {
    email: userCtx.email,
    expenses: expenses,
    setExpenses: setExpenses,
    trigger: { triggerMigration, setTriggerMigration },
    purge: { triggerPurge, setTriggerPurge },
    purchase: { purchaseProgress, setPurchaseProgress },
    transaction: { transactionProgress, setTransactionProgress },
    setRefresh: setRefresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
