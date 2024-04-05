import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";

//Custom Components
import Header from "../../components/header/header";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";

//Functions
import {
  getPurchaseAverage,
  getPurchaseAverageTotal,
  getTotalPurchaseByType,
  getMonthPurchaseStats,
  getMonthPurchaseTotal,
} from "../../functions/purchase";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { categoryIcons, utilIcons } from "../../assets/icons";

export default function Budget({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [spendAverageByType, setSpendAverageByType] = useState();
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState();
  const [purchaseTotalLastYearByType, setPurchaseTotalLastYearByType] = useState();
  const [purchaseTotal, setPurchaseTotal] = useState();
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState();
  const [purchaseCurrentTotalByType, setPurchaseCurrentTotalByType] = useState();

  const state = {
    tableHead: ["Color", "Type", "Value"],
    tableFlex: [1, 2, 1],
  };

  const getYearProgress = (type, monthValue, monthAverage) => {
    if (!monthValue || !Object.keys(monthValue).includes(type)) return 0;
    return monthValue[type] / monthAverage[type];
  };

  const getMonthProgress = (type, monthValue, monthAverage) => {
    if (!monthValue || !Object.keys(monthValue).includes(type)) return 0;
    return monthValue[type] / monthAverage;
  };

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue) return 0;
    return monthValue / monthAverage;
  };

  const getCurrentValueType = (value, type) => {
    if (!Object.keys(value).includes(type)) return 0;
    return value[type] || 0;
  };

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);
        try {
          let resPurchaseAverageByType,
            resPurchaseAverageTotal,
            resPurchaseTotalLastYearByType,
            resPurchaseTotalCurrentYearByType,
            resPurchaseLastYearAverageByType,
            resPurchaseAverageLastYearTotal;

          // Improve performance by not getting always purchase
          resPurchaseAverageByType = await getPurchaseAverage(email, currentYear, STATS_TYPE[1]).catch((error) => console.log(error));
          resPurchaseLastYearAverageByType = await getPurchaseAverage(email, currentYear - 1, STATS_TYPE[1]).catch((error) => console.log(error));
          resPurchaseAverageTotal = await getPurchaseAverageTotal(email, currentYear, STATS_TYPE[1]);
          resPurchaseAverageLastYearTotal = await getPurchaseAverageTotal(email, currentYear - 1, STATS_TYPE[1]);
          resPurchaseTotalLastYearByType = await getTotalPurchaseByType(email, currentYear - 1);
          resPurchaseTotalCurrentYearByType = await getTotalPurchaseByType(email, currentYear);

          // Current Month Data
          let resPurchaseStats = await getMonthPurchaseStats(email, currentMonth, currentYear, STATS_TYPE[1]).catch((error) => console.log(error));
          let resPurchaseTotal = await getMonthPurchaseTotal(email, currentMonth, currentYear, STATS_TYPE[1]).catch((error) => console.log(error));
          setPurchaseCurrentStats(resPurchaseStats);
          setPurchaseTotal(resPurchaseTotal);

          // Total Purchase by Type
          Object.keys(resPurchaseTotalCurrentYearByType).forEach((type) => {
            if (!Object.keys(resPurchaseTotalLastYearByType).includes(type)) {
              resPurchaseTotalLastYearByType[type] = resPurchaseTotalCurrentYearByType[type];
            }
          });
          setPurchaseTotalLastYearByType(resPurchaseTotalLastYearByType);
          setPurchaseCurrentTotalByType(resPurchaseTotalCurrentYearByType);

          // Total Average Purchase
          // Improve for cases where last year does not have enough data
          if (resPurchaseAverageLastYearTotal && resPurchaseAverageLastYearTotal != 0) {
            setPurchaseAverageTotal(resPurchaseAverageLastYearTotal);
          } else {
            setPurchaseAverageTotal(resPurchaseAverageTotal || 0);
          }

          Object.keys(resPurchaseAverageByType).forEach((type) => {
            if (!Object.keys(resPurchaseLastYearAverageByType).includes(type)) {
              resPurchaseLastYearAverageByType[type] = resPurchaseAverageByType[type];
            }
          });
          let sortedPurchaseLastYearAverageByType = [];
          for (let purchase in resPurchaseLastYearAverageByType) {
            sortedPurchaseLastYearAverageByType.push([purchase, resPurchaseLastYearAverageByType[purchase]]);
          }

          sortedPurchaseLastYearAverageByType.sort((a, b) => b[1] - a[1]);
          setSpendAverageByType(sortedPurchaseLastYearAverageByType);
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
        <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, gap: 10 }}>
          {purchaseAverageTotal && (
            <View
              key={"TotalView"}
              style={{ height: 50, backgroundColor: "lightgray", padding: 5, borderRadius: 5, justifyContent: "center", gap: 5 }}
            >
              <Text key={"TotalText"} style={{ fontWeight: "bold" }}>
                {"Average " + getCurrentValue(purchaseTotal) + "/" + purchaseAverageTotal.toFixed(0)}
              </Text>
              <ProgressBar key={"PTtotal"} progress={getTotalProgress(purchaseTotal, purchaseAverageTotal)} color={"red"} />
            </View>
          )}
          {spendAverageByType &&
            purchaseTotalLastYearByType &&
            spendAverageByType.map(([type, value]) => {
              return (
                <View
                  key={type + "View"}
                  style={{ flexDirection: "row", height: "auto", backgroundColor: "lightgray", gap: 5, padding: 5, borderRadius: 5 }}
                >
                  <View style={{ justifyContent: "center", width: 50, backgroundColor: "transparent" }}>
                    <View>{categoryIcons(25).find((category) => category.label === type).icon}</View>
                    <Text key={type + "TextA"} style={{ fontSize: 10, alignContent: "center", justifyContent: "center", textAlign: "center" }}>
                      {type.substring(0, 7)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", gap: 5 }}>
                    <View>
                      <Text key={type + "TextT"}>
                        {"Total " +
                          getCurrentValueType(purchaseCurrentTotalByType, type).toFixed(0) +
                          "/" +
                          purchaseTotalLastYearByType[type].toFixed(0)}
                      </Text>
                      <ProgressBar
                        key={"PT" + type}
                        progress={getYearProgress(type, purchaseCurrentTotalByType, purchaseTotalLastYearByType)}
                        color={"red"}
                      />
                    </View>
                    <View>
                      <Text key={type + "TextM"}>
                        {"Monthly " + getCurrentValueType(purchaseCurrentStats, type).toFixed(0) + "/" + value.toFixed(0)}
                      </Text>
                      <ProgressBar key={"PM" + type} progress={getMonthProgress(type, purchaseCurrentStats, value)} color={"blue"} />
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
