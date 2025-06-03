import { View, Text } from "react-native";
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
            const grossworthChart = [];
            const networthChart = [];
            setAverageWorth({ grossworth: Math.round(averageGrossworth), networth: Math.round(averageNetworth) });

            let networthValue = totalWorth.max.networth;
            let grossworthValue = totalWorth.max.grossWorth;
            let month = totalWorth.max.month;

            for (let i = 0; i < 12; i++) {
              if (month === 12) month = 0;
              grossworthChart.push({ x: months[month], y: Math.round(grossworthValue) });
              networthChart.push({ x: months[month], y: Math.round(networthValue) });

              grossworthValue += averageGrossworth;
              networthValue += averageNetworth;
              month++;
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
    }, [email, portfolioService.isReady()])
  );

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
              height={240} // Adjust this value to control the chart's height
              width={300} // Adjust this value to control the chart's width
              domain={{ y: [grossworthChart[0]?.y * 1, grossworthChart[grossworthChart?.length - 1]?.y * 1.05] }} // Set the Y-axis domain
              padding={{ top: 0, bottom: 25, left: 0, right: 0 }} // increase bottom padding
              minDomain={grossworthChart[0]?.x - 1 || 0} // Set the minimum Y-axis domain to the first value
              maxDomain={13}
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
              />
              <VictoryLine
                style={{
                  data: { stroke: "green", strokeWidth: 2 }, // Set the stroke color to green
                }}
                data={grossworthChart} // Example data, replace with actual data
                interpolation="natural"
                labels={({ datum }) => datum.y} // Show y value
                labelComponent={
                  <VictoryLabel
                    style={{ fill: dark.textPrimary, fontSize: 8 }} // 👈 Change font color here
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
              height={240} // Adjust this value to control the chart's height
              width={300} // Adjust this value to control the chart's width
              domain={{ y: [networthChart[0]?.y * 1, networthChart[networthChart.length - 1]?.y * 1.03] }} // Set the Y-axis domain
              padding={{ top: 0, bottom: 25, left: 0, right: 0 }} // increase bottom padding
              minDomain={networthChart[0]?.x - 1 || 0} // Set the minimum Y-axis domain to the first value
              maxDomain={13}
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
              />
              <VictoryLine
                style={{
                  data: { stroke: "green", strokeWidth: 2 }, // Set the stroke color to green
                }}
                data={networthChart} // Example data, replace with actual data
                interpolation="natural"
                labels={({ datum }) => datum.y} // Show y value
                labelComponent={
                  <VictoryLabel
                    style={{ fill: dark.textPrimary, fontSize: 8 }} // 👈 Change font color here
                  />
                }
              />
            </VictoryChart>
          </CardWrapper>
        </View>
      </View>
    </LinearGradient>
  );
}
