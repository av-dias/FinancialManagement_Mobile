import { Text, View } from "react-native";
import { categoryIcons } from "../../../assets/icons";
import { _styles } from "../style";
import { ProgressBar } from "react-native-paper";
import { dark, ProgressBarColors } from "../../../utility/colors";
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
      <View style={styles.itemContainer}>
        <TypeIcon icon={categoryIcons(25).find((category) => category.label === type)} />
        <Text key={type + "TextA"} style={styles.textItem}>
          {type.substring(0, 10)}
        </Text>
      </View>
      <View style={styles.progressDataContainer}>
        <View style={{ gap: 2 }}>
          <Text key={type + "TextT"} style={{ color: dark.textPrimary, textAlign: "right" }}>
            {"Total " + currentTotalTypeValue + "/" + lastTotalTypeValue}
          </Text>
          <ProgressBar
            key={"PT" + type}
            progress={getTotalProgress(currentTotalTypeValue, lastTotalTypeValue)}
            style={styles.progressStyle}
            color={ProgressBarColors.red}
          />
        </View>
        <View style={{ gap: 2 }}>
          <Text key={type + "TextM"} style={{ color: dark.textPrimary, textAlign: "right" }}>
            {"Monthly " + currentTypeValue + "/" + lastAverageTypeValue}
          </Text>
          <ProgressBar
            key={"PM" + type}
            progress={getTotalProgress(currentTypeValue, lastAverageTypeValue)}
            style={styles.progressStyle}
            color={ProgressBarColors.blue}
          />
        </View>
      </View>
    </View>
  );
};
