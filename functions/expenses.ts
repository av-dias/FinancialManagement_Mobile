import { ExpensesByYear } from "../models/interfaces";
import {
  ExpenseEnum,
  ExpenseType,
  PurchaseType,
  TransactionType,
} from "../models/types";
import { IncomeEntity } from "../store/database/Income/IncomeEntity";
import { PurchaseEntity } from "../store/database/Purchase/PurchaseEntity";
import { TransactionEntity } from "../store/database/Transaction/TransactionEntity";
import { KEYS, ANALYSES_TYPE, TRANSACTION_TYPE } from "../utility/keys";

export const getExpenseDate = (
  itemSelected: PurchaseEntity | TransactionEntity | IncomeEntity
) => {
  switch (itemSelected.entity) {
    case ExpenseEnum.Purchase: {
      return new Date(itemSelected.date).getDate();
    }
    case ExpenseEnum.Transaction: {
      return new Date(itemSelected.date).getDate();
    }
    case ExpenseEnum.Income: {
      return new Date(itemSelected.doi).getDate();
    }
    default:
      null;
  }
};

export const getExpenseName = (
  itemSelected: PurchaseEntity | TransactionEntity | IncomeEntity
) => {
  switch (itemSelected?.entity) {
    case ExpenseEnum.Purchase: {
      return itemSelected.name;
    }
    case ExpenseEnum.Transaction: {
      return itemSelected.description;
    }
    case ExpenseEnum.Income: {
      return itemSelected.name;
    }
    default:
      null;
  }
};

/*
 * Load the purchase value based on Stats Type
 * If stats type is personal
 * The purchase needs to consider the spluit weight if it exists
 */
export const loadExpenseValue = (
  expense: PurchaseEntity | TransactionEntity,
  statsType = ANALYSES_TYPE.Total
) => {
  if (expense.entity === ExpenseEnum.Transaction) return expense.amount;

  if (statsType === ANALYSES_TYPE.Total) {
    return Number(expense.amount);
  } else {
    let value: number;
    if (expense.split) {
      value =
        (Number(expense.amount) * (100 - Number(expense.split.weight))) / 100;
    } else {
      value = Number(expense.amount);
    }
    return Number(value.toFixed(1));
  }
};

export const calcExpensesTotalFromType = (expenses: any) => {
  let res = { [ANALYSES_TYPE.Total]: 0, [ANALYSES_TYPE.Personal]: 0 };
  Object.keys(expenses).forEach((stats) => {
    Object.keys(expenses[stats]).forEach((type) => {
      res[stats] += expenses[stats][type];
    });
  });

  return res;
};

export const calcTransactionStats = (expenses: any) => {
  let res = {};

  // Check only transactions
  Object.keys(expenses).forEach((month) => {
    expenses[month].forEach(({ element, index, key }) => {
      if (key == KEYS.TRANSACTION) {
        element = element as TransactionType;

        let month = new Date(element.dot).getMonth();
        let year = new Date(element.dot).getFullYear();

        let value = parseFloat(element.amount);

        // Verify if year already exists
        if (!res[year]) {
          res[year] = {
            [month]: {
              [TRANSACTION_TYPE.Total]: 0,
              [TRANSACTION_TYPE["Sent"]]: 0,
              [TRANSACTION_TYPE["Received"]]: 0,
            },
          };
        }

        // Verify if month already exists
        if (!res[year][month]) {
          res[year][month] = {
            [TRANSACTION_TYPE.Total]: 0,
            [TRANSACTION_TYPE["Sent"]]: 0,
            [TRANSACTION_TYPE["Received"]]: 0,
          };
        }

        // if transaction received expenses are reduced
        if (element.user_origin_id) {
          res[year][month][TRANSACTION_TYPE.Total] -= value;
          res[year][month][TRANSACTION_TYPE["Received"]] += value;
        } else {
          res[year][month][TRANSACTION_TYPE.Total] += value;
          res[year][month][TRANSACTION_TYPE["Sent"]] += value;
        }
      }
    });
  });

  return res;
};

export const calcTotalExpensesByType = (expenses: any, year: number) => {
  let resType = {
    [year]: { [ANALYSES_TYPE.Total]: {}, [ANALYSES_TYPE.Personal]: {} },
  };

  Object.keys(expenses[year]).forEach((month) => {
    expenses[year][month].forEach(({ element, index, key }: ExpenseType) => {
      let year: number, month: number;
      if (key == KEYS.TRANSACTION) {
        element = element as TransactionType;
        month = new Date(element.dot).getMonth();
        year = new Date(element.dot).getFullYear();
      } else if (key == KEYS.PURCHASE) {
        element = element as PurchaseType;
        month = new Date(element.dop).getMonth();
        year = new Date(element.dop).getFullYear();
      } else {
        alert("Invalid Expense Element");
      }

      if (key == KEYS.TRANSACTION) {
        element = element as TransactionType;

        let value = parseFloat(element.amount);

        // Verify if type already exists
        if (
          !Object.keys(resType[year][ANALYSES_TYPE.Total]).includes(
            element.type
          )
        ) {
          resType[year][ANALYSES_TYPE.Total][element.type] = 0;
          resType[year][ANALYSES_TYPE.Personal][element.type] = 0;
        }

        // if transaction received expenses are reduced
        if (element.user_origin_id) {
          resType[year][ANALYSES_TYPE.Total][element.type] -= value;
        } else {
          resType[year][ANALYSES_TYPE.Total][element.type] += value;
          resType[year][ANALYSES_TYPE.Personal][element.type] += value;
        }
      } else if (key == KEYS.PURCHASE) {
        element = element as PurchaseType;

        // Verify if type already exists
        if (
          !Object.keys(resType[year][ANALYSES_TYPE.Total]).includes(
            element.type
          )
        ) {
          resType[year][ANALYSES_TYPE.Total][element.type] = 0;
          resType[year][ANALYSES_TYPE.Personal][element.type] = 0;
        }

        let type0Value = parseFloat(element.value);
        let type1Value = parseFloat(element.value);

        if (element.split) {
          let weight = parseFloat(element.split.weight);
          type1Value = (type0Value * (100 - weight)) / 100;
        }

        resType[year][ANALYSES_TYPE.Total][element.type] += type0Value;
        resType[year][ANALYSES_TYPE.Personal][element.type] += type1Value;
      }
    });
  });

  return resType;
};

export const updateExpenses = (expense: ExpenseType, setExpenses: any) => {
  let year: number, month: number, updatedState: any;
  setExpenses((prev: any) => {
    updatedState = { ...prev };
    if (KEYS.PURCHASE == expense.key) {
      let purchase = expense.element as PurchaseType;
      month = new Date(purchase.dop).getMonth();
      year = new Date(purchase.dop).getFullYear();
    } else if (KEYS.TRANSACTION == expense.key) {
      let transaction = expense.element as TransactionType;
      month = new Date(transaction.dot).getMonth();
      year = new Date(transaction.dot).getFullYear();
    } else {
      alert("Invalid Expense Element");
      return prev;
    }

    let index = prev[year][month].findIndex(
      (e: ExpenseType) => e.index == expense.index && e.key == expense.key
    );
    updatedState[year][month][index] = expense;

    return updatedState;
  });
};

export const addExpenses = (
  newElement: PurchaseType | TransactionType,
  key: any,
  setExpenses: any
) => {
  let year: number, month: number, index: number, updatedState: ExpensesByYear;
  setExpenses((prev: ExpensesByYear) => {
    updatedState = { ...prev };
    if (KEYS.PURCHASE == key) {
      let purchase = newElement as PurchaseType;
      month = new Date(purchase.dop).getMonth();
      year = new Date(purchase.dop).getFullYear();
      index = ++updatedState.purchaseIndex;
    } else if (KEYS.TRANSACTION == key) {
      let transaction = newElement as TransactionType;
      month = new Date(transaction.dot).getMonth();
      year = new Date(transaction.dot).getFullYear();
      index = ++updatedState.transactionIndex;
    } else {
      alert("Invalid Expense Element");
      return prev;
    }

    let expense: ExpenseType = { element: newElement, key: key, index: index };

    if (prev.hasOwnProperty(year)) {
      if (prev[year].hasOwnProperty(month)) {
        updatedState[year][month].push(expense);
      } else {
        updatedState[year][month] = [expense];
      }
    } else {
      updatedState[year] = { [month]: [expense] };
    }

    return updatedState;
  });
};
