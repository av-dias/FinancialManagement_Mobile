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
import { calcExpensesAverage, calcExpensesByType, calcExpensesTotalFromType, calcTotalExpensesByType } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

export default function Budget({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth().toString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());

  const [spendAverageByType, setSpendAverageByType] = useState({});
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState({});
  const [purchaseTotal, setPurchaseTotal] = useState({});
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState({});
  const [expensesTotalByType, setExpensesTotalByType] = useState({});

  const appCtx = useContext(AppContext);

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0) return 0;
    return monthValue / monthAverage;
  };

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };

  const getLastAvailableAverageTypeValue = (data, currentYear, type) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]].hasOwnProperty(type)) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]][type]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]][type]).toFixed(0);
    }
  };

  const getLastAvailableAverageValue = (data, currentYear) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]]) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]]).toFixed(0);
    }
  };

  const getLastAvailableTypeValue = (data, currentYear, type) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]].hasOwnProperty(type)) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]][type]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]][type]).toFixed(0);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (
        appCtx &&
        appCtx.expenses &&
        appCtx.expenses.hasOwnProperty(currentYear) &&
        appCtx.expenses[currentYear].hasOwnProperty(currentMonth) &&
        appCtx.expenses[currentYear][currentMonth].length > 0
      ) {
        console.log("Budget: Fetching app data...");
        startTime = performance.now();

        /* 
            TODO: Enable Previous Year Data
            TODO: If the average previous year does not have a type make the current one
        */
        let [resTotal, resType] = calcExpensesAverage(appCtx.expenses, currentYear);
        let resTotalExpensesByType = calcTotalExpensesByType(appCtx.expenses, currentYear);

        let resExpensesByType = { ...resType },
          resExpensesTotal;

        if (appCtx.expenses[currentYear][currentMonth]) {
          resExpensesByType = calcExpensesByType(appCtx.expenses[currentYear][currentMonth]);
          resExpensesTotal = calcExpensesTotalFromType(resExpensesByType[currentYear][currentMonth]);
        } else {
          // TODO: If no data for current year and month
          Object.keys(resType[currentYear]).forEach((statsType) => {
            Object.keys(resType[currentYear][statsType]).forEach((type) => {
              resExpensesByType[currentYear][statsType][type] = 0;
            });
          });

          resExpensesTotal = { [currentYear]: { [STATS_TYPE[0]]: 0, [STATS_TYPE[1]]: 0 } };
        }

        if (appCtx.expenses[currentYear - 1]) {
          let [resTotalPrev, resTypePrev] = calcExpensesAverage(appCtx.expenses, currentYear - 1);
          let resTotalExpensesByTypePrev = calcTotalExpensesByType(appCtx.expenses, currentYear - 1);

          resTotal = { ...resTotal, ...resTotalPrev };
          resType = { ...resType, ...resTypePrev };
          resTotalExpensesByType = { ...resTotalExpensesByType, ...resTotalExpensesByTypePrev };
        }

        setSpendAverageByType(resType);
        setPurchaseAverageTotal(resTotal);
        setPurchaseCurrentStats(resExpensesByType);
        setPurchaseTotal(resExpensesTotal);
        setExpensesTotalByType(resTotalExpensesByType);

        endTime = performance.now();
        console.log(`--> Call to Budget useFocusEffect took ${endTime - startTime} milliseconds.`);
      }
    }, [appCtx.expenses])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, gap: 10 }}>
          {purchaseAverageTotal[currentYear] && (
            <View
              key={"TotalView"}
              style={{ height: 50, backgroundColor: dark.complementary, padding: 5, borderRadius: 5, justifyContent: "center", gap: 5 }}
            >
              {
                <Text key={"TotalText"} style={{ fontWeight: "bold", color: dark.textPrimary }}>
                  {"Average " + getCurrentValue(purchaseTotal[STATS_TYPE[1]]) + "/" + getLastAvailableAverageValue(purchaseAverageTotal, currentYear)}
                </Text>
              }
              {
                <ProgressBar
                  key={"PTtotal"}
                  progress={getTotalProgress(
                    getCurrentValue(purchaseTotal[STATS_TYPE[1]]),
                    getLastAvailableAverageValue(purchaseAverageTotal, currentYear)
                  )}
                  color={"darkred"}
                />
              }
            </View>
          )}
          {spendAverageByType[currentYear] &&
            purchaseCurrentStats[currentYear] &&
            expensesTotalByType[currentYear] &&
            Object.keys(spendAverageByType[currentYear][STATS_TYPE[1]]).map((type) => {
              let lastAverageTypeValue = getLastAvailableAverageTypeValue(spendAverageByType, currentYear, type);
              let lastTotalTypeValue = getLastAvailableTypeValue(expensesTotalByType, currentYear, type);
              let currentTypeValue = 0,
                currentTotalTypeValue = 0;

              if (purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]].hasOwnProperty(type)) {
                currentTypeValue = parseFloat(purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]][type]).toFixed(0);
              }
              if (expensesTotalByType[currentYear][STATS_TYPE[1]].hasOwnProperty(type)) {
                currentTotalTypeValue = parseFloat(expensesTotalByType[currentYear][STATS_TYPE[1]][type]).toFixed(0);
              }

              return (
                <View
                  key={type + "View"}
                  style={{ flexDirection: "row", height: "auto", backgroundColor: dark.complementary, gap: 5, padding: 10, borderRadius: 5 }}
                >
                  <View style={{ justifyContent: "center", width: 50, backgroundColor: "transparent" }}>
                    <View
                      style={{
                        width: verticalScale(40),
                        maxWidth: 50,
                        height: verticalScale(40),
                        maxHeight: 50,
                        backgroundColor: categoryIcons(25).find((category) => category.label === type).color,
                        borderRadius: commonStyles.borderRadius,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      {categoryIcons(25).find((category) => category.label === type).icon}
                    </View>
                    <Text
                      key={type + "TextA"}
                      style={{ fontSize: 10, alignContent: "center", justifyContent: "center", textAlign: "center", color: dark.textPrimary }}
                    >
                      {type.substring(0, 7)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", gap: 5 }}>
                    <View>
                      <Text key={type + "TextT"} style={{ color: dark.textPrimary }}>
                        {"Total " + currentTotalTypeValue + "/" + lastTotalTypeValue}
                      </Text>
                      <ProgressBar key={"PT" + type} progress={getTotalProgress(currentTotalTypeValue, lastTotalTypeValue)} color={"darkred"} />
                    </View>
                    <View>
                      <Text key={type + "TextM"} style={{ color: dark.textPrimary }}>
                        {"Monthly " + currentTypeValue + "/" + lastAverageTypeValue}
                      </Text>
                      <ProgressBar key={"PM" + type} progress={getTotalProgress(currentTypeValue, lastAverageTypeValue)} color={"blue"} />
                    </View>
                  </View>
                </View>
              );
            })}
          {!spendAverageByType[currentYear] && !purchaseCurrentStats[currentYear] && !expensesTotalByType[currentYear] && (
            <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "white" }}>NO DATA</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
