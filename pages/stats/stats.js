import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryChart, VictoryLine, VictoryBar, VictoryScatter } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import TypeCard from "../../components/typeCard/typeCard";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, STATS_MODE, TRANSACTION_TYPE } from "../../utility/keys";
import { months } from "../../utility/calendar";

//Functions
import { getPurchaseStats, getPurchaseTotal } from "../../functions/purchase";
import { heightTreshold, horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { getTransactions, getTransactionStats, getTransactionTotalReceived, getTransactionTotalSent } from "../../functions/transaction";
import { isCtxLoaded } from "./handler";

export default function Stats({ navigation }) {
  const styles = _styles;

  const [ctxValue, setCtxValue] = useState({});

  const [splitDeptData, setSplitDeptData] = useState({});
  const [spendByType, setSpendByType] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth().toString());
  const [transactionStats, setTransactionStats] = useState({});

  const appCtx = useContext(AppContext);

  useFocusEffect(
    React.useCallback(() => {
      let currDateYear = currentYear.toString();
      let currDateMonth = currentMonth.toString();

      function fetchData() {
        if (isCtxLoaded(appCtx, currDateYear, currDateMonth)) {
          const value = {
            expenseByType: appCtx.expenseByType,
            transactionTotal: appCtx.transactionTotal,
            splitDept: appCtx.splitDept,
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

      function fetchData() {
        if (isCtxLoaded(ctxValue, currDateYear, currDateMonth)) {
          console.log("Stats: Fetching app data...");
          startTime = performance.now();
          let resSplitDeptData = {},
            resAggregateSpendByType = {},
            resSpendByType = {},
            resTransactionTotal = ctxValue.transactionTotal;

          // Load Split Dept Data
          for (let year of Object.keys(ctxValue.splitDept)) {
            let monthsList = Object.keys(ctxValue.splitDept[year]);
            // Add dummy data when only one months data is available
            if (monthsList.length == 1) {
              let indexMonth;
              if (monthsList[0] == 0) {
                indexMonth = 1;
              } else indexMonth = monthsList[0] - 1;
              resSplitDeptData[year] = [{ x: months[indexMonth], y: 10 }];
            }
            for (let month of Object.keys(ctxValue.splitDept[year])) {
              if (!resSplitDeptData[year]) {
                resSplitDeptData[year] = [];
              }

              resSplitDeptData[year].push({ x: months[month], y: ctxValue.splitDept[year][month] });
            }
          }
          setSplitDeptData(resSplitDeptData);

          // Aggregate Spend by Type
          for (let year of Object.keys(ctxValue.expenseByType)) {
            for (let month of Object.keys(ctxValue.expenseByType[year])) {
              for (let type of Object.keys(ctxValue.expenseByType[year][month][STATS_TYPE[0]])) {
                if (!resAggregateSpendByType[year]) {
                  resAggregateSpendByType[year] = { [type]: 0 };
                }

                if (!resAggregateSpendByType[year][type]) {
                  resAggregateSpendByType[year][type] = 0;
                }

                resAggregateSpendByType[year][type] += ctxValue.expenseByType[year][month][STATS_TYPE[0]][type];
              }
            }
          }
          // Load Split Dept Data
          for (let year of Object.keys(resAggregateSpendByType)) {
            for (let type of Object.keys(resAggregateSpendByType[year])) {
              if (!resSpendByType[year]) {
                resSpendByType[year] = [];
              }

              resSpendByType[year].push({ x: type, y: resAggregateSpendByType[year][type] });
            }
          }
          setSpendByType(resSpendByType);

          // Load Transaction Stats
          for (let year of Object.keys(ctxValue.transactionTotal)) {
            resTransactionTotal[year][TRANSACTION_TYPE[0]] = [];
            for (let month of Object.keys(ctxValue.transactionTotal[year])) {
              if (month == TRANSACTION_TYPE[0]) continue;
              if (!resTransactionTotal[year][TRANSACTION_TYPE[0]]) resTransactionTotal[year][TRANSACTION_TYPE[0]] = [];

              resTransactionTotal[year][TRANSACTION_TYPE[0]].push({
                x: months[month],
                y: parseFloat(ctxValue.transactionTotal[year][month][TRANSACTION_TYPE[0]]),
              });
            }
          }
          setTransactionStats(resTransactionTotal);
          endTime = performance.now();
          console.log(`--> Call to Stats useFocusEffect took ${endTime - startTime} milliseconds.`);
        }
      }
      fetchData();
    }, [ctxValue])
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
