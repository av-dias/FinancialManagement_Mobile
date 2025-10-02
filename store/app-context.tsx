import React, { createContext, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "./user-context";
import { logTimeTook } from "../utility/logger";
import { ExpensesService } from "../service/ExpensesService";
import { SubscriptionService } from "../service/SubscriptionService";
import { PurchaseEntity } from "./database/Purchase/PurchaseEntity";
import { TransactionEntity } from "./database/Transaction/TransactionEntity";
import { ExpenseEnum } from "../models/types";

interface AppContext {
  email: any;
}

export const AppContext = createContext<AppContext>({
  email: "",
});

const AppContextProvider = ({ children }) => {
  const expenseService = new ExpensesService();
  const subscriptionService = new SubscriptionService();

  const userCtx = useContext(UserContext);
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (userCtx.email) {
          console.log("App-Context: Fetching app data...");
          let startTime = performance.now();

          // On load check if subscriptions are up-to-date
          const currentDate = new Date();
          const subscriptions = await subscriptionService.getAllBeforeDate(
            userCtx.email,
            currentDate
          );
          let subscriptionUpdateCount = 0;

          for (const subscription of subscriptions) {
            subscription.item = subscription.item as
              | PurchaseEntity
              | TransactionEntity;
            subscription.item.id = null;
            subscription.item.date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              subscription.dayOfMonth
            )
              .toISOString()
              .split("T")[0];

            switch (subscription.entity) {
              case ExpenseEnum.Purchase: {
                await expenseService.createPurchase(
                  subscription.item as PurchaseEntity
                );
                await subscriptionService.updateLastUpdateDate(
                  userCtx.email,
                  subscription.id
                );
                subscriptionUpdateCount++;
                break;
              }
              case ExpenseEnum.Transaction: {
                await expenseService.createTransaction(
                  subscription.item as TransactionEntity
                );
                await subscriptionService.updateLastUpdateDate(
                  userCtx.email,
                  subscription.id
                );
                subscriptionUpdateCount++;
                break;
              }
              default:
                break;
            }
          }

          console.log(
            `App-Context subscription service has updated ${subscriptionUpdateCount} items.`
          );

          let endTime = performance.now();
          logTimeTook("App-Context", "Load useFocusEffect", endTime, startTime);
        }

        // Load subscription service
      }
      if (expenseService.isReady() && subscriptionService.isReady())
        fetchData();
    }, [userCtx.email, expenseService.isReady(), subscriptionService.isReady()])
  );

  const value = {
    email: userCtx.email,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
