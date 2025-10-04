import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "@react-native-community/blur";

//Context
import { UserContext } from "../../store/user-context";
import { useDatabaseConnection } from "../../store/database-context";

//Custom Components
import CalendarCard from "../../components/calendarCard/calendarCard";
import TypeCard from "../../components/TypeCard/TypeCard";
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";

//Custom Constants
import { _styles } from "./style";
import { ANALYSES_TYPE, TIME_MODE } from "../../utility/keys";

//Custom Styling
import { dark } from "../../utility/colors";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import commonStyles from "../../utility/commonStyles";

import {
  loadPieChartData,
  loadPurchaseTotalData,
  loadSpendTableData,
  fetchData as fetchExpenseData,
} from "./handler";
import { loadExpenseValue } from "../../functions/expenses";
import { logTimeTook } from "../../utility/logger";
import { ExpensesService } from "../../service/ExpensesService";
import { TransactionEntity } from "../../store/database/Transaction/TransactionEntity";
import { PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import SimpleItem from "../../components/SimpleItem/SimpleItem";
import { ExpenseItem } from "../../components/ExpenseItem/ExpenseItem";
import { BlurText } from "../../components/BlurText/BlurText";

const SplitHeader = ({ listExpenseOfType, statsType }) => (
  <View>
    <Text style={_styles.splitModalTitle}>Expenses</Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Total</Text>
        <Text style={_styles.splitModalText}>
          {`${Number(
            listExpenseOfType.reduce(
              (acc: number, expense: PurchaseEntity | TransactionEntity) =>
                acc + Number(loadExpenseValue(expense, statsType)),
              0
            )
          ).toFixed(0)}€`}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ color: "white", fontSize: 16 }}>Count</Text>
        <Text style={_styles.splitModalText}>{listExpenseOfType.length}</Text>
      </View>
    </View>
  </View>
);

export default function Home({ navigation }) {
  const styles = _styles;
  const expensesService = new ExpensesService();
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  const [statsType, setStatsType] = useState(ANALYSES_TYPE.Total);
  const [statsMode, setStatsMode] = useState(TIME_MODE.Monthly);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [pieChartData, setPieChartData] = useState({
    [ANALYSES_TYPE.Total]: [],
  });
  const [spendByType, setSpendByType] = useState({
    [ANALYSES_TYPE.Total]: [[""]],
  });
  const [expenseTotal, setExpenseTotal] = useState<any>({
    [ANALYSES_TYPE.Total]: "0.00",
  });

  const [pieChartAverageData, setPieChartAverageData] = useState({
    [ANALYSES_TYPE.Total]: [],
  });
  const [spendAverageByType, setSpendAverageByType] = useState<{}>();
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState<any>({
    [ANALYSES_TYPE.Total]: "0.00",
  });
  const [prediction, setPrediction] = useState(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [rowType, setRowType] = useState<string>(null);
  const [listExpenseOfType, setListExpenseOfType] = useState<
    (PurchaseEntity | TransactionEntity)[]
  >([]);
  const { privacyShield } = useContext(UserContext).privacyShield;

  /**
   * Load main page data
   */
  useFocusEffect(
    React.useCallback(() => {
      if (email && expensesService.isReady()) {
        let startTime = performance.now();
        fetchExpenseData(
          email,
          currentMonth,
          currentYear,
          setPieChartData,
          setSpendByType,
          setExpenseTotal,
          setPieChartAverageData,
          setSpendAverageByType,
          setPurchaseAverageTotal,
          expensesService
        );
        let endTime = performance.now();
        logTimeTook("Home", "Fetch", endTime, startTime);
      }
    }, [email, expensesService.isReady(), currentMonth, currentYear])
  );

  /**
   * Load savings prediction
   */
  useFocusEffect(
    React.useCallback(() => {
      async function fetchSavingsData() {
        //Calculate Current Savings
        try {
          const resTotalIncome = await incomeRepository.getTotalIncomeFromDate(
            email,
            currentMonth,
            currentYear
          );
          const expenseTotalData = Number(
            loadPurchaseTotalData(
              statsMode,
              statsType,
              expenseTotal,
              purchaseAverageTotal
            )
          );
          setPrediction(resTotalIncome - expenseTotalData);
        } catch (e) {
          console.log(e);
        }
      }
      let startTime = performance.now();
      if (incomeRepository.isReady() && email) {
        fetchSavingsData();
      }
      let endTime = performance.now();
      logTimeTook("Home", "Database Fetch", endTime, startTime);
    }, [
      email,
      incomeRepository,
      expenseTotal,
      purchaseAverageTotal,
      statsMode,
      statsType,
    ])
  );

  /**
   * Load the expenses by category once selected
   */
  useFocusEffect(
    React.useCallback(() => {
      async function fetchExpenseSelectedData() {
        //Get data related to selected type
        try {
          const typeItems = await expensesService.getExpensesFromType(
            email,
            rowType,
            currentMonth + 1,
            currentYear
          );
          setListExpenseOfType(typeItems);
        } catch (e) {
          console.log(e);
        }
      }
      let startTime = performance.now();
      if (rowType && expensesService.isReady() && email) {
        fetchExpenseSelectedData();
      }
      let endTime = performance.now();
      logTimeTook("Home", "Database Fetch", endTime, startTime);
    }, [rowType])
  );

  const onPress = (rowData) => {
    if (statsMode === TIME_MODE.Monthly) {
      setModalVisible(true);
      setRowType(rowData[1]);
    }
  };

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ModalCustom
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        size={10}
        hasColor={true}
      >
        {modalVisible && (
          <View
            style={{
              flex: 1,
              gap: 20,
            }}
          >
            <SplitHeader
              listExpenseOfType={listExpenseOfType}
              statsType={statsType}
            />
            <ExpenseItem expenses={listExpenseOfType} />
          </View>
        )}
      </ModalCustom>
      <View style={styles.usableScreen}>
        {loadPieChartData(
          statsMode,
          statsType,
          pieChartData,
          pieChartAverageData
        ).length !== 0 ? (
          <View style={{ flex: 8, gap: verticalScale(10) }}>
            <CardWrapper style={styles.mainContainer}>
              <View style={styles.chart}>
                <BlurText
                  style={styles.savingsContainer}
                  blurStyle={{ height: "40%", width: "80%", marginLeft: 5 }}
                  text={
                    <Text>
                      <Text style={styles.savingsText}>{`${prediction.toFixed(
                        0
                      )}`}</Text>
                      <Text style={styles.textSavingsSymbol}>{`€`}</Text>
                    </Text>
                  }
                  privacyShield={privacyShield}
                />
                <VictoryPie
                  height={horizontalScale(250)}
                  innerRadius={horizontalScale(100)}
                  padding={{ top: 0, bottom: 0 }}
                  data={loadPieChartData(
                    statsMode,
                    statsType,
                    pieChartData,
                    pieChartAverageData
                  ).sort((a, b) => a.y - b.y)}
                  style={{
                    data: {
                      fill: ({ datum }) => datum.color,
                    },
                  }}
                  labelComponent={<VictoryLabel style={[{ fontSize: 10 }]} />}
                />
                <View style={styles.expensesContainer}>
                  <BlurText
                    style={{
                      paddingBottom: 5,
                      borderRadius: commonStyles.borderRadius,
                    }}
                    text={
                      <Text>
                        <Text style={styles.expensesText}>
                          {loadPurchaseTotalData(
                            statsMode,
                            statsType,
                            expenseTotal,
                            purchaseAverageTotal
                          )}
                        </Text>
                        <Text style={styles.textSymbol}>{`€`}</Text>
                      </Text>
                    }
                    privacyShield={privacyShield}
                  />
                  {statsMode == TIME_MODE.Monthly ? (
                    <CalendarCard
                      monthState={[currentMonth, setCurrentMonth]}
                      yearState={[currentYear, setCurrentYear]}
                    />
                  ) : (
                    <View style={{ height: 35 }} />
                  )}
                </View>
              </View>
            </CardWrapper>
            <View style={styles.typeCardContainer}>
              <TypeCard
                setItem={setStatsType}
                itemList={Object.values(ANALYSES_TYPE)}
              />
              <TypeCard
                setItem={setStatsMode}
                itemList={Object.values(TIME_MODE)}
              />
            </View>
            <View style={{ flex: 4 }}>
              <View
                style={{ flex: 4, padding: commonStyles.mainPaddingHorizontal }}
              >
                <ScrollView
                  style={{ borderRadius: commonStyles.borderRadius }}
                  contentContainerStyle={{
                    gap: 0,
                    backgroundColor: dark.glass,
                    borderRadius: commonStyles.borderRadius,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {spendAverageByType &&
                    loadSpendTableData(
                      statsMode,
                      statsType,
                      spendByType,
                      spendAverageByType
                    ).map((rowData) => (
                      <SimpleItem
                        key={rowData[1]}
                        rowData={rowData}
                        total={expenseTotal[statsType]}
                        onPressCallback={onPress}
                        privacyShield={privacyShield}
                        blurStyle={{ height: "50%" }}
                      />
                    ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <CalendarCard
              monthState={[currentMonth, setCurrentMonth]}
              yearState={[currentYear, setCurrentYear]}
            />
            <Text style={{ color: dark.textComplementary }}>No Data</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
