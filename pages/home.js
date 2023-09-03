import navLogo from "../images/logo.png";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, TextInput, Image, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLegend } from "victory-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { Card } from "@rneui/themed";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { getPurchaseStats, getPurchaseTotal } from "../functions/purchase";
import { _styles } from "../utility/style";
import { months } from "../utility/calendar";
import { getUser } from "../functions/basic";

import Header from "../components/header";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [purchaseStats, setPurchaseStats] = useState({ "Your Spents": 0 });
  const [pieChartData, setPieChartData] = useState([{ x: "Your Spents", y: 1 }]);
  const [pieChartDataDetails, setPieChartDataDetails] = useState([[""]]);

  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let res = await getPurchaseStats(email).catch((error) => console.log(error));
          let array = [];
          let arrayTables = [];
          Object.keys(res).forEach((key) => {
            let _color = generateColor();
            array.push({ x: " ", y: res[key], color: _color });
            arrayTables.push([<FontAwesome name="circle" size={24} color={_color} style={{ textAlign: "center" }} />, key, res[key]]);
          });
          console.log(generateColor());
          setPieChartData(array);
          setPurchaseStats(res);
          setPieChartDataDetails(
            arrayTables.sort(function (a, b) {
              return b[2] - a[2];
            })
          );
          //console.log(arrayTables);

          res = await getPurchaseTotal(email).catch((error) => console.log(error));
          setPurchaseTotal(res);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [purchaseTotal])
  );

  const getCurrentDate = () => {
    return months[currentMonth] + " " + currentYear;
  };

  const previousMonth = () => {
    if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
    else {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth < 11) setCurrentMonth(currentMonth + 1);
    else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  const checkPosition = () => {
    let value = purchaseTotal.toString();
    let size = value.length;
    let baseAnchor = 50;
    // 10 -> 47.5
    // 1000 -> 45.5
    let leftValue = baseAnchor - size + ".5%";
    return { left: leftValue, bottom: "-50%" };
  };

  const state = {
    tableHead: ["", "Type", "Value"],
    tableFlex: [1, 3, 2],
  };

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View>
        <View style={styles.calendar}>
          <Card borderRadius={10}>
            <View style={styles.rowGap}>
              <AntDesign
                style={styles.iconCenter}
                onPress={() => {
                  previousMonth();
                }}
                name="left"
                size={20}
                color="black"
              />
              <Feather name="calendar" size={24} color="black" />
              <Text style={styles.text}>{getCurrentDate()}</Text>
              <AntDesign
                name="right"
                size={20}
                onPress={() => {
                  nextMonth();
                }}
                color="black"
              />
            </View>
          </Card>
        </View>
        <View style={styles.chart}>
          <Text style={checkPosition()}>{purchaseTotal}</Text>
          <VictoryPie
            innerRadius={80}
            data={pieChartData.length != 0 ? pieChartData : [{ x: "Your Spents", y: 1 }]}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
            }}
            labelComponent={
              <VictoryLabel
                angle={({ datum }) => {
                  /*console.log(datum.x + " " + (datum.startAngle + 35));
                 let angle = datum.startAngle + 35;
                if (angle > 150 && angle < 200) return datum.startAngle + 35 - 180;
                else if (angle > 0 && angle < 45) return 0;
                else return datum.startAngle + 35; */
                  return 0;
                }}
                style={[{ fontSize: 10 }]}
              />
            }
          />
        </View>
        <View style={{ height: 100 }}>
          <View style={styles.tableInfo}>
            <Table style={{ textAlign: "center" }} borderStyle={{ borderColor: "transparent" }}>
              <Row flexArr={state.tableFlex} data={state.tableHead} textStyle={{ textAlign: "center" }} />
              <ScrollView>
                {pieChartDataDetails.map((rowData, index) => (
                  <TableWrapper key={index} style={styles.rowTable}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell style={{ flex: state.tableFlex[cellIndex] }} key={cellIndex} data={cellData} textStyle={{ textAlign: "center" }} />
                    ))}
                  </TableWrapper>
                ))}
              </ScrollView>
            </Table>
          </View>
        </View>
      </View>
    </View>
  );
}
