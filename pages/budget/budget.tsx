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
import { ANALYSES_TYPE } from "../../utility/keys";

//Functions
import { dark } from "../../utility/colors";
import Statistics from "../stats/statistics";
import { AverageProgressBar } from "./components/AverageProgressBar";
import { StatsProgressBar } from "./components/StatsProgressBar";
import { ProgressItemsHeader } from "./components/ProgressItemsHeader";
import { logTimeTook } from "../../utility/logger";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { ExpensesService } from "../../service/ExpensesService";
import { isLoaded } from "./handler";

export default function Budget({ navigation }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const expensesService = new ExpensesService();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth().toString());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());

  const [spendAverageByType, setSpendAverageByType] = useState({});
  const [purchaseAverageTotal, setPurchaseAverageTotal] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [purchaseCurrentStats, setPurchaseCurrentStats] = useState({});
  const [expensesTotalByType, setExpensesTotalByType] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      async function fetchaData() {
        const month = Number(currentMonth) + 1;

        // The expenses Average by type should check if previous year contains data
        const expensesAverageByType = await expensesService.getExpenseAverageByType(email, Number(currentYear), ANALYSES_TYPE.Personal);
        const expensesPrevAverageByType = await expensesService.getExpenseAverageByType(email, Number(currentYear) - 1, ANALYSES_TYPE.Personal);
        let expensesAverageTotal = await expensesService.getExpensesTotalAverage(email, Number(currentYear), ANALYSES_TYPE.Personal);
        const expensesPrevAverageTotal = await expensesService.getExpensesTotalAverage(email, Number(currentYear) - 1, ANALYSES_TYPE.Personal);

        // Check whether previous year data will complement
        Object.keys(expensesPrevAverageByType).forEach((type) => {
          if (!expensesAverageByType.hasOwnProperty(type)) {
            expensesAverageByType[type] = expensesPrevAverageByType[type];
          }
        });

        // Check whether previous year data is lower then current year
        if (expensesAverageTotal < expensesPrevAverageTotal) expensesAverageTotal = expensesPrevAverageTotal;

        const expensesCurrentMonthPerType = await expensesService.getMonthExpensesByType(email, month, Number(currentYear), ANALYSES_TYPE.Personal);
        const expensesMonthTotal = await expensesService.getTotalExpensesOnMonth(email, month, Number(currentYear), ANALYSES_TYPE.Personal);
        const expensesYearTotalByType = await expensesService.getExpenseTotalByType(email, Number(currentYear) - 1, ANALYSES_TYPE.Personal);

        setSpendAverageByType(expensesAverageByType);
        setPurchaseAverageTotal(expensesAverageTotal);
        setPurchaseCurrentStats(expensesCurrentMonthPerType);
        setPurchaseTotal(expensesMonthTotal);
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
          <AverageProgressBar purchaseTotal={purchaseTotal} purchaseAverageTotal={purchaseAverageTotal} />
          <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={styles.scrollviewContainer}>
            <Statistics currentYear={Number(currentYear)} setCurrentYear={setCurrentYear} />
            <CardWrapper style={{ flex: 1, justifyContent: "flex-start" }}>
              <ProgressItemsHeader />
              {isLoaded([spendAverageByType, expensesTotalByType]) &&
                Object.keys(spendAverageByType)
                  .sort((a, b) => spendAverageByType[b] - spendAverageByType[a])
                  .map((type) => {
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
            </CardWrapper>
            {!isLoaded([spendAverageByType, expensesTotalByType]) && (
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
