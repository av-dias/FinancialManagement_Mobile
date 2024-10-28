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
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";

import { horizontalScale, verticalScale } from "../../functions/responsive";
import { loadCalendarCard, loadPieChartData, loadPurchaseTotalData, loadSpendTableData, loadExpenses, isCtxLoaded } from "./handler";
import { calcExpensesByType, calcExpensesAverage, calcExpensesTotalFromType } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { FlatItem } from "../../components/flatItem/flatItem";

export default function Home({ navigation }) {
  const styles = _styles;

  const [statsType, setStatsType] = useState(STATS_TYPE[0]);
  const [statsMode, setStatsMode] = useState(STATS_MODE[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [pieChartData, setPieChartData] = useState({ [STATS_TYPE[0]]: [] });
  const [spendByType, setSpendByType] = useState({ [STATS_TYPE[0]]: [[""]] });
  const [expenseTotal, setExpenseTotal] = useState<any>({ [STATS_TYPE[0]]: "0.00" });

  const [pieChartAverageData, setPieChartAverageData] = useState({ [STATS_TYPE[0]]: [] });
  const [spendAverageByType, setSpendAverageByType] = useState({ [STATS_TYPE[0]]: [[""]] });
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState<any>({ [STATS_TYPE[0]]: "0.00" });
  const [prediction, setPrediction] = useState(0);

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
          setPieChartData({ [STATS_TYPE[0]]: [] });
          setSpendByType({ [STATS_TYPE[0]]: [[""]] });
          setExpenseTotal({ [STATS_TYPE[0]]: "0.00" });

          setPieChartAverageData({ [STATS_TYPE[0]]: [] });
          setSpendAverageByType({ [STATS_TYPE[0]]: [[""]] });
          setPurchaseAverageTotal({ [STATS_TYPE[0]]: "0.00" });
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      console.log(`Home: Fetch took ${endTime - startTime} milliseconds.`);
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
      console.log(`Home: Database Fetch took ${endTime - startTime} milliseconds.`);
    }, [appCtx.email, incomeRepository, expenseTotal, purchaseAverageTotal])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
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
                  {loadCalendarCard(statsMode, currentMonth, setCurrentMonth, currentYear, setCurrentYear)}
                </View>
              </View>
            </CardWrapper>
            <View style={styles.typeCardContainer}>
              <TypeCard setItem={setStatsType} itemList={Object.values(STATS_TYPE)} />
              <TypeCard setItem={setStatsMode} itemList={Object.values(STATS_MODE)} />
            </View>
            <View style={{ flex: 4 }}>
              <View style={{ flex: 4 }}>
                <ScrollView contentContainerStyle={{ gap: 5, paddingHorizontal: 5 }}>
                  {loadSpendTableData(statsMode, statsType, spendByType, spendAverageByType).map((rowData) => (
                    <FlatItem key={rowData[1]} icon={rowData[0]} name={rowData[1]} value={rowData[2]} />
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
