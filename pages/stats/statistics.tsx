import React, { useState } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import { _styles } from "./style";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../components/header/header";
import TypeCard from "../../components/typeCard/typeCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { verticalScale } from "../../functions/responsive";
import { ChartCard } from "./components/ChartCard";
import { calculateSpendByType, calculateSplitData, calculateSplitDeptData, calculateTransactionStats } from "../../functions/statistics";
import { BarCard } from "./components/BarCard";

export default function Statistics({ navigation }) {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [splitTotal, setSplitTotal] = useState(0);
  const [splitDeptData, setSplitDeptData] = useState({});
  const [spendByType, setSpendByType] = useState({});
  const [transactionStats, setTransactionStats] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        // TODO: Enable Previous Year Data
        if (appCtx && appCtx.expenses && appCtx.expenses.hasOwnProperty(currentYear)) {
          let resExpensesTotal = calculateSplitData(appCtx.expenses, currentYear);

          // No Expenses, then end
          if (!resExpensesTotal) return;

          let resSplitDeptData = calculateSplitDeptData(resExpensesTotal, currentYear);
          setSplitDeptData(resSplitDeptData);
          let resTransactionTotal = calculateTransactionStats(appCtx.expenses, currentYear);
          setTransactionStats(resTransactionTotal);
          let resSpendByType = calculateSpendByType(appCtx.expenses, currentYear);
          setSpendByType(resSpendByType);
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      console.log(`Stats: Fetch took ${endTime - startTime} milliseconds.`);
    }, [appCtx.expenses, currentYear])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ alignSelf: "center", flexDirection: "row", paddingBottom: 10, gap: 10 }}>
          <TypeCard setItem={setCurrentYear} itemList={[2024, 2023]} />
          <CardWrapper style={{ width: verticalScale(100), alignItems: "center", backgroundColor: dark.complementary }}>
            <Text style={styles.text}>{`Split: ${splitTotal}€`}</Text>
          </CardWrapper>
        </View>
        <View style={{ flex: 1, gap: verticalScale(10) }}>
          <ChartCard title={"Total Purchase by Month"} currentYear={currentYear.toString()} splitDeptData={splitDeptData} />
          <BarCard title={"Total Purchase by Type"} currentYear={currentYear.toString()} spendByType={spendByType} />
        </View>
      </View>
    </LinearGradient>
  );
}
