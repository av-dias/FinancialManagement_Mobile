import { months } from "../utility/calendar";
import { STATS_TYPE, TRANSACTION_TYPE } from "../utility/keys";
import { calcExpensesByType, calcExpensesTotalFromType, calcSplitDept, calcTotalExpensesByType, calcTransactionStats } from "./expenses";

export const calculateSplitData = (expenses: any[], currentYear: number) => {
  let resExpensesTotal = { [currentYear]: {} };

  Object.keys(expenses[currentYear]).forEach((month) => {
    if (expenses[currentYear][month].length > 0) {
      let resExpensesByType = calcExpensesByType(expenses[currentYear][month]);
      let res = calcExpensesTotalFromType(resExpensesByType[currentYear][month]);
      resExpensesTotal[currentYear][month] = res;
    }
  });

  if (Object.keys(resExpensesTotal[currentYear]).length == 0) {
    return null;
  }

  return resExpensesTotal;
};

export const calculateSplitDeptData = (resExpensesTotal, currentYear: number) => {
  let resSplitDeptData = {};
  let resDept = calcSplitDept(resExpensesTotal, currentYear);

  // Load Split Dept Data
  let monthsList = Object.keys(resDept[currentYear]);
  // Add dummy data when only one months data is available
  if (monthsList.length == 1) {
    let indexMonth;
    if (parseFloat(monthsList[0]) == 0) {
      indexMonth = 1;
    } else indexMonth = parseFloat(monthsList[0]) - 1;
    resSplitDeptData[currentYear] = [{ x: months[indexMonth], y: 0 }];
  }
  for (let month of Object.keys(resDept[currentYear])) {
    if (!resSplitDeptData[currentYear]) {
      resSplitDeptData[currentYear] = [];
    }

    resSplitDeptData[currentYear].push({
      label: months[month],
      value: resDept[currentYear][month],
      dataPointText: resDept[currentYear][month].toFixed(0),
    });
  }

  return resSplitDeptData;
};

/*
 * Load Transaction Data
 * TODO: Improve json data storage consistency
 */
export const calculateTransactionStats = (expenses, currentYear) => {
  let resTransactionTotal = {};
  resTransactionTotal = calcTransactionStats(expenses[currentYear]);
  for (let year of Object.keys(resTransactionTotal)) {
    resTransactionTotal[year][TRANSACTION_TYPE[0]] = [];
    for (let month of Object.keys(resTransactionTotal[year])) {
      if (month == TRANSACTION_TYPE[0]) continue;
      if (!resTransactionTotal[year][TRANSACTION_TYPE[0]]) resTransactionTotal[year][TRANSACTION_TYPE[0]] = [];

      resTransactionTotal[year][TRANSACTION_TYPE[0]].push({
        x: months[month],
        y: parseFloat(resTransactionTotal[year][month][TRANSACTION_TYPE[0]]),
      });
    }
  }

  return resTransactionTotal;
};

export const calculateSpendByType = (expenses, currentYear) => {
  let resSpendByType = {};

  // Load Split Dept Data
  let resTotalExpensesByType = calcTotalExpensesByType(expenses, currentYear);
  for (let year of Object.keys(resTotalExpensesByType)) {
    for (let type of Object.keys(resTotalExpensesByType[year][STATS_TYPE[1]])) {
      if (!resSpendByType[year]) {
        resSpendByType[year] = [];
      }
      resSpendByType[year].push({ x: type, y: resTotalExpensesByType[year][STATS_TYPE[1]][type] });
    }
  }

  return resSpendByType;
};
