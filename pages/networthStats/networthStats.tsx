import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { _styles } from "./style";
import React, { useContext } from "react";
import { UserContext } from "../../store/user-context";
import { PortfolioService } from "../../service/PortfolioService";
import { useFocusEffect } from "@react-navigation/native";
import { logTimeTook } from "../../utility/logger";
import { getMonthsBetween } from "../../utility/calendar";
import { ChartCard } from "./component/chartCard";
import commonStyles from "../../utility/commonStyles";

export default function NetworthStats({ navigation }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const portfolioService = new PortfolioService();

  const [grossworthChart, setGrossworthChart] = React.useState<
    { x: number; y: number }[]
  >([]);
  const [networthChart, setNetworthChart] = React.useState<
    { x: number; y: number }[]
  >([]);
  const [averageWorth, setAverageWorth] = React.useState<{
    networth: number;
    grossworth: number;
  }>({ networth: 0, grossworth: 0 });
  const [totalWorth, setTotalWorth] = React.useState<{
    min: { month: number; year: number; grossWorth: number; networth: number };
    max: { month: number; year: number; grossWorth: number; networth: number };
    values: { grossworth: number; networth: number }[];
  }>({
    min: { month: 0, year: 0, grossWorth: 0, networth: 0 },
    max: { month: 0, year: 0, grossWorth: 0, networth: 0 },
    values: [],
  });
  const [monthCount, setMonthCount] = React.useState<number>(0);
  const [evenSelector, setEvenSelector] = React.useState<boolean>(true);
  const [periodSelector, setPeriodSelector] = React.useState<number>(6); // 0 for 6 months, 1 for 12 months
  const { privacyShield } = useContext(UserContext).privacyShield;

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            const totalWorth = await portfolioService.getMinMaxWorth(email);
            const monthCount = getMonthsBetween(
              totalWorth.min.month,
              totalWorth.min.year,
              totalWorth.max.month,
              totalWorth.max.year
            );

            let grossworthDiff,
              networthDiff,
              averageGrossworth,
              averageNetworth;

            if (monthCount === 0) {
              grossworthDiff = totalWorth.max.grossWorth;
              networthDiff = totalWorth.max.networth;
              averageGrossworth = totalWorth.max.grossWorth;
              averageNetworth = totalWorth.max.networth;
            } else {
              grossworthDiff =
                totalWorth.max.grossWorth - totalWorth.min.grossWorth;
              networthDiff = totalWorth.max.networth - totalWorth.min.networth;
              averageGrossworth = grossworthDiff / monthCount;
              averageNetworth = networthDiff / monthCount;
            }

            const grossworthChart = totalWorth.values.map((value, index) => ({
              x: index,
              y: Math.round(value.grossworth),
            }));
            const networthChart = totalWorth.values.map((value, index) => ({
              x: index,
              y: Math.round(value.networth),
            }));

            setAverageWorth({
              grossworth: Math.round(averageGrossworth),
              networth: Math.round(averageNetworth),
            });
            setTotalWorth(totalWorth);
            setEvenSelector(monthCount % 2 === 0 ? true : false); // Ensures evenSelector is set to 2 if monthCount is even, otherwise 1
            setMonthCount(monthCount); // Ensure monthCount is even for better chart display

            let networthValue = totalWorth.max.networth;
            let grossworthValue = totalWorth.max.grossWorth;

            const monthDiff = new Date().getMonth() - totalWorth.max.month;

            for (
              let i = monthCount + 1;
              i <= monthCount + periodSelector;
              i++
            ) {
              if (i > monthDiff) {
                grossworthValue += averageGrossworth;
                networthValue += averageNetworth;
              }
              grossworthChart.push({ x: i, y: Math.round(grossworthValue) });
              networthChart.push({ x: i, y: Math.round(networthValue) });
            }

            setGrossworthChart(grossworthChart);
            setNetworthChart(networthChart);
          }
        } catch (e) {
          console.log("Networth Statistics: " + e);
        }
      }
      if (portfolioService.isReady()) {
        let startTime = performance.now();
        fetchData();
        let endTime = performance.now();
        logTimeTook("Networth Statistics", "Fetch", endTime, startTime);
      }
    }, [email, portfolioService.isReady(), periodSelector])
  );

  const networthSorted = networthChart.sort((a, b) => a.y - b.y);
  const networthMin: number = networthSorted[0]?.y || 0;
  const networthMax = networthSorted[networthSorted.length - 1]?.y || 0;

  const grossWorthSorted = grossworthChart.sort((a, b) => a.y - b.y);
  const grossWorthMin: number = grossWorthSorted[0]?.y || 0;
  const grossWorthMax = grossWorthSorted[grossWorthSorted.length - 1]?.y || 0;

  const firstMonth = totalWorth.min.month;

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View
          style={{
            flex: 1,
            gap: 20,
            paddingHorizontal: commonStyles.mainPaddingHorizontal,
          }}
        >
          <ChartCard
            key={"GROSSWORTH"}
            averageWorth={averageWorth.grossworth}
            grossWorthMin={grossWorthMin}
            grossWorthMax={grossWorthMax}
            evenSelector={evenSelector}
            grossworthChart={grossworthChart}
            periodSelector={periodSelector}
            firstMonth={firstMonth}
            monthCount={monthCount}
            privacyShield={privacyShield}
          />
          <ChartCard
            key={"NETWORTH"}
            averageWorth={averageWorth.networth}
            grossWorthMin={networthMin}
            grossWorthMax={networthMax}
            evenSelector={evenSelector}
            grossworthChart={networthChart}
            periodSelector={periodSelector}
            firstMonth={firstMonth}
            monthCount={monthCount}
            privacyShield={privacyShield}
          />
          <View
            style={{
              justifyContent: "space-evenly",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 6 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(6)}
            >
              <Text style={styles.btnTitleStyle}>{"6m"}</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 12 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(12)}
            >
              <Text style={styles.btnTitleStyle}>{"12m"}</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 24 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(24)}
            >
              <Text style={styles.btnTitleStyle}>{"2y"}</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 36 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(36)}
            >
              <Text style={styles.btnTitleStyle}>{"3y"}</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 48 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(48)}
            >
              <Text style={styles.btnTitleStyle}>{"4y"}</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor:
                  periodSelector === 60 ? dark.button : "transparent",
              }}
              onPress={() => setPeriodSelector(60)}
            >
              <Text style={styles.btnTitleStyle}>{"5y"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
