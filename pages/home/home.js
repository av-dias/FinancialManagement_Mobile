import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, TextInput, Image, Pressable, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLegend } from "victory-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { Card } from "@rneui/themed";
import { Divider } from "react-native-paper";

import { saveToStorage, getFromStorage } from "../../utility/secureStorage";
import { getPurchaseStats, getPurchaseTotal } from "../../functions/purchase";
import { horizontalScale, verticalScale, moderateScale, largeScale } from "../../utility/responsive";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import CalendarCard from "../../components/calendarCard/calendarCard";

import Header from "../../components/header/header";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [spendByType, setSpendByType] = useState([[""]]);

  const [purchaseTotal, setPurchaseTotal] = useState("0.00");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  const state = {
    tableHead: ["", "Type", "Value"],
    tableFlex: [1, 2, 1],
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = await getPurchaseStats(email, currentMonth).catch((error) => console.log(error));
          let array = [];
          let arrayTables = [];
          Object.keys(res).forEach((key) => {
            let _color = generateColor();
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

          res = await getPurchaseTotal(email, currentMonth).catch((error) => console.log(error));
          setPurchaseTotal(res);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [purchaseTotal, currentMonth, currentYear])
  );

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={styles.calendar}>
          <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
        </View>
        {
          // Only show chart and table if there is data to be displayed, otherwise just show "No data available" message
        }
        {pieChartData.length !== 0 ? (
          <View style={{ flex: 8 }}>
            <View style={styles.chart}>
              <VictoryPie
                height={verticalScale(400)}
                innerRadius={horizontalScale(80)}
                data={pieChartData.length != 0 ? pieChartData : [{ x: "Your Spents", y: 1 }]}
                style={{
                  data: {
                    fill: ({ datum }) => datum.color,
                  },
                }}
                labelComponent={<VictoryLabel style={[{ fontSize: 10 }]} />}
                options={{ maintainAspectRatio: false, aspectRatio: 1 }}
              />
              <View style={{ position: "absolute", bottom: "47%", justifyContent: "center", alignContent: "center" }}>
                <Text style={{ alignSelf: "center", fontSize: verticalScale(20) }}>{purchaseTotal + " €"}</Text>
              </View>
            </View>
            <View style={{ flex: 4 }}>
              <View style={styles.tableInfo}>
                <Table style={{ ...styles.textCenter }} borderStyle={{ borderColor: "transparent" }}>
                  <Row flexArr={state.tableFlex} data={state.tableHead} textStyle={styles.textCenterHead} />
                  <ScrollView style={{ height: "90%" }}>
                    {spendByType.map((rowData, index) => (
                      <TableWrapper key={index} style={styles.rowTable}>
                        {rowData.map((cellData, cellIndex) => (
                          <Cell style={{ flex: state.tableFlex[cellIndex] }} key={cellIndex} data={cellData} textStyle={styles.textCenter} />
                        ))}
                      </TableWrapper>
                    ))}
                  </ScrollView>
                </Table>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
            <Text>NO DATA</Text>
          </View>
        )}
      </View>
    </View>
  );
}
