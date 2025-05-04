import { View, Text, StyleSheet } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import React, { ReactNode } from "react";
import { LineChart } from "react-native-gifted-charts";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: string;
  absoluteIncrease: string;
  relativeIncrease: string;
  data: number[];
};

const styles = StyleSheet.create({
  wrapperContainer: { padding: 10, flex: 1, height: 150 },
  titleContainer: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  valueContainer: { flex: 2, justifyContent: "center", padding: 0 },
  statusContainer: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  chartContainer: { flex: 1 },
  valueStyle: { fontSize: 35, fontWeight: "bold", color: dark.textSecundary, textAlign: "center", textAlignVertical: "center" },
  titleStyle: { fontSize: 14, color: dark.textPrimary },
  symbolStyle: { fontSize: 13, color: dark.textPrimary, textAlignVertical: "bottom" },
});

const StatsIcon = ({ value }) => {
  if (value > 0) {
    return <Entypo name="arrow-long-up" size={15} color="green" />;
  } else if (value < 0) {
    return <Entypo name="arrow-long-down" size={15} color="red" />;
  } else {
    return <Entypo style={{ marginBottom: -1 }} name="select-arrows" size={15} color="gray" />;
  }
};

export const MainCard = (content: MainCardPropsType) => {
  const maxValue = content.data.sort((a, b) => b - a)[0];
  const minValue = content.data.sort((a, b) => a - b)[0];
  const lineChartData = content.data.map((v) => ({ value: v }));

  return (
    <CardWrapper style={styles.wrapperContainer}>
      <View style={styles.titleContainer}>
        {content.icon}
        <Text style={styles.titleStyle}>{content.title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.valueStyle}>{content.value}</Text>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          lineGradient
          height={20}
          width={100}
          adjustToWidth={true}
          initialSpacing={0}
          yAxisOffset={minValue}
          maxValue={maxValue + 5}
          color="green"
          dataPointsColor="transparent"
          hideAxesAndRules
          curved={true}
        />
      </View>
      <View style={styles.statusContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.titleStyle}>{`${content.absoluteIncrease}`}</Text>
          <Text style={styles.symbolStyle}>{`€`}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>
            <StatsIcon value={content.absoluteIncrease} />
          </View>
          <Text style={styles.titleStyle}>{`${content.relativeIncrease}`}</Text>
          <Text style={styles.symbolStyle}>{`%`}</Text>
        </View>
      </View>
    </CardWrapper>
  );
};
