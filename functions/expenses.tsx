import { ExpensesByYear } from "../models/interfaces";
import { Expense, Purchase, Transaction } from "../models/types";
import { KEYS, STATS_TYPE, TRANSACTION_TYPE } from "../utility/keys";

export const calcExpensesByType = (expenses: Expense[]) => {
  let res = {};

  expenses.forEach(({ element, index, key }) => {
    let year: number, month: number;
    if (key == KEYS.TRANSACTION) {
      element = element as Transaction;
      month = new Date(element.dot).getMonth();
      year = new Date(element.dot).getFullYear();
    } else if (key == KEYS.PURCHASE) {
      element = element as Purchase;
      month = new Date(element.dop).getMonth();
      year = new Date(element.dop).getFullYear();
    } else {
      alert("Invalid Expense Element");
    }

    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
    }

    // Verify if month already exists
    if (!res[year][month]) {
      res[year][month] = { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} };
    }

    if (key == KEYS.TRANSACTION) {
      element = element as Transaction;

      let value = parseFloat(element.amount);

      // Verify if type already exists
      if (!Object.keys(res[year][month][STATS_TYPE[0]]).includes(element.type)) {
        res[year][month][STATS_TYPE[0]][element.type] = 0;
        res[year][month][STATS_TYPE[1]][element.type] = 0;
      }

      // if transaction received expenses are reduced
      if (element.user_origin_id) {
        res[year][month][STATS_TYPE[0]][element.type] -= value;
      } else {
        res[year][month][STATS_TYPE[0]][element.type] += value;
        res[year][month][STATS_TYPE[1]][element.type] += value;
      }
    } else if (key == KEYS.PURCHASE) {
      element = element as Purchase;

      // Verify if type already exists
      if (!Object.keys(res[year][month][STATS_TYPE[0]]).includes(element.type)) {
        res[year][month][STATS_TYPE[0]][element.type] = 0;
        res[year][month][STATS_TYPE[1]][element.type] = 0;
      }

      let type0Value = parseFloat(element.value);
      let type1Value = parseFloat(element.value);

      if (element.split) {
        let weight = parseFloat(element.split.weight);
        type1Value = (type0Value * (100 - weight)) / 100;
      }

      res[year][month][STATS_TYPE[0]][element.type] += type0Value;
      res[year][month][STATS_TYPE[1]][element.type] += type1Value;
    }
  });

  return res;
};

export const calcExpensesTotalFromType = (expenses: any) => {
  let res = { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 };
  Object.keys(expenses).forEach((stats) => {
    Object.keys(expenses[stats]).forEach((type) => {
      res[stats] += expenses[stats][type];
    });
  });

  return res;
};

export const calcExpensesAverage = (expenses: any, year: number) => {
  let resTotal = { [year]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
  let resType = { [year]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };
  let monthCount = Object.keys(expenses[year]).length;

  Object.keys(expenses[year]).forEach((month) => {
    expenses[year][month].forEach(({ element, index, key }: Expense) => {
      let year: number, month: number;
      if (key == KEYS.TRANSACTION) {
        element = element as Transaction;
        month = new Date(element.dot).getMonth();
        year = new Date(element.dot).getFullYear();
      } else if (key == KEYS.PURCHASE) {
        element = element as Purchase;
        month = new Date(element.dop).getMonth();
        year = new Date(element.dop).getFullYear();
      } else {
        alert("Invalid Expense Element");
      }

      if (key == KEYS.TRANSACTION) {
        element = element as Transaction;

        let value = parseFloat(element.amount);

        // Verify if type already exists
        if (!Object.keys(resType[year][STATS_TYPE[0]]).includes(element.type)) {
          resType[year][STATS_TYPE[0]][element.type] = 0;
          resType[year][STATS_TYPE[1]][element.type] = 0;
        }

        // if transaction received expenses are reduced
        if (element.user_origin_id) {
          resType[year][STATS_TYPE[0]][element.type] -= value;
          resTotal[year][STATS_TYPE[0]] -= value;
        } else {
          resType[year][STATS_TYPE[0]][element.type] += value;
          resTotal[year][STATS_TYPE[0]] += value;
          resType[year][STATS_TYPE[1]][element.type] += value;
          resTotal[year][STATS_TYPE[0]] += value;
        }
      } else if (key == KEYS.PURCHASE) {
        element = element as Purchase;

        // Verify if type already exists
        if (!Object.keys(resType[year][STATS_TYPE[0]]).includes(element.type)) {
          resType[year][STATS_TYPE[0]][element.type] = 0;
          resType[year][STATS_TYPE[1]][element.type] = 0;
        }

        let type0Value = parseFloat(element.value);
        let type1Value = parseFloat(element.value);

        if (element.split) {
          let weight = parseFloat(element.split.weight);
          type1Value = (type0Value * (100 - weight)) / 100;
        }

        resType[year][STATS_TYPE[0]][element.type] += type0Value;
        resType[year][STATS_TYPE[1]][element.type] += type1Value;
        resTotal[year][STATS_TYPE[0]] += type0Value;
        resTotal[year][STATS_TYPE[1]] += type1Value;
      }
    });
  });

  Object.keys(resTotal[year]).forEach((statsType) => {
    resTotal[year][statsType] = resTotal[year][statsType] / monthCount;
  });

  Object.keys(resType[year]).forEach((statsType) => {
    Object.keys(resType[year][statsType]).forEach((type) => {
      resType[year][statsType][type] = resType[year][statsType][type] / monthCount;
    });
  });

  return [resTotal, resType];
};

/* 
    Total: [Purchase, TransactionSent]
    Personal: [Purchase, TransactionSent, TransactionReceived]
    Dept: The difference between total and personal is 
        how much still remains to be received.
*/
export const calcSplitDept = (expenses: any, year: number) => {
  let res = {};

  Object.keys(expenses[year]).forEach((month) => {
    // Verify if year already exists
    if (!res[year]) {
      res[year] = { [month]: 0 };
    }

    res[year][month] = expenses[year][month][STATS_TYPE[0]] - expenses[year][month][STATS_TYPE[1]];
  });

  return res;
};

export const calcTransactionStats = (expenses: any) => {
  let res = {};

  // Check only transactions
  Object.keys(expenses).forEach((month) => {
    expenses[month].forEach(({ element, index, key }) => {
      if (key == KEYS.TRANSACTION) {
        element = element as Transaction;

        let month = new Date(element.dot).getMonth();
        let year = new Date(element.dot).getFullYear();

        let value = parseFloat(element.amount);

        // Verify if year already exists
        if (!res[year]) {
          res[year] = { [month]: { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 } };
        }

        // Verify if month already exists
        if (!res[year][month]) {
          res[year][month] = { [TRANSACTION_TYPE[0]]: 0, [TRANSACTION_TYPE[1]]: 0, [TRANSACTION_TYPE[2]]: 0 };
        }

        // if transaction received expenses are reduced
        if (element.user_origin_id) {
          res[year][month][TRANSACTION_TYPE[0]] -= value;
          res[year][month][TRANSACTION_TYPE[2]] += value;
        } else {
          res[year][month][TRANSACTION_TYPE[0]] += value;
          res[year][month][TRANSACTION_TYPE[1]] += value;
        }
      }
    });
  });

  return res;
};

export const calcTotalExpensesByType = (expenses: any, year: number) => {
  let resType = { [year]: { [STATS_TYPE[0]]: {}, [STATS_TYPE[1]]: {} } };

  Object.keys(expenses[year]).forEach((month) => {
    expenses[year][month].forEach(({ element, index, key }: Expense) => {
      let year: number, month: number;
      if (key == KEYS.TRANSACTION) {
        element = element as Transaction;
        month = new Date(element.dot).getMonth();
        year = new Date(element.dot).getFullYear();
      } else if (key == KEYS.PURCHASE) {
        element = element as Purchase;
        month = new Date(element.dop).getMonth();
        year = new Date(element.dop).getFullYear();
      } else {
        alert("Invalid Expense Element");
      }

      if (key == KEYS.TRANSACTION) {
        element = element as Transaction;

        let value = parseFloat(element.amount);

        // Verify if type already exists
        if (!Object.keys(resType[year][STATS_TYPE[0]]).includes(element.type)) {
          resType[year][STATS_TYPE[0]][element.type] = 0;
          resType[year][STATS_TYPE[1]][element.type] = 0;
        }

        // if transaction received expenses are reduced
        if (element.user_origin_id) {
          resType[year][STATS_TYPE[0]][element.type] -= value;
        } else {
          resType[year][STATS_TYPE[0]][element.type] += value;
          resType[year][STATS_TYPE[1]][element.type] += value;
        }
      } else if (key == KEYS.PURCHASE) {
        element = element as Purchase;

        // Verify if type already exists
        if (!Object.keys(resType[year][STATS_TYPE[0]]).includes(element.type)) {
          resType[year][STATS_TYPE[0]][element.type] = 0;
          resType[year][STATS_TYPE[1]][element.type] = 0;
        }

        let type0Value = parseFloat(element.value);
        let type1Value = parseFloat(element.value);

        if (element.split) {
          let weight = parseFloat(element.split.weight);
          type1Value = (type0Value * (100 - weight)) / 100;
        }

        resType[year][STATS_TYPE[0]][element.type] += type0Value;
        resType[year][STATS_TYPE[1]][element.type] += type1Value;
      }
    });
  });

  return resType;
};

export const groupExpensesByDate = (expenses: any, year: number, month: number) => {
  let groupedPurchases = {};

  expenses[year][month].forEach(({ element, index, key }: Expense) => {
    if (key == KEYS.TRANSACTION) {
      element = element as Transaction;
      let dateValue = element.dot;
      (groupedPurchases[dateValue] = groupedPurchases[dateValue] || []).push({ element, index, key });
    } else if (key == KEYS.PURCHASE) {
      element = element as Purchase;
      let dateValue = element.dop;
      (groupedPurchases[dateValue] = groupedPurchases[dateValue] || []).push({ element, index, key });
    } else {
      alert("Invalid Expense Element");
    }
  });

  return groupedPurchases;
};

export const updateExpenses = (expense: Expense, setExpenses: any) => {
  let year: number, month: number, updatedState: any;
  setExpenses((prev: any) => {
    updatedState = { ...prev };
    if (KEYS.PURCHASE == expense.key) {
      let purchase = expense.element as Purchase;
      month = new Date(purchase.dop).getMonth();
      year = new Date(purchase.dop).getFullYear();
    } else if (KEYS.TRANSACTION == expense.key) {
      let transaction = expense.element as Transaction;
      month = new Date(transaction.dot).getMonth();
      year = new Date(transaction.dot).getFullYear();
    } else {
      alert("Invalid Expense Element");
      return prev;
    }

    let index = prev[year][month].findIndex((e: Expense) => e.index == expense.index && e.key == expense.key);
    updatedState[year][month][index] = expense;

    return updatedState;
  });
};

export const deleteExpenses = (expense: Expense, setExpenses: any) => {
  let year: number, month: number, updatedState: any;
  setExpenses((prev: any) => {
    updatedState = { ...prev };
    if (KEYS.PURCHASE == expense.key) {
      let purchase = expense.element as Purchase;
      month = new Date(purchase.dop).getMonth();
      year = new Date(purchase.dop).getFullYear();
    } else if (KEYS.TRANSACTION == expense.key) {
      let transaction = expense.element as Transaction;
      month = new Date(transaction.dot).getMonth();
      year = new Date(transaction.dot).getFullYear();
    } else {
      alert("Invalid Expense Element");
      return prev;
    }

    let index = prev[year][month].findIndex((e: Expense) => e.index == expense.index && e.key == expense.key);
    delete updatedState[year][month][index];

    return updatedState;
  });
};

export const addExpenses = (newElement: Purchase | Transaction, key: any, setExpenses: any) => {
  let year: number, month: number, index: number, updatedState: ExpensesByYear;
  setExpenses((prev: ExpensesByYear) => {
    updatedState = { ...prev };
    if (KEYS.PURCHASE == key) {
      let purchase = newElement as Purchase;
      month = new Date(purchase.dop).getMonth();
      year = new Date(purchase.dop).getFullYear();
      index = ++updatedState.purchaseIndex;
    } else if (KEYS.TRANSACTION == key) {
      let transaction = newElement as Transaction;
      month = new Date(transaction.dot).getMonth();
      year = new Date(transaction.dot).getFullYear();
      index = ++prev.transactionIndex;
    } else {
      alert("Invalid Expense Element");
      return prev;
    }

    let expense: Expense = { element: newElement, key: key, index: index };

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
