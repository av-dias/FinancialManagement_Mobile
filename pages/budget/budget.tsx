import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";

//Context
import { UserContext } from "../../store/user-context";

//Custom Components
import Header from "../../components/header/header";

//Custom Constants
import { _styles } from "./style";

//Functions
import { dark } from "../../utility/colors";
import Statistics from "../stats/statistics";
import { AverageProgressBar } from "./components/AverageProgressBar";
import { StatsProgressBar } from "./components/StatsProgressBar";
import { ProgressItemsHeader } from "./components/ProgressItemsHeader";
import { logTimeTook } from "../../utility/logger";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { ExpensesService } from "../../service/ExpensesService";
import {
  handleAverageRequest,
  handleCurrentRequest,
  isLoaded,
} from "./handler";

export default function Budget({ navigation }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const expensesService = new ExpensesService();

  const [currentMonth, setCurrentMonth] = useState(
    new Date().getMonth().toString()
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  const [spendAverageByType, setSpendAverageByType] = useState({});
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState({});
  const [expensesPrevTotalByType, setExpensesPrevTotalByType] = useState({});
  const [expensesTotalByType, setExpensesTotalByType] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      async function fetchaData() {
        const month = Number(currentMonth) + 1;

        let expensesAverageByType,
          expensesPrevAverageByType,
          expensesAverageTotal,
          expensesPrevAverageTotal,
          expensesCurrentMonthPerType,
          expensesMonthTotal,
          expensesPrevYearTotalByType,
          expensesYearTotalByType;

        ({
          expensesAverageByType,
          expensesPrevAverageByType,
          expensesAverageTotal,
          expensesPrevAverageTotal,
        } = await handleAverageRequest(email, expensesService, currentYear));

        if (!expensesPrevAverageByType)
          expensesPrevAverageByType = expensesAverageByType;
        else {
          // Check whether previous year data will complement
          Object.keys(expensesPrevAverageByType).forEach((type) => {
            if (!expensesAverageByType.hasOwnProperty(type)) {
              expensesAverageByType[type] = expensesPrevAverageByType[type];
            }
          });
        }

        // Check whether previous year data is lower then current year
        if (expensesAverageTotal < expensesPrevAverageTotal)
          expensesAverageTotal = expensesPrevAverageTotal;

        ({
          expensesCurrentMonthPerType,
          expensesMonthTotal,
          expensesPrevYearTotalByType,
          expensesYearTotalByType,
        } = await handleCurrentRequest(
          email,
          expensesService,
          currentYear,
          month
        ));

        if (Object.keys(expensesPrevYearTotalByType).length === 0) {
          expensesPrevYearTotalByType = expensesYearTotalByType;
        } else {
          // Check whether current year data will complement
          Object.keys(expensesYearTotalByType).forEach((type) => {
            if (!expensesPrevYearTotalByType.hasOwnProperty(type)) {
              expensesPrevYearTotalByType[type] = expensesYearTotalByType[type];
            }
          });
        }

        setSpendAverageByType(expensesAverageByType);
        setPurchaseAverageTotal(expensesAverageTotal);
        setPurchaseCurrentStats(expensesCurrentMonthPerType);
        setPurchaseTotal(expensesMonthTotal);
        setExpensesPrevTotalByType(expensesPrevYearTotalByType);
        setExpensesTotalByType(expensesYearTotalByType);
      }

      console.log("Budget: Fetching app data...");
      const startTime = performance.now();

      if (email && expensesService.isReady()) {
        fetchaData();
      }
      const endTime = performance.now();
      logTimeTook("Budget", "useFocusEffect", endTime, startTime);
    }, [email, expensesService.isReady()])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 20 }}>
          <AverageProgressBar
            purchaseTotal={purchaseTotal}
            purchaseAverageTotal={purchaseAverageTotal}
          />
          <ScrollView
            horizontal={false}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollviewContainer}
          >
            <Statistics
              currentYear={Number(currentYear)}
              setCurrentYear={setCurrentYear}
            />
            <CardWrapper style={{ flex: 1, justifyContent: "flex-start" }}>
              <ProgressItemsHeader />
              {isLoaded([
                spendAverageByType,
                expensesPrevTotalByType,
                expensesTotalByType,
              ]) &&
                Object.keys(spendAverageByType)
                  .sort((a, b) => spendAverageByType[b] - spendAverageByType[a])
                  .map((type) => {
                    return (
                      <StatsProgressBar
                        key={`StatsProgressBar${type}`}
                        type={type}
                        spendAverageByType={spendAverageByType}
                        expensesPrevTotalByType={expensesPrevTotalByType}
                        expensesTotalByType={expensesTotalByType}
                        purchaseCurrentStats={purchaseCurrentStats}
                        currentYear={currentYear}
                        currentMonth={currentMonth}
                      />
                    );
                  })}
            </CardWrapper>
            {!isLoaded([
              spendAverageByType,
              expensesPrevTotalByType,
              expensesTotalByType,
            ]) && (
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
