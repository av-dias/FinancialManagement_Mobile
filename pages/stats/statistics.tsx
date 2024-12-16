import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { _styles } from "./style";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { useFocusEffect } from "@react-navigation/native";

import TypeCard from "../../components/TypeCard/TypeCard";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { calculateSplitData, calculateSplitDeptData, findAllSplitExpenses } from "../../functions/statistics";
import { getSumArrayObject } from "../../functions/array";
import { months } from "../../utility/calendar";
import ModalCustom from "../../components/modal/modal";
import { ExpenseType, PurchaseType, TransactionType } from "../../models/types";
import { FlatItem } from "../../components/flatItem/flatItem";
import { categoryIcons } from "../../utility/icons";
import { Badge } from "react-native-paper";
import { CustomBarChart } from "../../components/CustomBarChart/CustomBarChart";
import { dark } from "../../utility/colors";
import { verticalScale } from "../../functions/responsive";
import { logTimeTook } from "../../utility/logger";

const sortMonths = (a, b) => months.indexOf(a.label) - months.indexOf(b.label);

export default function Statistics() {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [splitTotal, setSplitTotal] = useState<number>(0);
  const [splitDeptData, setSplitDeptData] = useState({});
  const [expensesWithSplit, setExpensesWithSplit] = useState({});
  const [transactionsWithSplit, setTransactionsWithSplit] = useState({});
  const [yearsRange, setYearsRange] = useState<string[]>([new Date().getFullYear().toString()]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chartIndex, setChartIndex] = useState<number>(null);

  useFocusEffect(
    React.useCallback(() => {
      function fetchData() {
        // TODO: Enable Previous Year Data
        if (appCtx && appCtx.expenses && appCtx.expenses.hasOwnProperty(currentYear)) {
          let { expensesWithSplit, transactionsWithSplit } = findAllSplitExpenses(appCtx.expenses, currentYear);
          setExpensesWithSplit(expensesWithSplit);
          setTransactionsWithSplit(transactionsWithSplit);

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
          console.log(resSplitDeptData[currentYear.toString()]);
          setSplitDeptData(resSplitDeptData);
          let resSplitTotal = getSumArrayObject(resSplitDeptData[currentYear.toString()]);
          if (isNaN(resSplitTotal)) resSplitTotal = 0;
          setSplitTotal(resSplitTotal);

          setYearsRange(Object.keys(resSplitDeptData));
        }
      }
      let startTime = performance.now();
      fetchData();
      let endTime = performance.now();
      logTimeTook("Stats", "Fetch", endTime, startTime);
    }, [appCtx.expenses, currentYear])
  );

  const loadIcon = (expense) => <View>{categoryIcons(25).find((category) => category.label === expense.element.type).icon}</View>;

  const loadSplitItem = () => {
    return (
      <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
        {expensesWithSplit[currentYear][chartIndex].map((expense: ExpenseType) => (
          <View key={expense.index}>
            <Badge size={24} style={{ top: -5, zIndex: 1, position: "absolute" }}>{`${(expense.element as PurchaseType).split.weight}%`}</Badge>
            <FlatItem key={expense.index} icon={loadIcon(expense)} name={(expense.element as PurchaseType).name} value={Number((expense.element as PurchaseType).value)} />
          </View>
        ))}
      </ScrollView>
    );
  };

  const loadSplitHeader = () => (
    <View>
      <Text style={styles.splitModalTitle}>Splitted Expenses</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Split</Text>
          <Text style={styles.splitModalText}>
            {`${Number(
              expensesWithSplit[currentYear][chartIndex].reduce(
                (acc: number, expense: ExpenseType) => acc + Number((expense.element as PurchaseType).value) * (Number((expense.element as PurchaseType).split.weight) / 100),
                0
              )
            ).toFixed(0)}€`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Received</Text>
          <Text style={styles.splitModalText}>
            {`${transactionsWithSplit[currentYear][chartIndex].reduce((acc: number, expense: ExpenseType) => acc + Number((expense.element as TransactionType).amount), 0)}€`}
          </Text>
        </View>
      </View>
    </View>
  );

  const maxBaxValue = splitDeptData[currentYear] && splitDeptData[currentYear].sort((a, b) => b.value - a.value)[0].value;

  return (
    <CardWrapper style={styles.chartContainer}>
      <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={10} hasColor={true}>
        {modalVisible && (
          <View style={{ flex: 1, padding: 10, gap: 20 }}>
            {loadSplitHeader()}
            {loadSplitItem()}
          </View>
        )}
      </ModalCustom>
      <View style={styles.chartHeader}>
        <View style={styles.containerJustifyCenter}>
          <Text style={styles.textTitle}>{"Total Purchase"}</Text>
          <Text style={styles.textSecundary}>{`Split: ${splitTotal.toFixed(0)}€`}</Text>
        </View>
        <View style={styles.containerRowGap}>
          <TypeCard setItem={setCurrentYear} itemList={[yearsRange]} />
        </View>
      </View>
      <View style={{ paddingTop: verticalScale(60), paddingHorizontal: 10, paddingRight: verticalScale(20), flexDirection: "row" }}>
        <CustomBarChart
          maxBarValue={maxBaxValue}
          data={splitDeptData[currentYear]}
          labels={months}
          onPressCallback={(index: number) => {
            setModalVisible(true);
            setChartIndex(index);
          }}
        />
      </View>
    </CardWrapper>
  );
}
