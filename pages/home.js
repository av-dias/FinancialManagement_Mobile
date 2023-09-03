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

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("Fetching month " + months[currentMonth]);
        console.log("Fetching year " + currentYear);
        let email = await getUser();
        setEmail(email);
        try {
          let res = await getPurchaseStats(email).catch((error) => console.log(error));
          let array = [];
          let arrayTables = [];
          Object.keys(res).forEach((key) => {
            array.push({ x: key, y: res[key] });
            arrayTables.push([key, res[key]]);
          });
          setPieChartData(array);
          setPurchaseStats(res);
          setPieChartDataDetails(arrayTables);
          console.log(array);

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
    tableHead: ["Type", "Value"],
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
        <View style={{ height: 120 }}>
          <ScrollView style={styles.tableInfo}>
            <Table borderStyle={{ borderColor: "transparent" }}>
              <Row data={state.tableHead} style={{ alignContent: "center" }} />
              {pieChartDataDetails.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={cellData} />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
