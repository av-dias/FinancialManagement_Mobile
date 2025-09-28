import { View, Text } from "react-native";
import CardWrapper from "../cardWrapper/cardWrapper";
import { CustomBarChart } from "../CustomBarChart/CustomBarChart";
import { months } from "../../utility/calendar";
import { styles } from "./style";
import { dark } from "../../utility/colors";

export default function BarChartCard({
  expensesByMonth,
  cardTitle,
  cardSubtitle,
}) {
  return (
    <CardWrapper style={{ padding: 20, backgroundColor: dark.glass }}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.titleStyle}>{cardTitle}</Text>
          <Text>
            <Text style={styles.secundaryTextStyle}>{cardSubtitle}</Text>
            <Text style={styles.symbolStyle}>{`€`}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <CustomBarChart
          maxBarValue={
            expensesByMonth.sort((a, b) => b.value - a.value)[0]?.value || 0
          }
          data={expensesByMonth}
          labels={months}
        />
      </View>
    </CardWrapper>
  );
}
