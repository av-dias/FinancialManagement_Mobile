import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, TextInput, Image, Pressable, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLegend } from "victory-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { LinearGradient } from "expo-linear-gradient";

import { getPurchaseStats, getPurchaseTotal, getPurchaseAverage, getPurchaseAverageTotal } from "../../functions/purchase";
import { horizontalScale, verticalScale, moderateScale, largeScale, heightTreshold } from "../../functions/responsive";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import CalendarCard from "../../components/calendarCard/calendarCard";
import TypeCard from "../../components/ScrollCard/ScrollCard";
import { categoryIcons } from "../../assets/icons";

import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [spendByType, setSpendByType] = useState([[""]]);

  const [purchaseTotal, setPurchaseTotal] = useState("0.00");
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState({});
  const [purchaseAverage, setPurchaseAverage] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [statsType, setStatsType] = useState(STATS_TYPE[0]);
  const [statsMode, setStatsMode] = useState(STATS_MODE[0]);

  const state = {
    tableHead: ["Color", "Type", "Value"],
    tableFlex: [1, 2, 1],
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = await getPurchaseStats(email, currentMonth, currentYear, statsType).catch((error) => console.log(error));
          let array = [];
          let arrayTables = [];
          Object.keys(res).forEach((key) => {
            let _color;

            categoryIcons().find((type) => {
              if (type.label === key) {
                _color = type.color;
              }
            });
            array.push({ x: " ", y: res[key], color: _color });
            arrayTables.push([
              <FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />,
              key,
              parseFloat(res[key]).toFixed(0) + " €",
            ]);
          });
          setPieChartData(array);
          setSpendByType(
            arrayTables.sort(function (a, b) {
              return b[2] - a[2];
            })
          );

          res = await getPurchaseTotal(email, currentMonth, currentYear, statsType).catch((error) => console.log(error));
          setPurchaseTotal(res);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [purchaseTotal, currentMonth, currentYear, email, statsType])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let array = [];
          let arrayTables = [];

          res = await getPurchaseAverage(email, currentYear, statsType).catch((error) => console.log(error));

          Object.keys(res).forEach((key) => {
            let _color;

            categoryIcons().find((type) => {
              if (type.label === key) {
                _color = type.color;
              }
            });
            array.push({ x: " ", y: res[key], color: _color });
            arrayTables.push([
              <FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />,
              key,
              parseFloat(res[key]).toFixed(0) + " €",
            ]);
          });
          setPurchaseAverage(
            arrayTables.sort(function (a, b) {
              return b[2] - a[2];
            })
          );

          let a = await getPurchaseAverageTotal(email, currentYear, statsType);
          setPurchaseAverageTotal(a);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [currentYear, statsType, statsMode])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {pieChartData.length !== 0 ? (
          <View style={{ flex: 8, gap: verticalScale(10) }}>
            <CardWrapper
              style={{ flex: verticalScale(8), justifyContent: "center", alignItems: "center", backgroundColor: "transparent", elevation: 0 }}
            >
              <View style={styles.chart}>
                <VictoryPie
                  height={horizontalScale(320)}
                  innerRadius={horizontalScale(130)}
                  padding={{ top: 0, bottom: 0 }}
                  data={pieChartData.length != 0 ? pieChartData : [{ x: "Your Spents", y: 1 }]}
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
                    {statsMode == STATS_MODE[0] ? purchaseTotal : purchaseAverageTotal + "€"}
                  </Text>
                  {statsMode == STATS_MODE[0] ? (
                    <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
                  ) : null}
                </View>
              </View>
            </CardWrapper>
            <View style={{ flex: 1, alignSelf: "flex-end", flexDirection: "row", maxHeight: 35, gap: 10 }}>
              <TypeCard setItem={setStatsType} itemList={STATS_TYPE} />
              <TypeCard setItem={setStatsMode} itemList={STATS_MODE} />
            </View>
            <View style={{ flex: 4 }}>
              <CardWrapper style={{ height: "95%" }}>
                <View style={styles.tableInfo}>
                  <Table style={{ ...styles.textCenter }} borderStyle={{ borderColor: "transparent" }}>
                    <ScrollView style={{ height: "100%", background: "transparent" }}>
                      {statsMode === STATS_MODE[0]
                        ? spendByType.map((rowData, index) => (
                            <TableWrapper key={index} style={styles.rowTable}>
                              {rowData.map((cellData, cellIndex) => (
                                <Cell style={{ flex: state.tableFlex[cellIndex] }} key={cellIndex} data={cellData} textStyle={styles.textCenter} />
                              ))}
                            </TableWrapper>
                          ))
                        : purchaseAverage.map((rowData, index) => (
                            <TableWrapper key={index} style={styles.rowTable}>
                              {rowData.map((cellData, cellIndex) => (
                                <Cell style={{ flex: state.tableFlex[cellIndex] }} key={cellIndex} data={cellData} textStyle={styles.textCenter} />
                              ))}
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
            <Text>NO DATA</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
