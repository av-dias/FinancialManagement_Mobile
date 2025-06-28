import { View, Text, StyleSheet, Pressable } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import React, { ReactNode } from "react";
import { VictoryChart, VictoryAxis, VictoryLine } from "victory-native";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: string;
  absoluteIncrease: string;
  relativeIncrease: string;
  data: number[];
  onPress: () => void;
};

const styles = StyleSheet.create({
  wrapperContainer: { padding: 10, flex: 1, height: 150 },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  valueContainer: { flex: 2, justifyContent: "center", padding: 0 },
  statusContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  chartContainer: { flex: 1 },
  valueStyle: {
    fontSize: 35,
    fontWeight: "bold",
    color: dark.textSecundary,
    textAlign: "center",
    textAlignVertical: "center",
  },
  titleStyle: { fontSize: 14, color: dark.textPrimary },
  symbolStyle: {
    fontSize: 13,
    color: dark.textPrimary,
    textAlignVertical: "bottom",
  },
});

const StatsIcon = ({ value }) => {
  if (value > 0) {
    return <Entypo name="arrow-long-up" size={15} color="green" />;
  } else if (value < 0) {
    return <Entypo name="arrow-long-down" size={15} color="red" />;
  } else {
    return (
      <Entypo
        style={{ marginBottom: -1 }}
        name="select-arrows"
        size={15}
        color="gray"
      />
    );
  }
};

const axisStyle = {
  axis: { stroke: "transparent" }, // Adjust strokeWidth
};

export const MainCard = (content: MainCardPropsType) => {
  const lineChartData = content.data.slice();

  const maxValue = content.data.sort((a, b) => b - a)[0];
  const minValue = content.data.sort((a, b) => a - b)[0];

  return (
    <CardWrapper style={styles.wrapperContainer}>
      <Pressable style={{ flex: 1 }} onPress={content.onPress}>
        <View style={styles.titleContainer}>
          {content.icon}
          <Text style={styles.titleStyle}>{content.title}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueStyle}>{content.value}</Text>
        </View>
        <VictoryChart
          height={20} // Adjust this value to control the chart's height
          width={130} // Adjust this value to control the chart's width
          domain={{ y: [minValue * 0.99, maxValue * 1.01] }} // Set the Y-axis domain
          padding={0}
        >
          <VictoryAxis
            tickLabelComponent={<View></View>} // Remove tick labels
            style={axisStyle}
          />
          <VictoryAxis
            style={axisStyle}
            tickLabelComponent={<View></View>} // Remove tick labels
          />
          <VictoryLine
            style={{
              data: { stroke: "green", strokeWidth: 2 }, // Set the stroke color to green
            }}
            data={lineChartData}
            interpolation="natural"
          />
        </VictoryChart>
        <View style={styles.statusContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={styles.titleStyle}
            >{`${content.absoluteIncrease}`}</Text>
            <Text style={styles.symbolStyle}>{`€`}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "center" }}>
              <StatsIcon value={content.absoluteIncrease} />
            </View>
            <Text
              style={styles.titleStyle}
            >{`${content.relativeIncrease}`}</Text>
            <Text style={styles.symbolStyle}>{`%`}</Text>
          </View>
        </View>
      </Pressable>
    </CardWrapper>
  );
};
