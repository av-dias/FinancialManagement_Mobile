import { categoryIcons } from "../../utility/icons";
import { FontAwesome } from "@expo/vector-icons";
import { _styles } from "./style";
import { TIME_MODE, ANALYSES_TYPE } from "../../utility/keys";
import { Chart, Table } from "../../models/charts";
import { calcExpensesTotalFromType } from "../../functions/expenses";

const styles = _styles;

export async function fetchData(
  email,
  currentMonth,
  currentYear,
  setPieChartData,
  setSpendByType,
  setExpenseTotal,
  setPieChartAverageData,
  setSpendAverageByType,
  setPurchaseAverageTotal,
  expensesService
) {
  const expensesByTypeTotal = await expensesService.getMonthExpensesByType(
    email,
    currentMonth + 1,
    currentYear,
    ANALYSES_TYPE.Total
  );
  const expensesByTypePersonal = await expensesService.getMonthExpensesByType(
    email,
    currentMonth + 1,
    currentYear,
    ANALYSES_TYPE.Personal
  );

  let resExpensesByType = {
    [ANALYSES_TYPE.Total]: expensesByTypeTotal,
    [ANALYSES_TYPE.Personal]: expensesByTypePersonal,
  };

  if (
    resExpensesByType[ANALYSES_TYPE.Personal] &&
    resExpensesByType[ANALYSES_TYPE.Total]
  ) {
    let [resPieChart, resTableChart] = loadExpenses(resExpensesByType);
    setPieChartData(resPieChart);
    setSpendByType(resTableChart);
    setExpenseTotal(calcExpensesTotalFromType(resExpensesByType));
  }

  const averageTotal = await expensesService.getExpensesTotalAverage(
    email,
    currentYear,
    ANALYSES_TYPE.Total
  );
  const averagePersonal = await expensesService.getExpensesTotalAverage(
    email,
    currentYear,
    ANALYSES_TYPE.Personal
  );

  const averageTypeTotal = await expensesService.getExpenseAverageByType(
    email,
    currentYear,
    ANALYSES_TYPE.Total
  );
  const averageTypePersonal = await expensesService.getExpenseAverageByType(
    email,
    currentYear,
    ANALYSES_TYPE.Personal
  );

  if (averageTypeTotal && averageTypePersonal) {
    let [resAveragePieChart, resAverageTableChart] = loadExpenses({
      Total: averageTypeTotal,
      Personal: averageTypePersonal,
    });
    setPieChartAverageData(resAveragePieChart);
    setSpendAverageByType(resAverageTableChart);
    setPurchaseAverageTotal({
      Total: averageTotal,
      Personal: averagePersonal,
    });
  }
}

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
      arrayTables[stats].push([
        <FontAwesome
          name="circle"
          size={24}
          color={_color}
          style={styles.colorIcon}
        />,
        type,
        parseFloat(expenses[stats][type]).toFixed(0),
      ] as Table);
    });

    arrayTables[stats] = arrayTables[stats].sort(function (a, b) {
      return b[2] - a[2];
    });
  });

  return [array, arrayTables];
};

export const loadPieChartData = (
  statsMode: any,
  statsType: any,
  pieChartData: any,
  pieChartAverageData: any
) => {
  if (pieChartAverageData[statsType].length === 0)
    return [{ x: "Your Spents", y: 1 }];

  if (statsMode == TIME_MODE.Monthly) return pieChartData[statsType];
  else return pieChartAverageData[statsType];
};

export const loadPurchaseTotalData = (
  statsMode: any,
  statsType: any,
  purchaseTotal: any,
  purchaseAverageTotal: any
) => {
  if (statsMode == TIME_MODE.Monthly) {
    return Number(purchaseTotal[statsType]).toFixed(1);
  } else return Number(purchaseAverageTotal[statsType]).toFixed(1);
};

export const loadSpendTableData = (
  statsMode,
  statsType,
  spendByType,
  spendAverageByType
) => {
  if (statsMode == TIME_MODE.Monthly) return spendByType[statsType];
  else return spendAverageByType[statsType];
};
