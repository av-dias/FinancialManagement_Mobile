import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import { _styles } from "./style";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../components/header/header";
import TypeCard from "../../components/TypeCard/TypeCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { verticalScale } from "../../functions/responsive";
import { ChartCard } from "./components/ChartCard";
import { calculateSplitData, calculateSplitDeptData } from "../../functions/statistics";
import { getCombinedArray, getMaxArrayObject, getMinArrayObject, getSumArrayObject } from "../../functions/array";
import { VictoryLabel, VictoryLine } from "victory-native";
import { months } from "../../utility/calendar";

export default function Statistics({ navigation }) {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [splitTotal, setSplitTotal] = useState(0);
  const [splitDeptData, setSplitDeptData] = useState({});

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
          const resSplitTotal = getSumArrayObject(resSplitDeptData[currentYear.toString()]);
          setSplitTotal(resSplitTotal);
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      console.log(`Stats: Fetch took ${endTime - startTime} milliseconds.`);
    }, [appCtx.expenses, currentYear])
  );

  return (
    <CardWrapper style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.containerJustifyCenter}>
          <Text style={styles.textTitle}>{"Total Purchase"}</Text>
          <Text style={styles.textSecundary}>{`Split: ${splitTotal}€`}</Text>
        </View>
        <View style={styles.containerRowGap}>
          <TypeCard setItem={setCurrentYear} itemList={[2024, 2023]} />
        </View>
      </View>
      <VictoryLine
        domain={{
          x: [0, 13],
          y: [getMinArrayObject(getCombinedArray(splitDeptData[currentYear.toString()], splitDeptData[currentYear.toString()])), getMaxArrayObject(getCombinedArray(splitDeptData[currentYear.toString()], splitDeptData[currentYear.toString()]))],
        }}
        padding={{ left: 20 }}
        style={{
          data: { stroke: "rgb(112,137,187)" },
          parent: { border: "1px solid #ccc" },
        }}
        categories={{ x: months }}
        data={splitDeptData[currentYear] || []}
        interpolation="natural"
        labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
        labelComponent={<VictoryLabel style={{ fill: dark.textPrimary, fontSize: 10 }} />}
      />
    </CardWrapper>
  );
}
