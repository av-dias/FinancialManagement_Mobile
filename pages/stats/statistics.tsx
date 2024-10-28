import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { ProgressBarColors } from "../../utility/colors";
import { _styles } from "./style";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { useFocusEffect } from "@react-navigation/native";

import TypeCard from "../../components/TypeCard/TypeCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { calculateSplitData, calculateSplitDeptData } from "../../functions/statistics";
import { getSumArrayObject } from "../../functions/array";
import { months } from "../../utility/calendar";
import { BarChart } from "react-native-gifted-charts";

const sortMonths = (a, b) => months.indexOf(a.label) - months.indexOf(b.label);

export default function Statistics() {
  const styles = _styles;
  const ref = useRef(null);
  const appCtx = useContext(AppContext);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [splitTotal, setSplitTotal] = useState<number>(0);
  const [splitDeptData, setSplitDeptData] = useState({});
  const [yearsRange, setYearsRange] = useState<string[]>([new Date().getFullYear().toString()]);

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        // TODO: Enable Previous Year Data
        if (appCtx && appCtx.expenses && appCtx.expenses.hasOwnProperty(currentYear)) {
          let resExpensesTotal = calculateSplitData(appCtx.expenses, currentYear);

          // No Expenses, then end
          if (!resExpensesTotal) return;

          let resSplitDeptData = calculateSplitDeptData(resExpensesTotal, currentYear);

          // Populate months without data
          for (let month in months) {
            if (!resSplitDeptData[currentYear].find((data) => data.label === months[month])) {
              resSplitDeptData[currentYear].push({ label: months[month], dataPointText: "0", value: 0 });
            }
          }

          resSplitDeptData[currentYear] = resSplitDeptData[currentYear].sort(sortMonths);
          setSplitDeptData(resSplitDeptData);
          const resSplitTotal = getSumArrayObject(resSplitDeptData[currentYear.toString()]);
          setSplitTotal(resSplitTotal);

          setYearsRange(Object.keys(resSplitDeptData));
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      console.log(`Stats: Fetch took ${endTime - startTime} milliseconds.`);
    }, [appCtx.expenses, currentYear])
  );

  const month = new Date().getMonth();
  ref.current?.scrollTo({ x: month < 6 ? 0 : 200 }); // adjust as per your UI

  return (
    <CardWrapper style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.containerJustifyCenter}>
          <Text style={styles.textTitle}>{"Total Purchase"}</Text>
          <Text style={styles.textSecundary}>{`Split: ${splitTotal.toFixed(0)}€`}</Text>
        </View>
        <View style={styles.containerRowGap}>
          <TypeCard setItem={setCurrentYear} itemList={[yearsRange]} />
        </View>
      </View>
      <View style={{ paddingTop: 80, paddingBottom: 20, paddingLeft: 10 }}>
        <BarChart
          scrollRef={ref}
          barWidth={30}
          spacing={10}
          noOfSections={2}
          barBorderRadius={4}
          frontColor={ProgressBarColors.blue}
          data={splitDeptData[currentYear]}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: "gray" }}
          xAxisLabelTextStyle={{ color: "gray" }}
          showValuesAsTopLabel={true}
          topLabelContainerStyle={{ paddingBottom: 2 }}
          topLabelTextStyle={{ color: "white", fontSize: 10, textAlign: "center" }}
          xAxisLabelsVerticalShift={5}
          rulesType="solid"
          rulesColor={"gray"}
        />
      </View>
    </CardWrapper>
  );
}
