import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryLine, VictoryBar } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import TypeCard from "../../components/typeCard/typeCard";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, TRANSACTION_TYPE } from "../../utility/keys";
import { months } from "../../utility/calendar";

//Functions
import { heightTreshold, horizontalScale, verticalScale } from "../../functions/responsive";
import { isCtxLoaded } from "./handler";
import {
  calcExpensesByType,
  calcExpensesTotalFromType,
  calcSplitDept,
  calcTotalExpensesByType,
  calcTransactionStats,
} from "../../functions/expenses";

export default function Stats({ navigation }) {
  const styles = _styles;

  const [splitDeptData, setSplitDeptData] = useState({});
  const [spendByType, setSpendByType] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [transactionStats, setTransactionStats] = useState({});

  const appCtx = useContext(AppContext);

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        /* 
            TODO: Enable Previous Year Data
        */
        if (appCtx && appCtx.expenses && appCtx.expenses.hasOwnProperty(currentYear)) {
          let resExpensesTotal = { [currentYear]: {} },
            month = 0;

          Object.keys(appCtx.expenses[currentYear]).forEach((month) => {
            if (appCtx.expenses[currentYear][month].length > 0) {
              let resExpensesByType = calcExpensesByType(appCtx.expenses[currentYear][month]);
              let res = calcExpensesTotalFromType(resExpensesByType[currentYear][month]);
              resExpensesTotal[currentYear][month] = res;
            }
          });

          console.log(resExpensesTotal);

          if (Object.keys(resExpensesTotal[currentYear]).length == 0) {
            return;
          }

          let resDept = calcSplitDept(resExpensesTotal, currentYear);

          let resSplitDeptData = {},
            resSpendByType = {},
            resTransactionTotal = {};

          // Load Split Dept Data
          let monthsList = Object.keys(resDept[currentYear]);
          // Add dummy data when only one months data is available
          if (monthsList.length == 1) {
            let indexMonth;
            if (monthsList[0] == 0) {
              indexMonth = 1;
            } else indexMonth = monthsList[0] - 1;
            resSplitDeptData[currentYear] = [{ x: months[indexMonth], y: 10 }];
          }
          for (let month of Object.keys(resDept[currentYear])) {
            if (!resSplitDeptData[currentYear]) {
              resSplitDeptData[currentYear] = [];
            }

            resSplitDeptData[currentYear].push({ x: months[month], y: resDept[currentYear][month] });
          }
          setSplitDeptData(resSplitDeptData);

          /* 
            Load Transaction Data
            TODO: Improve json data storage consistency
          */
          resTransactionTotal = calcTransactionStats(appCtx.expenses[currentYear]);
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
          setTransactionStats(resTransactionTotal);

          // Load Split Dept Data
          let resTotalExpensesByType = calcTotalExpensesByType(appCtx.expenses, currentYear);
          for (let year of Object.keys(resTotalExpensesByType)) {
            for (let type of Object.keys(resTotalExpensesByType[year][STATS_TYPE[1]])) {
              if (!resSpendByType[year]) {
                resSpendByType[year] = [];
              }
              resSpendByType[year].push({ x: type, y: resTotalExpensesByType[year][STATS_TYPE[1]][type] });
            }
          }
          setSpendByType(resSpendByType);
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      console.log(`Stats: Fetch took ${endTime - startTime} milliseconds.`);
    }, [appCtx.expenses, currentYear])
  );

  const calculateArrayVariation = (arr) => {
    let maxArray = arr.sort(function (a, b) {
      return b.y - a.y;
    });

    let variation = Math.abs(maxArray[0].y - maxArray[maxArray.length - 1].y);
    return variation < 300 ? 300 : variation;
  };

  const getMaxArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;
    let maxArray = arr.sort(function (a, b) {
      return b.y - a.y;
    });

    let max = maxArray[0].y;

    return max + calculateArrayVariation(arr) * 0.6;
  };

  const getMinArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;

    let minArray = arr.sort(function (a, b) {
      return a.y - b.y;
    });

    let min = minArray[0].y;
    return min - calculateArrayVariation(arr) * 0.3;
  };

  const getSumArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;
    return arr.reduce((acc, value) => acc + parseFloat(value.y), 0);
  };

  const findKeyJsonArray = (arr, value) => {
    let found = arr.filter((data) => {
      return data.x == value;
    });
    return found;
  };

  const getCurrentYear = (year) => {
    return year.toString();
  };

  const getPreviousYear = (year) => {
    return (year - 1).toString();
  };

  const getCombinedArray = (arr1, arr2) => {
    if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) return arr1.concat(arr2);
    else if (arr1 && arr1.length > 0) return arr1;
    else if (arr2 && arr2.length > 0) return arr2;
    else return [];
  };

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ alignSelf: "center", flexDirection: "row", paddingBottom: 10, gap: 10 }}>
          <TypeCard setItem={setCurrentYear} itemList={[2024, 2023]} />
          <CardWrapper style={{ width: verticalScale(100), alignItems: "center" }}>
            <Text>Split: {getSumArrayObject(splitDeptData[getCurrentYear(currentYear)]).toFixed(0)}€</Text>
          </CardWrapper>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={false} contentContainerStyle={{ flexGrow: 1, gap: verticalScale(10) }}>
            <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
              <View style={styles.chart}>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text>Total Purchase by Month</Text>
                </View>
                <VictoryLine
                  domain={{
                    x: [0, 13],
                    y: [
                      getMinArrayObject(getCombinedArray(splitDeptData[getCurrentYear(currentYear)], splitDeptData[getPreviousYear(currentYear)])),
                      getMaxArrayObject(getCombinedArray(splitDeptData[getCurrentYear(currentYear)], splitDeptData[getPreviousYear(currentYear)])),
                    ],
                  }}
                  padding={{ left: 20 }}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  categories={{ x: months }}
                  data={splitDeptData[getCurrentYear(currentYear)] || []}
                  interpolation="natural"
                  labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                />

                {splitDeptData[getPreviousYear(currentYear)] && (
                  <View style={{ position: "absolute" }}>
                    <VictoryLine
                      domain={{
                        x: [0, 13],
                        y: [
                          getMinArrayObject(
                            getCombinedArray(splitDeptData[getCurrentYear(currentYear)], splitDeptData[getPreviousYear(currentYear)])
                          ),
                          getMaxArrayObject(
                            getCombinedArray(splitDeptData[getCurrentYear(currentYear)], splitDeptData[getPreviousYear(currentYear)])
                          ),
                        ],
                      }}
                      padding={{ left: 20 }}
                      style={{
                        data: { stroke: "blue" },
                        parent: { border: "1px solid #ccc" },
                      }}
                      categories={{ x: months }}
                      data={splitDeptData[getPreviousYear(currentYear)]}
                      interpolation="natural"
                      labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                    />
                  </View>
                )}
              </View>
            </CardWrapper>
            {
              <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
                <View style={styles.chart}>
                  <View style={{ position: "absolute", top: 15 }}>
                    <Text>Total Purchase by Type</Text>
                  </View>
                  {spendByType[getCurrentYear(currentYear)] && (
                    <VictoryBar
                      horizontal
                      cornerRadius={{ top: 5 }}
                      domain={{ y: [-40, getMaxArrayObject(spendByType[getCurrentYear(currentYear)])] }}
                      domainPadding={20}
                      padding={30}
                      style={{
                        data: { stroke: "#c43a31" },
                        labels: { fontSize: 8 },
                        parent: { border: "1px solid #ccc" },
                      }}
                      data={spendByType[getCurrentYear(currentYear)]}
                      interpolation="natural"
                      labels={({ datum }) => datum.x + " " + datum.y.toFixed(0) + "€"}
                    />
                  )}
                </View>
              </CardWrapper>
            }
            {
              <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20, elevation: 0 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>Months</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", color: "darkred" }}>Sent</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", color: "darkgreen" }}>Received</Text>
                  </View>
                </View>
                <View style={styles.chart}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      {months.map((month, i) => (
                        <Text style={{ color: i % 2 ? "black" : "gray" }} key={"M" + month}>
                          {month}
                        </Text>
                      ))}
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      {months.map((month, i) => {
                        let itemSent = 0;
                        i = i.toString();
                        if (transactionStats[getCurrentYear(currentYear)] && transactionStats[getCurrentYear(currentYear)].hasOwnProperty(i)) {
                          itemSent = transactionStats[getCurrentYear(currentYear)][i][TRANSACTION_TYPE[1]];
                        }
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            {itemSent}
                          </Text>
                        );
                      })}
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      {months.map((month, i) => {
                        let itemReceived = 0;
                        i = i.toString();
                        if (transactionStats[getCurrentYear(currentYear)] && transactionStats[getCurrentYear(currentYear)].hasOwnProperty(i)) {
                          itemReceived = transactionStats[getCurrentYear(currentYear)][i][TRANSACTION_TYPE[2]];
                        }
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            {-itemReceived}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </CardWrapper>
            }
            {
              <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
                <View style={styles.chart}>
                  <View style={{ position: "absolute", top: 15 }}>
                    <Text>Total Transaction by Month</Text>
                  </View>
                  {transactionStats[getCurrentYear(currentYear)] && (
                    <VictoryLine
                      domain={{
                        x: [0, 13],
                        y: [
                          getMinArrayObject(transactionStats[getCurrentYear(currentYear)][TRANSACTION_TYPE[0]]),
                          getMaxArrayObject(transactionStats[getCurrentYear(currentYear)][TRANSACTION_TYPE[0]]),
                        ],
                      }}
                      padding={{ left: 20 }}
                      style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc" },
                      }}
                      categories={{ x: months }}
                      data={transactionStats[getCurrentYear(currentYear)][TRANSACTION_TYPE[0]]}
                      interpolation="natural"
                      labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                    />
                  )}
                </View>
              </CardWrapper>
            }
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
