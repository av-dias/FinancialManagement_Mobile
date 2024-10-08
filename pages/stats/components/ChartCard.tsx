import { View, Text } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { _styles } from "../style";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
} from "victory-native";
import {
  getCombinedArray,
  getMaxArrayObject,
  getMinArrayObject,
} from "../../../functions/array";
import { months } from "../../../utility/calendar";
import { dark } from "../../../utility/colors";

type ChartCardPropsType = {
  title: string;
  currentYear: string;
  splitDeptData: any;
};

export const ChartCard = ({
  title,
  currentYear,
  splitDeptData,
}: ChartCardPropsType) => {
  const styles = _styles;

  const chartTheme = {
    axis: {
      style: {
        color: "white",
      },
    },
  };

  return (
    <CardWrapper style={styles.chartContainer}>
      <View style={{ position: "absolute", top: 10 }}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <VictoryLine
        domain={{
          x: [0, 13],
          y: [
            getMinArrayObject(
              getCombinedArray(
                splitDeptData[currentYear],
                splitDeptData[currentYear]
              )
            ),
            getMaxArrayObject(
              getCombinedArray(
                splitDeptData[currentYear],
                splitDeptData[currentYear]
              )
            ),
          ],
        }}
        padding={{ left: 20 }}
        style={{
          data: { stroke: "rgb(112,137,187)" },
          parent: { border: "1px solid #ccc" },
        }}
        categories={{ x: months }}
        data={splitDeptData[currentYear] || []}
        interpolation="natural"
        labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
        labelComponent={
          <VictoryLabel style={{ fill: dark.textPrimary, fontSize: 10 }} />
        }
      />
    </CardWrapper>
  );
};
