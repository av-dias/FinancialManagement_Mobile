import { ExpensesByYear } from "../models/interfaces";
import { months } from "../utility/calendar";
import { ANALYSES_TYPE, TRANSACTION_TYPE } from "../utility/keys";
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
  for (let month of Object.keys(resDept[currentYear])) {
    if (!resSplitDeptData[currentYear]) {
      resSplitDeptData[currentYear] = [];
    }

    resSplitDeptData[currentYear].push({
      label: months[month],
      value: Number(resDept[currentYear][month].toFixed(0)),
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
    resTransactionTotal[year][TRANSACTION_TYPE.Total] = [];
    for (let month of Object.keys(resTransactionTotal[year])) {
      if (month == TRANSACTION_TYPE.Total) continue;
      if (!resTransactionTotal[year][TRANSACTION_TYPE.Total]) resTransactionTotal[year][TRANSACTION_TYPE.Total] = [];

      resTransactionTotal[year][TRANSACTION_TYPE.Total].push({
        x: months[month],
        y: parseFloat(resTransactionTotal[year][month][TRANSACTION_TYPE.Total]),
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
    for (let type of Object.keys(resTotalExpensesByType[year][ANALYSES_TYPE.Personal])) {
      if (!resSpendByType[year]) {
        resSpendByType[year] = [];
      }
      resSpendByType[year].push({ x: type, y: resTotalExpensesByType[year][ANALYSES_TYPE.Personal][type] });
    }
  }

  return resSpendByType;
};

/*
 * Used to find all the expenses that have been split by the current year and month
 */
export const findAllSplitExpenses = (expenses: ExpensesByYear, currentYear: number) => {
  let expensesWithSplit = { [currentYear]: {} };
  let transactionsWithSplit = { [currentYear]: {} };
  Object.keys(expenses[currentYear]).map((element) => {
    // Remove all the expense elements which do not have a split
    expensesWithSplit[currentYear][element] = expenses[currentYear][element].filter((expense) => expense.element.split);
    transactionsWithSplit[currentYear][element] = expenses[currentYear][element].filter((expense) => expense.element.user_origin_id);
  });
  return { expensesWithSplit, transactionsWithSplit };
};
