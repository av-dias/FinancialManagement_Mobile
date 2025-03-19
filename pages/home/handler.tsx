import { categoryIcons } from "../../utility/icons";
import { FontAwesome } from "@expo/vector-icons";
import { _styles } from "./style";
import { TIME_MODE, ANALYSES_TYPE } from "../../utility/keys";
import { Chart, Table } from "../../models/charts";

const styles = _styles;

export const isCtxLoaded = (ctx, year, month) => {
  return (
    ctx &&
    Object.keys(ctx).length > 0 &&
    ctx["totalExpense"] &&
    ctx["expenseByType"] &&
    ctx["totalExpensesAverage"] &&
    ctx["totalExpensesByTypeAverage"] &&
    Object.keys(ctx["totalExpense"]).length > 0 &&
    Object.keys(ctx["expenseByType"]).length > 0 &&
    Object.keys(ctx["totalExpensesAverage"]).length > 0 &&
    Object.keys(ctx["totalExpensesByTypeAverage"]).length > 0
  );
};

export const loadExpenses = (expenses: any) => {
  let array = { [ANALYSES_TYPE.Total]: [], [ANALYSES_TYPE.Personal]: [] };
  let arrayTables = { [ANALYSES_TYPE.Total]: [], [ANALYSES_TYPE.Personal]: [] };
  Object.keys(expenses).forEach((stats) => {
    Object.keys(expenses[stats]).forEach((type) => {
      let _color;

      categoryIcons().find((icon) => {
        if (icon.label === type) {
          _color = icon.brightColor;
        }
      });

      let pieChartValue = expenses[stats][type] < 0 ? 1 : expenses[stats][type];

      array[stats].push({ x: " ", y: pieChartValue, color: _color } as Chart);
      arrayTables[stats].push([<FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />, type, parseFloat(expenses[stats][type]).toFixed(0)] as Table);
    });

    arrayTables[stats] = arrayTables[stats].sort(function (a, b) {
      return b[2] - a[2];
    });
  });

  return [array, arrayTables];
};

export const refinePurchaseStats = (purchasesStats) => {
  let array = [];
  let arrayTables = [];
  Object.keys(purchasesStats).forEach((key) => {
    let _color;

    categoryIcons().find((type) => {
      if (type.label === key) {
        _color = type.color;
      }
    });

    array.push({ x: " ", y: purchasesStats[key], color: _color });
    arrayTables.push([<FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />, key, parseFloat(purchasesStats[key]).toFixed(0)]);
  });

  arrayTables = arrayTables.sort(function (a, b) {
    return b[2] - a[2];
  });

  return [array, arrayTables];
};

export const loadPieChartData = (statsMode: any, statsType: any, pieChartData: any, pieChartAverageData: any) => {
  if (statsMode == TIME_MODE.Monthly) return pieChartData[statsType];
  else return pieChartAverageData[statsType];
};

export const loadPurchaseTotalData = (statsMode: any, statsType: any, purchaseTotal: any, purchaseAverageTotal: any) => {
  if (statsMode == TIME_MODE.Monthly) {
    return Number(purchaseTotal[statsType]).toFixed(1);
  } else return Number(purchaseAverageTotal[statsType]).toFixed(1);
};

export const loadSpendTableData = (statsMode, statsType, spendByType, spendAverageByType) => {
  if (statsMode == TIME_MODE.Monthly) return spendByType[statsType];
  else return spendAverageByType[statsType];
};
