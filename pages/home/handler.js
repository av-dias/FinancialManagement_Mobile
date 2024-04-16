import CalendarCard from "../../components/calendarCard/calendarCard";

import { categoryIcons } from "../../assets/icons";
import { FontAwesome } from "@expo/vector-icons";
import { _styles } from "./style";
import { STATS_MODE, STATS_TYPE } from "../../utility/keys";

const styles = _styles;

export const isCtxLoaded = (ctx) => {
  return (
    Object.keys(ctx).length > 0 &&
    Object.keys(ctx["totalExpense"]).length > 0 &&
    Object.keys(ctx["expenseByType"]).length > 0 &&
    Object.keys(ctx["totalExpensesAverage"]).length > 0 &&
    Object.keys(ctx["totalExpensesByTypeAverage"]).length > 0
  );
};

export const loadExpenses = (expenses) => {
  let array = { [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] };
  let arrayTables = { [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] };
  Object.keys(expenses).forEach((stats) => {
    Object.keys(expenses[stats]).forEach((type) => {
      let _color;

      categoryIcons().find((icon) => {
        if (icon.label === type) {
          _color = icon.color;
        }
      });

      array[stats].push({ x: " ", y: expenses[stats][type], color: _color });
      arrayTables[stats].push([
        <FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />,
        type,
        parseFloat(expenses[stats][type]).toFixed(0),
      ]);
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
    arrayTables.push([
      <FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />,
      key,
      parseFloat(purchasesStats[key]).toFixed(0),
    ]);
  });

  arrayTables = arrayTables.sort(function (a, b) {
    return b[2] - a[2];
  });

  return [array, arrayTables];
};

export const loadCalendarCard = (statsMode, currentMonth, setCurrentMonth, currentYear, setCurrentYear) => {
  if (statsMode == STATS_MODE[0]) return <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />;
};

export const loadPieChartData = (statsMode, statsType, pieChartData, pieChartAverageData) => {
  if (statsMode == STATS_MODE[0]) return pieChartData[statsType];
  else return pieChartAverageData[statsType];
};

export const loadPurchaseTotalData = (statsMode, statsType, purchaseTotal, purchaseAverageTotal) => {
  if (statsMode == STATS_MODE[0]) {
    return Number(purchaseTotal[statsType]).toFixed(1) + "€";
  } else return Number(purchaseAverageTotal[statsType]).toFixed(1) + "€";
};

export const loadSpendTableData = (statsMode, statsType, spendByType, spendAverageByType) => {
  if (statsMode == STATS_MODE[0]) return spendByType[statsType];
  else return spendAverageByType[statsType];
};
