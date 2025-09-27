import { View, Text, StyleSheet, Pressable } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import React, { ReactNode } from "react";
import { VictoryChart, VictoryAxis, VictoryLine } from "victory-native";
import { verticalScale } from "../../../functions/responsive";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: string;
  absoluteIncrease: string;
  relativeIncrease: string;
  data: number[];
  onPress: () => void;
};

const StatsIcon = ({ value }) => {
  if (value > 0) {
    return <Entypo name="arrow-long-up" size={10} color={dark.green} />;
  } else if (value < 0) {
    return <Entypo name="arrow-long-down" size={10} color="red" />;
  } else {
    return (
      <Entypo
        style={{ marginBottom: -1 }}
        name="select-arrows"
        size={10}
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
        <View style={{ padding: 5 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>{content.title}</Text>
            {content.icon}
          </View>
          <Text>
            <Text style={styles.valueStyle}>{content.value}</Text>
            <Text style={styles.symbolStyle}>{`€`}</Text>
          </Text>
          <View style={styles.statusContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text>
                <Text
                  style={styles.smallTextStyle}
                >{`${content.absoluteIncrease}`}</Text>
                <Text style={styles.smallSymbolStyle}>{`€`}</Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ justifyContent: "center" }}>
                <StatsIcon value={content.absoluteIncrease} />
              </View>
              <Text>
                <Text
                  style={styles.smallTextStyle}
                >{`${content.relativeIncrease}`}</Text>
                <Text style={styles.smallSymbolStyle}>{`%`}</Text>
              </Text>
            </View>
          </View>
        </View>
        <VictoryChart
          height={60} // Adjust this value to control the chart's height
          width={verticalScale(140)} // Adjust this value to control the chart's width
          domain={{ y: [minValue, maxValue] }} // Set the Y-axis domain
          padding={5}
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
              data: {
                stroke: dark.green,
                strokeWidth: 2,
              }, // Set the stroke color to green
            }}
            data={lineChartData}
            interpolation="basis"
          />
        </VictoryChart>
      </Pressable>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    padding: 10,
    flex: 1,
    height: 160,
    backgroundColor: dark.glass,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  valueContainer: {
    flex: 2,
    justifyContent: "flex-start",
    padding: 0,
    backgroundColor: "red",
  },
  statusContainer: {
    flexDirection: "row",
    paddingLeft: verticalScale(2),
  },
  chartContainer: { flex: 1 },
  valueStyle: {
    fontSize: 25,
    fontWeight: "bold",
    color: dark.textSecundary,
    textAlign: "left",
  },
  titleStyle: { fontSize: 14, color: dark.textPrimary },
  smallTextStyle: { fontSize: 10, color: dark.textPrimary },
  symbolStyle: {
    fontSize: 13,
    color: dark.textPrimary,
    textAlignVertical: "bottom",
  },
  smallSymbolStyle: {
    fontSize: 8,
    color: dark.textPrimary,
    textAlignVertical: "bottom",
  },
});
