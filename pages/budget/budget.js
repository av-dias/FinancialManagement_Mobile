import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import Header from "../../components/header/header";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";

//Functions
import { categoryIcons, utilIcons } from "../../assets/icons";
import { isCtxLoaded } from "./handler";

export default function Budget({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth().toString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [ctxValue, setCtxValue] = useState({});

  const [spendAverageByType, setSpendAverageByType] = useState({});
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState({});
  const [purchaseTotal, setPurchaseTotal] = useState({});
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState({});

  const appCtx = useContext(AppContext);

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue) return 0;
    return monthValue / monthAverage;
  };

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };

  const getLastAvailableAverageValue = (data, currentYear, type) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]].hasOwnProperty(type)) {
      return data[currentYear - 1][STATS_TYPE[1]][type];
    } else {
      return data[currentYear][STATS_TYPE[1]][type];
    }
  };

  const getLastAvailableValue = (data, currentYear, currentMonth, type) => {
    if (
      data[parseFloat(currentYear) - 1] &&
      data[parseFloat(currentYear) - 1][currentMonth] &&
      data[parseFloat(currentYear) - 1][currentMonth][STATS_TYPE[1]].hasOwnProperty(type)
    ) {
      return data[currentYear - 1][currentMonth][STATS_TYPE[1]][type];
    } else {
      return data[currentYear][currentMonth][STATS_TYPE[1]][type];
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let currDateYear = currentYear.toString();
      let currDateMonth = currentMonth.toString();
      function fetchData() {
        if (isCtxLoaded(appCtx, currDateYear, currDateMonth)) {
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
      if (isCtxLoaded(ctxValue, currDateYear, currDateMonth)) {
        console.log("Budget: Fetching app data...");
        startTime = performance.now();

        setSpendAverageByType(ctxValue.totalExpensesByTypeAverage);
        setPurchaseAverageTotal(ctxValue.totalExpensesAverage);
        setPurchaseCurrentStats(ctxValue.expenseByType);
        setPurchaseTotal(ctxValue.totalExpense);

        endTime = performance.now();
        console.log(`--> Call to Budget useFocusEffect took ${endTime - startTime} milliseconds.`);
      }
    }, [ctxValue])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, gap: 10 }}>
          {purchaseAverageTotal[currentYear] && (
            <View
              key={"TotalView"}
              style={{ height: 50, backgroundColor: "lightgray", padding: 5, borderRadius: 5, justifyContent: "center", gap: 5 }}
            >
              <Text key={"TotalText"} style={{ fontWeight: "bold" }}>
                {"Average " +
                  getCurrentValue(purchaseTotal[currentYear][currentMonth][STATS_TYPE[1]]) +
                  "/" +
                  purchaseAverageTotal[currentYear][STATS_TYPE[1]].toFixed(0)}
              </Text>
              <ProgressBar
                key={"PTtotal"}
                progress={getTotalProgress(purchaseTotal[currentYear][currentMonth][STATS_TYPE[1]], purchaseAverageTotal[currentYear][STATS_TYPE[1]])}
                color={"red"}
              />
            </View>
          )}
          {spendAverageByType[currentYear] &&
            purchaseCurrentStats[currentYear] &&
            Object.keys(spendAverageByType[currentYear][STATS_TYPE[1]]).map((type) => {
              let lastAverageTypeValue = parseFloat(getLastAvailableAverageValue(spendAverageByType, currentYear, type)).toFixed(0);
              let currentTypeValue = 0;
              if (purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]].hasOwnProperty(type)) {
                currentTypeValue = parseFloat(purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]][type]).toFixed(0);
              }
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
                      <Text key={type + "TextT"}>{"Total " + currentTypeValue + "/" + lastAverageTypeValue}</Text>
                      <ProgressBar key={"PT" + type} progress={getTotalProgress(currentTypeValue, lastAverageTypeValue)} color={"red"} />
                    </View>
                    <View>
                      <Text key={type + "TextM"}>{"Monthly " + currentTypeValue + "/" + lastAverageTypeValue}</Text>
                      <ProgressBar key={"PM" + type} progress={getTotalProgress(currentTypeValue, lastAverageTypeValue)} color={"blue"} />
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
