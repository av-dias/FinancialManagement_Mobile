import navLogo from "../../images/logo.png";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, TextInput, Image, Pressable, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLegend } from "victory-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { Card } from "@rneui/themed";

import { saveToStorage, getFromStorage } from "../../utility/secureStorage";
import { getPurchaseStats, getPurchaseTotal } from "../../functions/purchase";
import { horizontalScale, verticalScale, moderateScale } from "../../utility/responsive";
import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { getUser } from "../../functions/basic";

import Header from "../../components/header";

export default function Home({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [pieChartData, setPieChartData] = useState([{ x: " ", y: 1 }]);
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

  const state = {
    tableHead: ["", "Type", "Value"],
    tableFlex: [1, 3, 2],
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
            arrayTables.push([<FontAwesome name="circle" size={24} color={_color} style={styles.textCenter} />, key, res[key] + " €"]);
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
          <View style={{ maxHeight: "80%", width: "70%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.hitBox}
              onPress={() => {
                previousMonth();
              }}
            >
              <AntDesign style={styles.iconCenter} name="left" size={15} color="black" />
            </TouchableOpacity>
            <Card borderRadius={10} containerStyle={{ marginTop: 0, width: 170, marginHorizontal: -horizontalScale(5) }}>
              <View style={styles.rowGap}>
                <View style={{ flex: 1 }}>
                  <Feather name="calendar" size={24} color="black" />
                </View>
                <View style={{ flex: 4 }}>
                  <Text style={styles.text}>{getCurrentDate()}</Text>
                </View>
              </View>
            </Card>
            <TouchableOpacity
              style={styles.hitBox}
              onPress={() => {
                nextMonth();
              }}
            >
              <AntDesign style={styles.iconCenter} name="right" size={15} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {
          // Only show chart and table if there is data to be displayed, otherwise just show "No data available" message
        }
        {purchaseTotal !== "0.00" ? (
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
              <View style={{ bottom: "55%", justifyContent: "center", alignContent: "center" }}>
                <Text style={{ alignSelf: "center" }}>{purchaseTotal + " €"}</Text>
              </View>
            </View>
            <View style={{ flex: 2 }}>
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
