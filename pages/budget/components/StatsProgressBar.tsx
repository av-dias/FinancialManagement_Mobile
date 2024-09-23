import { Text, View } from "react-native";
import { categoryIcons } from "../../../assets/icons";
import { _styles } from "../style";
import { ProgressBar } from "react-native-paper";
import { dark } from "../../../utility/colors";
import { STATS_TYPE } from "../../../utility/keys";
import { TypeIcon } from "../../../components/TypeIcon/TypeIcon";

type StatsProgressBar = {
  type: any;
  spendAverageByType: any;
  expensesTotalByType: any;
  purchaseCurrentStats: any;
  currentYear: string;
  currentMonth: string;
};

export const StatsProgressBar = ({
  type,
  spendAverageByType,
  expensesTotalByType,
  purchaseCurrentStats,
  currentYear,
  currentMonth,
}: StatsProgressBar) => {
  const styles = _styles;

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0) return 0;
    return monthValue / monthAverage;
  };

  const getLastAvailableAverageTypeValue = (data, currentYear, type) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]].hasOwnProperty(type)) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]][type]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]][type]).toFixed(0);
    }
  };

  const getLastAvailableTypeValue = (data, currentYear, type) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]].hasOwnProperty(type)) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]][type]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]][type]).toFixed(0);
    }
  };

  let lastAverageTypeValue = getLastAvailableAverageTypeValue(spendAverageByType, currentYear, type);
  let lastTotalTypeValue = getLastAvailableTypeValue(expensesTotalByType, currentYear, type);
  let currentTypeValue = 0,
    currentTotalTypeValue = 0;

  if (purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]].hasOwnProperty(type)) {
    currentTypeValue = parseFloat(purchaseCurrentStats[currentYear][currentMonth][STATS_TYPE[1]][type].toFixed(0));
  }
  if (expensesTotalByType[currentYear][STATS_TYPE[1]].hasOwnProperty(type)) {
    currentTotalTypeValue = parseFloat(expensesTotalByType[currentYear][STATS_TYPE[1]][type].toFixed(0));
  }

  return (
    <View key={type + "View"} style={styles.containerItem}>
      <View
        style={{
          justifyContent: "center",
          width: 50,
          backgroundColor: "transparent",
          gap: 5,
        }}
      >
        <TypeIcon icon={categoryIcons(25).find((category) => category.label === type)} />
        <Text key={type + "TextA"} style={styles.textItem}>
          {type.substring(0, 7)}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          gap: 10,
          padding: 5,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text key={type + "TextT"} style={{ color: dark.textPrimary }}>
            {"Total " + currentTotalTypeValue + "/" + lastTotalTypeValue}
          </Text>
          <ProgressBar key={"PT" + type} progress={getTotalProgress(currentTotalTypeValue, lastTotalTypeValue)} color={"darkred"} />
        </View>
        <View style={{ gap: 2 }}>
          <Text key={type + "TextM"} style={{ color: dark.textPrimary }}>
            {"Monthly " + currentTypeValue + "/" + lastAverageTypeValue}
          </Text>
          <ProgressBar key={"PM" + type} progress={getTotalProgress(currentTypeValue, lastAverageTypeValue)} color={"blue"} />
        </View>
      </View>
    </View>
  );
};
