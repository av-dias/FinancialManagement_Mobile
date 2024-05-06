import { Expense, Purchase, Transaction } from "../models/types";
import { KEYS, STATS_TYPE } from "../utility/keys";

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
