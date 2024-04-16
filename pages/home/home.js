import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Table, TableWrapper, Cell } from "react-native-table-component";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import CalendarCard from "../../components/calendarCard/calendarCard";
import TypeCard from "../../components/typeCard/typeCard";
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";

//Functions
import { getMonthPurchaseStats, getMonthPurchaseTotal, getPurchaseAverage, getPurchaseAverageTotal } from "../../functions/purchase";
import { getTransactions, getMonthTransactionStats, getMonthTransactionTotal } from "../../functions/transaction";

import { horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import {
  refinePurchaseStats,
  loadCalendarCard,
  loadPieChartData,
  loadPurchaseTotalData,
  loadSpendTableData,
  loadExpenses,
  isCtxLoaded,
} from "./handler";

export default function Home({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [statsType, setStatsType] = useState(STATS_TYPE[0]);
  const [statsMode, setStatsMode] = useState(STATS_MODE[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [ctxValue, setCtxValue] = useState({});
  const [pieChartData, setPieChartData] = useState({ [STATS_TYPE[0]]: [] });
  const [spendByType, setSpendByType] = useState({ [STATS_TYPE[0]]: [[""]] });
  const [purchaseTotal, setPurchaseTotal] = useState({ [STATS_TYPE[0]]: "0.00" });
  const [pieChartAverageData, setPieChartAverageData] = useState({ [STATS_TYPE[0]]: [] });
  const [spendAverageByType, setSpendAverageByType] = useState({ [STATS_TYPE[0]]: [[""]] });
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState({ [STATS_TYPE[0]]: "0.00" });

  const appCtx = useContext(AppContext);

  const state = {
    tableHead: ["Color", "Type", "Value"],
    tableFlex: [1, 2, 1],
  };

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        if (isCtxLoaded(appCtx)) {
          const value = {
            totalExpense: appCtx.totalExpense,
            expenseByType: appCtx.expenseByType,
            totalExpensesAverage: appCtx.totalExpensesAverage,
            totalExpensesByTypeAverage: appCtx.totalExpensesByTypeAverage,
          };
          setCtxValue(value);
        }
      }
      fetchData();
    }, [appCtx])
  );

  useFocusEffect(
    React.useCallback(() => {
      let currDateYear = currentYear.toString();
      let currDateMonth = currentMonth.toString();
      if (isCtxLoaded(ctxValue)) {
        if (Object.keys(ctxValue["totalExpense"][currDateYear]).includes(currDateMonth)) {
          // Load data for total expense
          setPurchaseTotal(ctxValue["totalExpense"][currDateYear][currDateMonth]);
          // Load data to fill chart and table
          let [auxPieChartData, auxTableData] = loadExpenses(ctxValue["expenseByType"][currDateYear][currDateMonth]);
          setPieChartData(auxPieChartData);
          setSpendByType(auxTableData);
          // Load Average data to fill chart and table
          setPurchaseAverageTotal(ctxValue["totalExpensesAverage"][currDateYear]);
          let [auxPieChartAverageData, auxSpendAverageByType] = loadExpenses(ctxValue["totalExpensesByTypeAverage"][currDateYear]);
          setPieChartAverageData(auxPieChartAverageData);
          setSpendAverageByType(auxSpendAverageByType);
        } else {
          // If data is not available for the current month
          setPurchaseTotal({ [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] });
          setPieChartData({ [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] });
          setSpendByType({ [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] });
          setPieChartAverageData({ [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] });
          setSpendAverageByType({ [STATS_TYPE[0]]: [], [STATS_TYPE[1]]: [] });
        }
      }
    }, [ctxValue, currentMonth, currentYear])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData).length !== 0 ? (
          <View style={{ flex: 8, gap: verticalScale(10) }}>
            <CardWrapper
              style={{ flex: verticalScale(8), justifyContent: "center", alignItems: "center", backgroundColor: "transparent", elevation: 0 }}
            >
              <View style={styles.chart}>
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
                  options={{ maintainAspectRatio: false, aspectRatio: 1 }}
                />
                <View style={{ position: "absolute", justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}>
                  <Text style={{ alignSelf: "center", fontSize: verticalScale(40), color: "white" }}>
                    {loadPurchaseTotalData(statsMode, statsType, purchaseTotal, purchaseAverageTotal)}
                  </Text>
                  {loadCalendarCard(statsMode, currentMonth, setCurrentMonth, currentYear, setCurrentYear)}
                </View>
              </View>
            </CardWrapper>
            <View style={{ flex: 1, alignSelf: "flex-end", flexDirection: "row", maxHeight: 35, gap: 10 }}>
              <TypeCard setItem={setStatsType} itemList={Object.values(STATS_TYPE)} />
              <TypeCard setItem={setStatsMode} itemList={Object.values(STATS_MODE)} />
            </View>
            <View style={{ flex: 4 }}>
              <CardWrapper style={{ height: "95%" }}>
                <View style={styles.tableInfo}>
                  <Table style={{ ...styles.textCenter }} borderStyle={{ borderColor: "transparent" }}>
                    <ScrollView style={{ height: "100%", background: "transparent" }}>
                      {loadSpendTableData(statsMode, statsType, spendByType, spendAverageByType).map((rowData, index) => (
                        <TableWrapper key={index} style={styles.rowTable}>
                          {rowData.map((cellData, cellIndex) => {
                            if (cellIndex == 2) {
                              cellData = cellData + " €";
                            }
                            return (
                              <Cell style={{ flex: state.tableFlex[cellIndex] }} key={cellIndex} data={cellData} textStyle={styles.textCenter} />
                            );
                          })}
                        </TableWrapper>
                      ))}
                    </ScrollView>
                  </Table>
                </View>
              </CardWrapper>
            </View>
          </View>
        ) : (
          <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
            <Text style={{ color: "white" }}>NO DATA</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
