import { months } from "../utility/calendar";
import { ProgressBarColors } from "../utility/colors";
import { ANALYSES_TYPE, TRANSACTION_TYPE } from "../utility/keys";
import { calcTotalExpensesByType, calcTransactionStats } from "./expenses";

export const calculateSplitDeptData = (
  deptCalculation,
  currentYear: number
) => {
  let resSplitDeptData = {};

  // Load Split Dept Data
  for (let month of Object.keys(deptCalculation)) {
    if (!resSplitDeptData[currentYear]) {
      resSplitDeptData[currentYear] = [];
    }

    resSplitDeptData[currentYear].push({
      label: months[month],
      value: Number(deptCalculation[month].toFixed(0)),
      dataPointText: deptCalculation[month].toFixed(0),
      color:
        new Date().getMonth() === Number(month)
          ? ProgressBarColors.blueAccent
          : null,
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
      if (!resTransactionTotal[year][TRANSACTION_TYPE.Total])
        resTransactionTotal[year][TRANSACTION_TYPE.Total] = [];

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
    for (let type of Object.keys(
      resTotalExpensesByType[year][ANALYSES_TYPE.Personal]
    )) {
      if (!resSpendByType[year]) {
        resSpendByType[year] = [];
      }
      resSpendByType[year].push({
        x: type,
        y: resTotalExpensesByType[year][ANALYSES_TYPE.Personal][type],
      });
    }
  }

  return resSpendByType;
};
