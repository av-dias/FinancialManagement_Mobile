import { View, Text } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { _styles } from "../style";
import { VictoryBar, VictoryLabel, VictoryLine } from "victory-native";
import { getCombinedArray, getMaxArrayObject, getMinArrayObject } from "../../../functions/array";
import { months } from "../../../utility/calendar";
import { dark } from "../../../utility/colors";

type ChartCardPropsType = {
  title: string;
  currentYear: string;
  spendByType: any;
};

export const BarCard = ({ title, currentYear, spendByType }: ChartCardPropsType) => {
  const styles = _styles;

  return (
    <CardWrapper style={styles.chartContainer}>
      <View style={styles.chart}>
        <View style={{ position: "absolute", top: 15 }}>
          <Text style={styles.text}>{title}</Text>
        </View>
        {spendByType[currentYear] && (
          <VictoryBar
            horizontal
            cornerRadius={{ top: 5 }}
            domain={{ y: [-40, getMaxArrayObject(spendByType[currentYear])] }}
            domainPadding={20}
            padding={30}
            style={{
              data: { fill: dark.textPrimary, stroke: dark.textPrimary }, // Set both fill and stroke to white
              parent: { border: "1px solid #ccc" },
            }}
            data={spendByType[currentYear]}
            labels={({ datum }) => datum.x + " " + datum.y.toFixed(0) + "€"}
            labelComponent={<VictoryLabel style={{ fill: dark.textPrimary, fontSize: 10 }} />}
          />
        )}
      </View>
    </CardWrapper>
  );
};
