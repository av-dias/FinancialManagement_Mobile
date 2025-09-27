import React from "react";
import { View, Text } from "react-native";
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryLabel,
} from "victory-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { verticalScale, moderateScale } from "../../../functions/responsive";
import { _styles } from "../style";
import { months } from "../../../utility/calendar";
import { dark } from "../../../utility/colors";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";

export const ChartCard = ({
  averageWorth,
  grossWorthMin,
  grossWorthMax,
  evenSelector,
  grossworthChart,
  periodSelector,
  firstMonth,
  monthCount,
}) => {
  const styles = _styles;

  const axisStyle = {
    axis: { stroke: "transparent" }, // Adjust strokeWidth
  };

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

  return (
    <CardWrapper style={styles.wrapperContainer}>
      <View style={styles.titleContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
            gap: 5,
            paddingLeft: verticalScale(2),
          }}
        >
          <FontAwesome5 name="money-check" size={15} color={dark.secundary} />
          <Text style={styles.titleStyle}>{"GROSS"}</Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text>
            <Text style={styles.AverageTitleStyle}>{`${averageWorth}`}</Text>
            <Text style={styles.AverageSubTitleStyle}>{`€ on average`}</Text>
          </Text>
        </View>
      </View>
      <VictoryChart
        height={moderateScale(230)} // Adjust this value to control the chart's height
        width={310} // Adjust this value to control the chart's width
        domain={{ y: [grossWorthMin * 0.99, grossWorthMax * 1.1] }} // Set the Y-axis domain
        padding={{
          top: 0,
          bottom: 25,
          left: evenSelector ? 0 : -verticalScale(20),
          right: 0,
        }} // increase bottom padding
        minDomain={-1} // Set the minimum Y-axis domain to the first value
        maxDomain={
          evenSelector
            ? grossworthChart.length
            : grossworthChart.length - 1 || 0
        }
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
          tickValues={grossworthChart
            .map((d) => d.x)
            .filter((x) => evenEvaluator(x))} // Show only even x values
          tickFormat={(x) => {
            const index = (x + firstMonth) % 12;
            return periodSelector > 24
              ? months[index].slice(0, 1)
              : months[index]; // maps 1 → Jan, 2 → Feb, etc.
          }}
        />
        <VictoryLine
          style={{
            data: { stroke: dark.green, strokeWidth: 2 }, // Set the stroke color to green
            // change label font color
          }}
          data={grossworthChart} // Example data, replace with actual data
          interpolation="natural"
          labels={({ datum }) => (evenEvaluator(datum.x) ? datum.y : null)} // Show y value
          labelComponent={
            <VictoryLabel
              style={{
                fill: ({ datum }) =>
                  datum.x === monthCount ? dark.button : dark.textPrimary,
                fontSize: 8,
              }} // 👈 Change font color here
            />
          }
        />
      </VictoryChart>
    </CardWrapper>
  );
};
