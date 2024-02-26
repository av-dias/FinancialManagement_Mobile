import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Table, TableWrapper, Cell } from "react-native-table-component";
import { LinearGradient } from "expo-linear-gradient";

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
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { refinePurchaseStats } from "./handler";

export default function Budget({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [spendAverageByType, setSpendAverageByType] = useState();
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState();

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
          let resPurchaseAverage, resPurchaseAverageTotal;

          resPurchaseAverage = await getPurchaseAverage(email, currentYear, STATS_TYPE[1]).catch((error) => console.log(error));
          resPurchaseAverageTotal = await getPurchaseAverageTotal(email, currentYear, STATS_TYPE[1]);

          setPurchaseAverageTotal(resPurchaseAverageTotal);
          setSpendAverageByType(resPurchaseAverage);

          console.log(resPurchaseAverage);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, [currentYear])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {spendAverageByType && (
            <View key={"TotalView"} style={{ flex: 1, backgroundColor: "lightgray" }}>
              <Text key={"TotalText"}>{"Average" + ": " + purchaseAverageTotal}</Text>
            </View>
          )}
          {spendAverageByType &&
            Object.keys(spendAverageByType).map((type) => {
              return (
                <View key={type + "View"} style={{ flex: 1, backgroundColor: "lightgray" }}>
                  <Text key={type + "Text"}>{type + " " + spendAverageByType[type].toFixed(0)}</Text>
                </View>
              );
            })}
        </View>
      </View>
    </LinearGradient>
  );
}
