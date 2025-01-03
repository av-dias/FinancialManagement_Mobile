import { Text, View } from "react-native";
import { _styles } from "../style";
import { STATS_TYPE } from "../../../utility/keys";
import { ProgressBar } from "react-native-paper";
import { ProgressBarColors } from "../../../utility/colors";

type AverageProgressBar = {
  purchaseTotal: any;
  purchaseAverageTotal: any;
  currentYear: string;
};

export const AverageProgressBar = ({ purchaseTotal, purchaseAverageTotal, currentYear }: AverageProgressBar) => {
  const styles = _styles;

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };
  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0) return 0;
    return monthValue / monthAverage;
  };

  const getLastAvailableAverageValue = (data, currentYear) => {
    if (data[parseFloat(currentYear) - 1] && data[parseFloat(currentYear) - 1][STATS_TYPE[1]]) {
      return parseFloat(data[currentYear - 1][STATS_TYPE[1]]).toFixed(0);
    } else {
      return parseFloat(data[currentYear][STATS_TYPE[1]]).toFixed(0);
    }
  };

  return (
    <View key={"TotalView"} style={styles.containerAverage}>
      <View style={styles.averageTextTitle}>
        <Text key={"TotalTextAverage"} style={styles.textValue}>
          {"Average"}
        </Text>
        <View style={styles.averageTextValue}>
          <Text key={"TotalText1"} style={styles.textValue}>
            {`${getCurrentValue(purchaseTotal[STATS_TYPE[1]])}/`}
          </Text>
          <Text key={"TotalText2"} style={styles.textTotal}>
            {getLastAvailableAverageValue(purchaseAverageTotal, currentYear)}
          </Text>
        </View>
      </View>
      <ProgressBar
        key={"PTtotal"}
        progress={getTotalProgress(getCurrentValue(purchaseTotal[STATS_TYPE[1]]), getLastAvailableAverageValue(purchaseAverageTotal, currentYear))}
        style={styles.progressStyle}
        color={ProgressBarColors.red}
      />
    </View>
  );
};
