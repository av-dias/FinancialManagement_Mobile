import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { UserContext } from "../../store/user-context";
import { useDatabaseConnection } from "../../store/database-context";

//Custom Components
import CalendarCard from "../../components/calendarCard/calendarCard";
import TypeCard from "../../components/TypeCard/TypeCard";
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

//Custom Constants
import { _styles } from "./style";
import { ANALYSES_TYPE, TIME_MODE } from "../../utility/keys";

import { horizontalScale, verticalScale } from "../../functions/responsive";
import { loadPieChartData, loadPurchaseTotalData, loadSpendTableData, loadExpenses } from "./handler";
import { calcExpensesTotalFromType } from "../../functions/expenses";
import { dark } from "../../utility/colors";
import { FlatItem } from "../../components/flatItem/flatItem";
import ModalCustom from "../../components/modal/modal";
import { ExpenseEnum } from "../../models/types";
import { categoryIcons, utilIcons } from "../../utility/icons";
import { Badge } from "react-native-paper";
import { logTimeTook } from "../../utility/logger";
import { ExpensesService } from "../../service/ExpensesService";
import { TransactionEntity, TransactionOperation } from "../../store/database/Transaction/TransactionEntity";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";

export default function Home({ navigation }) {
  const styles = _styles;
  const expensesService = new ExpensesService();

  const [statsType, setStatsType] = useState(ANALYSES_TYPE.Total);
  const [statsMode, setStatsMode] = useState(TIME_MODE.Monthly);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [pieChartData, setPieChartData] = useState({ [ANALYSES_TYPE.Total]: [] });
  const [spendByType, setSpendByType] = useState({ [ANALYSES_TYPE.Total]: [[""]] });
  const [expenseTotal, setExpenseTotal] = useState<any>({ [ANALYSES_TYPE.Total]: "0.00" });

  const [pieChartAverageData, setPieChartAverageData] = useState({ [ANALYSES_TYPE.Total]: [] });
  const [spendAverageByType, setSpendAverageByType] = useState<{}>();
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState<any>({ [ANALYSES_TYPE.Total]: "0.00" });
  const [prediction, setPrediction] = useState(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [rowType, setRowType] = useState<string>(null);
  const [listExpenseOfType, setListExpenseOfType] = useState<(PurchaseEntity | TransactionEntity)[]>([]);

  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const expensesByTypeTotal = await expensesService.getMonthExpensesByType(email, currentMonth + 1, currentYear, ANALYSES_TYPE.Total);
        const expensesByTypePersonal = await expensesService.getMonthExpensesByType(email, currentMonth + 1, currentYear, ANALYSES_TYPE.Personal);

        let resExpensesByType = { [ANALYSES_TYPE.Total]: expensesByTypeTotal, [ANALYSES_TYPE.Personal]: expensesByTypePersonal };

        if (resExpensesByType[ANALYSES_TYPE.Personal] && resExpensesByType[ANALYSES_TYPE.Total]) {
          let [resPieChart, resTableChart] = loadExpenses(resExpensesByType);
          setPieChartData(resPieChart);
          setSpendByType(resTableChart);
          setExpenseTotal(calcExpensesTotalFromType(resExpensesByType));
        }

        const averageTotal = await expensesService.getExpensesTotalAverage(email, currentYear, ANALYSES_TYPE.Total);
        const averagePersonal = await expensesService.getExpensesTotalAverage(email, currentYear, ANALYSES_TYPE.Personal);

        const averageTypeTotal = await expensesService.getExpenseAverageByType(email, currentYear, ANALYSES_TYPE.Total);
        const averageTypePersonal = await expensesService.getExpenseAverageByType(email, currentYear, ANALYSES_TYPE.Personal);

        if (averageTypeTotal && averageTypePersonal) {
          let [resAveragePieChart, resAverageTableChart] = loadExpenses({ Total: averageTypeTotal, Personal: averageTypePersonal });
          setPieChartAverageData(resAveragePieChart);
          setSpendAverageByType(resAverageTableChart);
          setPurchaseAverageTotal({ Total: averageTotal, Personal: averagePersonal });
        }
      }
      if (email && expensesService.isReady()) {
        let startTime = performance.now();
        fetchData();
        let endTime = performance.now();
        logTimeTook("Home", "Fetch", endTime, startTime);
      }
    }, [email, expensesService.isReady(), currentMonth, currentYear])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        //Calculate Current Savings
        try {
          const resTotalIncome = await incomeRepository.getTotalIncomeFromDate(email, currentMonth, currentYear);
          setPrediction(resTotalIncome - Number(loadPurchaseTotalData(statsMode, statsType, expenseTotal, purchaseAverageTotal)));
        } catch (e) {
          console.log(e);
        }
      }
      let startTime = performance.now();
      if (incomeRepository.isReady() && email) {
        fetchData();
      }
      let endTime = performance.now();
      logTimeTook("Home", "Database Fetch", endTime, startTime);
    }, [email, incomeRepository, expenseTotal, purchaseAverageTotal, statsMode, statsType])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        //Get data related to selected type
        try {
          const typeItems = await expensesService.getExpensesFromType(email, rowType, currentMonth + 1, currentYear);
          setListExpenseOfType(typeItems);
        } catch (e) {
          console.log(e);
        }
      }
      let startTime = performance.now();
      if (rowType && expensesService.isReady() && email) {
        fetchData();
      }
      let endTime = performance.now();
      logTimeTook("Home", "Database Fetch", endTime, startTime);
    }, [rowType])
  );

  const loadIcon = (expense: PurchaseEntity | TransactionEntity) => {
    if (expense.entity === ExpenseEnum.Purchase) return <View>{categoryIcons().find((category) => category.label === expense.type).icon}</View>;
    else {
      if (expense.entity === ExpenseEnum.Transaction && expense.transactionType === TransactionOperation.SENT)
        return <View>{utilIcons().find((category) => category.label === "Transaction").icon}</View>;
      else return <View>{utilIcons().find((category) => category.label === "Received").icon}</View>;
    }
  };

  // TODO
  const loadSplitHeader = () => (
    <View>
      <Text style={styles.splitModalTitle}>Expenses</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Total</Text>
          <Text style={styles.splitModalText}>
            {`${Number(listExpenseOfType.reduce((acc: number, expense: PurchaseEntity | TransactionEntity) => acc + Number(loadExpenseValue(expense)), 0)).toFixed(0)}€`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "white", fontSize: 16 }}>Count</Text>
          <Text style={styles.splitModalText}>{listExpenseOfType.length}</Text>
        </View>
      </View>
    </View>
  );

  /*
   * Load the purchase value based on Stats Type
   * If stats type is personal
   * The purchase needs to consider the spluit weight if it exists
   */
  const loadExpenseValue = (expense: PurchaseEntity | TransactionEntity) => {
    if (expense.entity === ExpenseEnum.Transaction) return expense.amount;

    if (statsType === ANALYSES_TYPE.Total) {
      return Number(expense.amount);
    } else {
      let value: number;
      if (expense.split) {
        value = (Number(expense.amount) * (100 - Number(expense.split.weight))) / 100;
      } else {
        value = Number(expense.amount);
      }
      return Number(value.toFixed(1));
    }
  };

  // TODO
  const loadSplitItem = () => (
    <ScrollView contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
      {listExpenseOfType.map(
        (expense: PurchaseEntity | TransactionEntity) =>
          rowType === expense.type && (
            <View key={`V${expense.entity + expense.id}`}>
              {(expense as PurchaseEntity)?.split && statsType === ANALYSES_TYPE.Total && (
                <Badge size={24} style={{ top: -5, zIndex: 1, position: "absolute" }}>
                  {`${(expense as PurchaseEntity).split.weight}%`}
                </Badge>
              )}
              <FlatItem
                key={`FI${expense.entity + expense.id}`}
                icon={loadIcon(expense)}
                name={(expense as PurchaseEntity).name || (expense as TransactionEntity).description}
                value={loadExpenseValue(expense)}
              />
            </View>
          )
      )}
    </ScrollView>
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={10} hasColor={true}>
        {modalVisible && (
          <View style={{ flex: 1, padding: 10, gap: 20 }}>
            {loadSplitHeader()}
            {loadSplitItem()}
          </View>
        )}
      </ModalCustom>
      <View style={styles.usableScreen}>
        {loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData).length !== 0 ? (
          <View style={{ flex: 8, gap: verticalScale(10) }}>
            <CardWrapper style={styles.mainContainer}>
              <View style={styles.chart}>
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsText}>{`${prediction.toFixed(0)}€`}</Text>
                </View>
                <VictoryPie
                  height={horizontalScale(320)}
                  innerRadius={horizontalScale(130)}
                  padding={{ top: 0, bottom: 0 }}
                  data={
                    loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData).length != 0
                      ? loadPieChartData(statsMode, statsType, pieChartData, pieChartAverageData)
                      : [{ x: "Your Spents", y: 1 }]
                  }
                  style={{
                    data: {
                      fill: ({ datum }) => datum.color,
                    },
                  }}
                  labelComponent={<VictoryLabel style={[{ fontSize: 10 }]} />}
                />
                <View style={styles.expensesContainer}>
                  <View style={{ paddingBottom: 10 }}>
                    <Text style={styles.expensesText}>{`${loadPurchaseTotalData(statsMode, statsType, expenseTotal, purchaseAverageTotal)}€`}</Text>
                  </View>
                  {statsMode == TIME_MODE.Monthly && <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />}
                </View>
              </View>
            </CardWrapper>
            <View style={styles.typeCardContainer}>
              <TypeCard setItem={setStatsType} itemList={Object.values(ANALYSES_TYPE)} />
              <TypeCard setItem={setStatsMode} itemList={Object.values(TIME_MODE)} />
            </View>
            <View style={{ flex: 4 }}>
              <View style={{ flex: 4 }}>
                <ScrollView contentContainerStyle={{ gap: 5, paddingHorizontal: 5 }}>
                  {spendAverageByType &&
                    loadSpendTableData(statsMode, statsType, spendByType, spendAverageByType).map((rowData) => (
                      <FlatItem
                        key={rowData[1]}
                        icon={rowData[0]}
                        name={rowData[1]}
                        value={rowData[2]}
                        onPressCallback={() => {
                          if (statsMode === TIME_MODE.Monthly) {
                            setModalVisible(true);
                            setRowType(rowData[1]);
                          }
                        }}
                      />
                    ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
            <Text style={{ color: dark.textPrimary }}>NO DATA</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
