import React, { useState } from "react";
import { View, Text } from "react-native";
import { _styles } from "./style";
import { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Context
import { UserContext } from "../../store/user-context";

import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { calculateSplitDeptData } from "../../functions/statistics";
import { getSumArrayObject } from "../../functions/array";
import { months } from "../../utility/calendar";
import ModalCustom from "../../components/modal/modal";
import { categoryIcons } from "../../utility/icons";
import { CustomBarChart } from "../../components/CustomBarChart/CustomBarChart";
import { verticalScale } from "../../functions/responsive";
import { logTimeTook } from "../../utility/logger";
import CalendarCard from "../../components/calendarCard/calendarCard";
import { ExpensesService } from "../../service/ExpensesService";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import { TransactionEntity } from "../../store/database/Transaction/TransactionEntity";
import { TypeIcon } from "../../components/TypeIcon/TypeIcon";
import { ExpenseItem } from "../../components/ExpenseItem/ExpenseItem";

const sortMonths = (a, b) => months.indexOf(a.label) - months.indexOf(b.label);

export default function Statistics({ currentYear, setCurrentYear }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const expensesService = new ExpensesService();

  const [splitTotal, setSplitTotal] = useState<number>(0);
  const [splitDeptData, setSplitDeptData] = useState({});
  const [purchaseWithSplit, setPurchasesWithSplit] = useState<PurchaseEntity[]>(
    []
  );
  const [transactionsWithSplit, setTransactionsWithSplit] = useState<
    TransactionEntity[]
  >([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chartIndex, setChartIndex] = useState<number>(null);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        // TODO: Enable Previous Year Data
        // Get list of expenses which is used to calculate split data
        let { purchaseWithSplit, transactionsWithSplit } =
          await expensesService.getExpensesYearWithSplit(email, currentYear);
        setPurchasesWithSplit(purchaseWithSplit);
        setTransactionsWithSplit(transactionsWithSplit);

        let deptCalculation = await expensesService.calculateSplitDept(
          email,
          currentYear
        );

        // No Expenses, then end
        if (!deptCalculation || Object.keys(deptCalculation).length === 0)
          return;

        let resSplitDeptData = calculateSplitDeptData(
          deptCalculation,
          currentYear
        );

        // Populate months without data
        for (let month in months) {
          if (
            !resSplitDeptData[currentYear].find(
              (data) => data.label === months[month]
            )
          ) {
            resSplitDeptData[currentYear].push({
              label: months[month],
              dataPointText: "0",
              value: 0,
            });
          }
        }

        resSplitDeptData[currentYear] =
          resSplitDeptData[currentYear].sort(sortMonths);
        setSplitDeptData(resSplitDeptData);
        let resSplitTotal = getSumArrayObject(
          resSplitDeptData[currentYear.toString()]
        );
        if (isNaN(resSplitTotal)) resSplitTotal = 0;
        setSplitTotal(resSplitTotal);
      }
      let startTime = performance.now();
      if (email && expensesService.isReady()) {
        fetchData();
      }
      let endTime = performance.now();
      logTimeTook("Stats", "Fetch", endTime, startTime);
    }, [email, currentYear])
  );

  const loadIcon = (expense: PurchaseEntity | TransactionEntity) => (
    <TypeIcon
      icon={categoryIcons().find((category) => category.label === expense.type)}
      customStyle={{
        width: verticalScale(40),
        borderRadius: 20,
      }}
    />
  );

  const loadSplitHeader = () => (
    <View>
      <Text style={styles.splitModalTitle}>Splitted Expenses</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Split</Text>
          <Text style={styles.splitModalText}>
            {`${Number(
              purchaseWithSplit.reduce(
                (acc: number, expense: PurchaseEntity) =>
                  new Date(expense.date).getMonth() === chartIndex
                    ? acc +
                      Number(expense.amount) *
                        (Number(expense.split.weight) / 100)
                    : acc,
                0
              )
            ).toFixed(0)}€`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Received</Text>
          <Text style={styles.splitModalText}>{`${transactionsWithSplit.reduce(
            (acc: number, expense: TransactionEntity) =>
              new Date(expense.date).getMonth() === chartIndex
                ? acc + Number(expense.amount)
                : acc,
            0
          )}€`}</Text>
        </View>
      </View>
    </View>
  );

  const maxBaxValue =
    splitDeptData[currentYear] &&
    splitDeptData[currentYear].sort((a, b) => b.value - a.value)[0].value;

  return (
    <CardWrapper style={styles.chartContainer}>
      <ModalCustom
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size={10}
        hasColor={true}
      >
        {modalVisible && (
          <View style={{ flex: 1, padding: 10, gap: 20 }}>
            {loadSplitHeader()}
            <ExpenseItem
              expenses={[...purchaseWithSplit, ...transactionsWithSplit].filter(
                (expense) => new Date(expense.date).getMonth() === chartIndex
              )}
            />
          </View>
        )}
      </ModalCustom>
      <View style={styles.chartHeader}>
        <View style={styles.containerJustifyCenter}>
          <Text style={styles.textTitle}>{"Total Purchase"}</Text>
          <Text>
            <Text style={styles.textSecundary}>{`Split: ${splitTotal.toFixed(
              0
            )}`}</Text>
            <Text style={styles.textSymbol}>{`€`}</Text>
          </Text>
        </View>
        <View style={styles.containerRowGap}>
          <CalendarCard
            monthState={[null, null]}
            yearState={[currentYear, setCurrentYear]}
          />
        </View>
      </View>
      <View
        style={{
          paddingTop: verticalScale(60),
          paddingHorizontal: 10,
          paddingRight: verticalScale(20),
          flexDirection: "row",
        }}
      >
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
