import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import Header from "../../components/header/header";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE } from "../../utility/keys";

//Functions
import { calcExpensesAverage, calcExpensesByType, calcExpensesTotalFromType, calcTotalExpensesByType } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import Statistics from "../stats/statistics";
import { AverageProgressBar } from "./components/AverageProgressBar";
import { StatsProgressBar } from "./components/StatsProgressBar";
import { ProgressItemsHeader } from "./components/ProgressItemsHeader";
import { logTimeTook } from "../../utility/logger";

export default function Budget({ navigation }) {
  const styles = _styles;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth().toString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());

  const [spendAverageByType, setSpendAverageByType] = useState({});
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState({});
  const [purchaseTotal, setPurchaseTotal] = useState({});
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState({});
  const [expensesTotalByType, setExpensesTotalByType] = useState({});

  const appCtx = useContext(AppContext);

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
        const startTime = performance.now();

        /* 
            TODO: Enable Previous Year Data
            TODO: If the average previous year does not have a type make the current one
        */
        let [resTotal, resType] = calcExpensesAverage(appCtx.expenses, parseFloat(currentYear));
        let resTotalExpensesByType = calcTotalExpensesByType(appCtx.expenses, parseFloat(currentYear));

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

        if (appCtx.expenses[parseFloat(currentYear) - 1]) {
          let [resTotalPrev, resTypePrev] = calcExpensesAverage(appCtx.expenses, parseFloat(currentYear) - 1);
          let resTotalExpensesByTypePrev = calcTotalExpensesByType(appCtx.expenses, parseFloat(currentYear) - 1);

          resTotal = { ...resTotal, ...resTotalPrev };
          resType = { ...resType, ...resTypePrev };
          resTotalExpensesByType = { ...resTotalExpensesByType, ...resTotalExpensesByTypePrev };
        }

        // Sort the average expenses by the most expensive type to least expensive
        resType[currentYear][STATS_TYPE[1]] = Object.fromEntries(Object.entries(resType[currentYear][STATS_TYPE[1]]).sort(([, a], [, b]) => Number(b) - Number(a)));

        setSpendAverageByType(resType);
        setPurchaseAverageTotal(resTotal);
        setPurchaseCurrentStats(resExpensesByType);
        setPurchaseTotal(resExpensesTotal);
        setExpensesTotalByType(resTotalExpensesByType);

        const endTime = performance.now();
        logTimeTook("Budget", "useFocusEffect", endTime, startTime);
      }
    }, [appCtx.expenses])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 20 }}>
          {purchaseAverageTotal[currentYear] && <AverageProgressBar purchaseTotal={purchaseTotal} purchaseAverageTotal={purchaseAverageTotal} currentYear={currentYear} />}
          <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={styles.scrollviewContainer}>
            <Statistics />
            <ProgressItemsHeader />
            {spendAverageByType[currentYear] &&
              purchaseCurrentStats[currentYear] &&
              expensesTotalByType[currentYear] &&
              Object.keys(spendAverageByType[currentYear][STATS_TYPE[1]]).map((type) => {
                return (
                  <StatsProgressBar
                    key={`StatsProgressBar${type}`}
                    type={type}
                    spendAverageByType={spendAverageByType}
                    expensesTotalByType={expensesTotalByType}
                    purchaseCurrentStats={purchaseCurrentStats}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                  />
                );
              })}
            {!spendAverageByType[currentYear] && !purchaseCurrentStats[currentYear] && !expensesTotalByType[currentYear] && (
              <View style={styles.containerNoData}>
                <Text style={{ color: "white" }}>NO DATA</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
