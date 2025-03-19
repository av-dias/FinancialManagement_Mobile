import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { AppContext } from "../../store/app-context";
import { useDatabaseConnection } from "../../store/database-context";

//Custom Components
import CalendarCard from "../../components/calendarCard/calendarCard";
import TypeCard from "../../components/TypeCard/TypeCard";
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

//Custom Constants
import { _styles } from "./style";
import { ANALYSES_TYPE, TIME_MODE, KEYS } from "../../utility/keys";

import { horizontalScale, verticalScale } from "../../functions/responsive";
import { loadPieChartData, loadPurchaseTotalData, loadSpendTableData, loadExpenses } from "./handler";
import { calcExpensesByType, calcExpensesAverage, calcExpensesTotalFromType } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { FlatItem } from "../../components/flatItem/flatItem";
import ModalCustom from "../../components/modal/modal";
import { ExpenseType, PurchaseType, TransactionType } from "../../models/types";
import { categoryIcons, utilIcons } from "../../utility/icons";
import { Badge } from "react-native-paper";
import { logTimeTook } from "../../utility/logger";
import { ExpensesService } from "../../service/ExpensesService";

export default function Home({ navigation }) {
  const styles = _styles;
  const expensesService = new ExpensesService();

  const [statsType, setStatsType] = useState(ANALYSES_TYPE.Total);
  const [statsMode, setStatsMode] = useState(TIME_MODE.Monthly);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [pieChartData, setPieChartData] = useState({ [ANALYSES_TYPE.Total]: [] });
  const [spendByType, setSpendByType] = useState({ [ANALYSES_TYPE.Total]: [[""]] });
  const [expenseTotal, setExpenseTotal] = useState<any>({ [ANALYSES_TYPE.Total]: "0.00" });

  const [pieChartAverageData, setPieChartAverageData] = useState({ [ANALYSES_TYPE.Total]: [] });
  const [spendAverageByType, setSpendAverageByType] = useState({ [ANALYSES_TYPE.Total]: [[""]] });
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState<any>({ [ANALYSES_TYPE.Total]: "0.00" });
  const [prediction, setPrediction] = useState(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [rowType, setRowType] = useState<string>(null);

  const appCtx = useContext(AppContext);
  const { incomeRepository } = useDatabaseConnection();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (
          appCtx &&
          appCtx.expenses &&
          appCtx.expenses.hasOwnProperty(currentYear) &&
          appCtx.expenses[currentYear].hasOwnProperty(currentMonth) &&
          appCtx.expenses[currentYear][currentMonth].length > 0
        ) {
          let resExpensesByType = calcExpensesByType(appCtx.expenses[currentYear][currentMonth]);
          let [resPieChart, resTableChart] = loadExpenses(resExpensesByType[currentYear][currentMonth]);
          setPieChartData(resPieChart);
          setSpendByType(resTableChart);
          setExpenseTotal(calcExpensesTotalFromType(resExpensesByType[currentYear][currentMonth]));

          //Average
          let [resTotal, resType] = calcExpensesAverage(appCtx.expenses, currentYear);
          let [resAveragePieChart, resAverageTableChart] = loadExpenses(resType[currentYear]);
          setPieChartAverageData(resAveragePieChart);
          setSpendAverageByType(resAverageTableChart);
          setPurchaseAverageTotal(resTotal[currentYear]);
        } else {
          setPieChartData({ [ANALYSES_TYPE.Total]: [] });
          setSpendByType({ [ANALYSES_TYPE.Total]: [[""]] });
          setExpenseTotal({ [ANALYSES_TYPE.Total]: "0.00" });

          setPieChartAverageData({ [ANALYSES_TYPE.Total]: [] });
          setSpendAverageByType({ [ANALYSES_TYPE.Total]: [[""]] });
          setPurchaseAverageTotal({ [ANALYSES_TYPE.Total]: "0.00" });
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      logTimeTook("Home", "Fetch", endTime, startTime);
    }, [appCtx.expenses, currentMonth, currentYear])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if (appCtx && appCtx.email) {
          //Calculate Current Savings
          try {
            const resTotalIncome = await incomeRepository.getTotalIncomeFromDate(appCtx.email, currentMonth, currentYear);
            setPrediction(resTotalIncome - Number(loadPurchaseTotalData(statsMode, statsType, expenseTotal, purchaseAverageTotal)));
          } catch (e) {
            console.log(e);
          }
        }
      }
      let startTime = performance.now();
      if (incomeRepository.isReady()) {
        fetchData();
      }
      let endTime = performance.now();
      logTimeTook("Home", "Database Fetch", endTime, startTime);
    }, [appCtx.email, incomeRepository, expenseTotal, purchaseAverageTotal, statsMode, statsType])
  );

  const loadIcon = (expense: ExpenseType) => {
    if (expense.key === KEYS.PURCHASE) return <View>{categoryIcons().find((category) => category.label === expense.element.type).icon}</View>;
    else {
      expense.element = expense.element as TransactionType;
      if (expense.key === KEYS.TRANSACTION && !expense.element.user_origin_id) return <View>{utilIcons().find((category) => category.label === "Transaction").icon}</View>;
      else return <View>{utilIcons().find((category) => category.label === "Received").icon}</View>;
    }
  };

  const loadSplitHeader = () => (
    <View>
      <Text style={styles.splitModalTitle}>Expenses</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Total</Text>
          <Text style={styles.splitModalText}>
            {`${Number(
              appCtx.expenses[currentYear][currentMonth].reduce(
                (acc: number, expense: ExpenseType) => (expense.element.type === rowType ? acc + Number(loadPurchaseValue(expense) || (expense.element as TransactionType).amount) : acc),
                0
              )
            ).toFixed(0)}€`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Count</Text>
          <Text style={styles.splitModalText}>{appCtx.expenses[currentYear][currentMonth].reduce((acc: number, expense: ExpenseType) => (expense.element.type === rowType ? acc + 1 : acc), 0)}</Text>
        </View>
      </View>
    </View>
  );

  /*
   * Load the purchase value based on Stats Type
   * If stats type is personal
   * The purchase needs to consider the spluit weight if it exists
   */
  const loadPurchaseValue = (expense: ExpenseType) => {
    const element = expense.element as PurchaseType;
    if (statsType === ANALYSES_TYPE.Total) {
      return Number(element.value);
    } else {
      let value: number;
      if (element.split) {
        value = (Number(element.value) * (100 - Number(element.split.weight))) / 100;
      } else {
        value = Number(element.value);
      }
      return Number(value.toFixed(1));
    }
  };

  const loadSplitItem = () => (
    <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
      {appCtx.expenses[currentYear][currentMonth].map(
        (expense: ExpenseType) =>
          rowType === expense.element.type && (
            <View key={`V${expense.key + expense.index}`}>
              {(expense.element as PurchaseType)?.split && statsType === ANALYSES_TYPE.Total && (
                <Badge size={24} style={{ top: -5, zIndex: 1, position: "absolute" }}>
                  {`${(expense.element as PurchaseType).split.weight}%`}
                </Badge>
              )}
              <FlatItem
                key={`FI${expense.key + expense.index}`}
                icon={loadIcon(expense)}
                name={(expense.element as PurchaseType).name || (expense.element as TransactionType).description}
                value={loadPurchaseValue(expense) || Number((expense.element as TransactionType).amount)}
              />
            </View>
          )
      )}
    </ScrollView>
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={10} hasColor={true}>
        {modalVisible && (
          <View style={{ flex: 1, padding: 10, gap: 20 }}>
            {loadSplitHeader()}
            {loadSplitItem()}
          </View>
        )}
      </ModalCustom>
      <View style={styles.usableScreen}>
        {loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData).length !== 0 ? (
          <View style={{ flex: 8, gap: verticalScale(10) }}>
            <CardWrapper style={styles.mainContainer}>
              <View style={styles.chart}>
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsText}>{`${prediction.toFixed(0)}€`}</Text>
                </View>
                <VictoryPie
                  height={horizontalScale(320)}
                  innerRadius={horizontalScale(130)}
                  padding={{ top: 0, bottom: 0 }}
                  data={
                    loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData).length != 0
                      ? loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData)
                      : [{ x: "Your Spents", y: 1 }]
                  }
                  style={{
                    data: {
                      fill: ({ datum }) => datum.color,
                    },
                  }}
                  labelComponent={<VictoryLabel style={[{ fontSize: 10 }]} />}
                />
                <View style={styles.expensesContainer}>
                  <View style={{ paddingBottom: 10 }}>
                    <Text style={styles.expensesText}>{`${loadPurchaseTotalData(statsMode, statsType, expenseTotal, purchaseAverageTotal)}€`}</Text>
                  </View>
                  {statsMode == TIME_MODE.Monthly && <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />}
                </View>
              </View>
            </CardWrapper>
            <View style={styles.typeCardContainer}>
              <TypeCard setItem={setStatsType} itemList={Object.values(ANALYSES_TYPE)} />
              <TypeCard setItem={setStatsMode} itemList={Object.values(TIME_MODE)} />
            </View>
            <View style={{ flex: 4 }}>
              <View style={{ flex: 4 }}>
                <ScrollView contentContainerStyle={{ gap: 5, paddingHorizontal: 5 }}>
                  {loadSpendTableData(statsMode, statsType, spendByType, spendAverageByType).map((rowData) => (
                    <FlatItem
                      key={rowData[1]}
                      icon={rowData[0]}
                      name={rowData[1]}
                      value={rowData[2]}
                      onPressCallback={() => {
                        if (statsMode === TIME_MODE.Monthly) {
                          setModalVisible(true);
                          setRowType(rowData[1]);
                        }
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
            <Text style={{ color: dark.textPrimary }}>NO DATA</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
