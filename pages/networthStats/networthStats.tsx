import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { _styles } from "./style";
import React, { useContext } from "react";
import { UserContext } from "../../store/user-context";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { PortfolioService } from "../../service/PortfolioService";
import { useFocusEffect } from "@react-navigation/native";
import { logTimeTook } from "../../utility/logger";
import { getMonthsBetween, months } from "../../utility/calendar";
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLabel } from "victory-native";
import { moderateScale } from "../../functions/responsive";

const axisStyle = {
  axis: { stroke: "transparent" }, // Adjust strokeWidth
};

export default function NetworthStats({ navigation }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const portfolioService = new PortfolioService();

  const [grossworthChart, setGrossworthChart] = React.useState<{ x: number; y: number }[]>([]);
  const [networthChart, setNetworthChart] = React.useState<{ x: number; y: number }[]>([]);
  const [averageWorth, setAverageWorth] = React.useState<{ networth: number; grossworth: number }>({ networth: 0, grossworth: 0 });
  const [totalWorth, setTotalWorth] = React.useState<{
    min: { month: number; year: number; grossWorth: number; networth: number };
    max: { month: number; year: number; grossWorth: number; networth: number };
    values: { grossworth: number; networth: number }[];
  }>({ min: { month: 0, year: 0, grossWorth: 0, networth: 0 }, max: { month: 0, year: 0, grossWorth: 0, networth: 0 }, values: [] });
  const [monthCount, setMonthCount] = React.useState<number>(0);
  const [evenSelector, setEvenSelector] = React.useState<boolean>(true);
  const [periodSelector, setPeriodSelector] = React.useState<number>(6); // 0 for 6 months, 1 for 12 months

  const evenEvaluator = (value: number) => {
    if (periodSelector >= 48) {
      return value % 5 === 0; // Return true if value is a multiple of 5 for 2 years
    }
    if (periodSelector >= 24) {
      return value % 4 === 0; // Return true if value is a multiple of 5 for 2 years
    }
    if (evenSelector) {
      return value % 2 === 0; // Return 2 if evenSelector is 2, otherwise return 1
    } else {
      return value % 2 !== 0; // Default to 1 if evenSelector is not set
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            const totalWorth = await portfolioService.getMinMaxWorth(email);
            const monthCount = getMonthsBetween(totalWorth.min.month, totalWorth.min.year, totalWorth.max.month, totalWorth.max.year);
            const grossworthDiff = totalWorth.max.grossWorth - totalWorth.min.grossWorth;
            const networthDiff = totalWorth.max.networth - totalWorth.min.networth;
            const averageGrossworth = grossworthDiff / monthCount;
            const averageNetworth = networthDiff / monthCount;
            const grossworthChart = totalWorth.values.map((value, index) => ({ x: index, y: Math.round(value.grossworth) }));
            const networthChart = totalWorth.values.map((value, index) => ({ x: index, y: Math.round(value.networth) }));
            setAverageWorth({ grossworth: Math.round(averageGrossworth), networth: Math.round(averageNetworth) });
            setTotalWorth(totalWorth);
            setEvenSelector(monthCount % 2 === 0 ? true : false); // Ensures evenSelector is set to 2 if monthCount is even, otherwise 1
            setMonthCount(monthCount); // Ensure monthCount is even for better chart display

            let networthValue = totalWorth.max.networth;
            let grossworthValue = totalWorth.max.grossWorth;

            for (let i = monthCount + 1; i <= monthCount + periodSelector; i++) {
              grossworthValue += averageGrossworth;
              networthValue += averageNetworth;
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
        <View style={{ flex: 1, gap: 5 }}>
          <CardWrapper style={styles.wrapperContainer}>
            <View style={styles.titleContainer}>
              <FontAwesome5 name="money-check" size={15} color={dark.secundary} />
              <Text style={styles.titleStyle}>{"GrossWorth"}</Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.AverageTitleStyle}>{`Avg. Increase: ${averageWorth.grossworth}`}</Text>
              </View>
            </View>
            <VictoryChart
              height={moderateScale(240)} // Adjust this value to control the chart's height
              width={310} // Adjust this value to control the chart's width
              domain={{ y: [grossWorthMin * 0.99, grossWorthMax * 1.1] }} // Set the Y-axis domain
              padding={{ top: 0, bottom: 25, left: 0, right: 0 }} // increase bottom padding
              minDomain={-1} // Set the minimum Y-axis domain to the first value
              maxDomain={evenSelector ? grossworthChart.length : grossworthChart.length - 1 || 0}
            >
              <VictoryAxis
                tickLabelComponent={<></>} // Remove tick labels
                style={axisStyle}
              />
              <VictoryAxis
                style={{
                  axis: { stroke: "transparent" }, // Axis line itself
                  tickLabels: { fontSize: 12, fill: "gray" },
                }}
                tickValues={grossworthChart.map((d) => d.x).filter((x) => evenEvaluator(x))} // Show only even x values
                tickFormat={(x) => {
                  const index = (x + firstMonth) % 12;
                  return periodSelector > 24 ? months[index].slice(0, 1) : months[index]; // maps 1 → Jan, 2 → Feb, etc.
                }}
              />
              <VictoryLine
                style={{
                  data: { stroke: "green", strokeWidth: 2 }, // Set the stroke color to green
                  // change label font color
                }}
                data={grossworthChart} // Example data, replace with actual data
                interpolation="natural"
                labels={({ datum }) => (evenEvaluator(datum.x) ? datum.y : null)} // Show y value
                labelComponent={
                  <VictoryLabel
                    style={{ fill: ({ datum }) => (datum.x === monthCount ? dark.button : dark.textPrimary), fontSize: 8 }} // 👈 Change font color here
                  />
                }
              />
            </VictoryChart>
          </CardWrapper>
          <CardWrapper style={styles.wrapperContainer}>
            <View style={styles.titleContainer}>
              <FontAwesome5 name="money-check-alt" size={15} color="lightblue" />
              <Text style={styles.titleStyle}>{"Networth"}</Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.AverageTitleStyle}>{`Avg. Increase: ${averageWorth.networth}`}</Text>
              </View>
            </View>
            <VictoryChart
              height={moderateScale(240)} // Adjust this value to control the chart's height
              width={310} // Adjust this value to control the chart's width
              domain={{ y: [networthMin * 0.99, networthMax * 1.08] }} // Set the Y-axis domain
              padding={{ top: 0, bottom: 25, left: 0, right: 0 }} // increase bottom padding
              minDomain={-1} // Set the minimum Y-axis domain to the first value
              maxDomain={evenSelector ? networthChart.length : networthChart.length - 1 || 0} // Set the maximum Y-axis domain to the last value
            >
              <VictoryAxis
                tickLabelComponent={<></>} // Remove tick labels
                style={axisStyle}
              />
              <VictoryAxis
                style={{
                  axis: { stroke: "transparent" }, // Axis line itself
                  tickLabels: { fontSize: 12, fill: "gray" },
                }}
                tickValues={grossworthChart.map((d) => d.x).filter((x) => evenEvaluator(x))} // Show only even x values
                tickFormat={(x) => {
                  const index = (x + firstMonth) % 12;
                  return periodSelector > 24 ? months[index].slice(0, 1) : months[index]; // maps 1 → Jan, 2 → Feb, etc.
                }}
              />
              <VictoryLine
                style={{
                  data: { stroke: "green", strokeWidth: 2 }, // Set the stroke color to green
                }}
                data={networthChart} // Example data, replace with actual data
                interpolation="natural"
                labels={({ datum }) => (evenEvaluator(datum.x) ? datum.y : null)} // Show y value
                labelComponent={
                  <VictoryLabel
                    style={{ fill: ({ datum }) => (datum.x === monthCount ? dark.button : dark.textPrimary), fontSize: 8 }} // 👈 Change font color here
                  />
                }
              />
            </VictoryChart>
          </CardWrapper>
          <View style={{ justifyContent: "space-evenly", flexDirection: "row", gap: 5 }}>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 6 ? dark.button : "transparent" }}
              onPress={() => setPeriodSelector(6)}
            >
              <Text style={styles.btnTitleStyle}>{"6m"}</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 12 ? dark.button : "transparent" }}
              onPress={() => setPeriodSelector(12)}
            >
              <Text style={styles.btnTitleStyle}>{"12m"}</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 24 ? dark.button : "transparent" }}
              onPress={() => setPeriodSelector(24)}
            >
              <Text style={styles.btnTitleStyle}>{"2y"}</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 36 ? dark.button : "transparent" }}
              onPress={() => setPeriodSelector(36)}
            >
              <Text style={styles.btnTitleStyle}>{"3y"}</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 48 ? dark.button : "transparent" }}
              onPress={() => setPeriodSelector(48)}
            >
              <Text style={styles.btnTitleStyle}>{"4y"}</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, backgroundColor: periodSelector === 60 ? dark.button : "transparent" }}
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
