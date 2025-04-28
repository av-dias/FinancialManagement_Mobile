import { Text, View } from "react-native";
import { _styles } from "../style";
import { ProgressBar } from "react-native-paper";
import { ProgressBarColors } from "../../../utility/colors";

type AverageProgressBar = {
  purchaseTotal: any;
  purchaseAverageTotal: any;
};

export const AverageProgressBar = ({ purchaseTotal, purchaseAverageTotal }: AverageProgressBar) => {
  const styles = _styles;

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0) return 0;
    return monthValue / monthAverage;
  };

  return (
    <View key={"TotalView"} style={styles.containerAverage}>
      <View style={styles.averageTextTitle}>
        <Text key={"TotalTextAverage"} style={styles.textValue}>
          {"Average"}
        </Text>
        <View style={styles.averageTextValue}>
          <Text key={"TotalText1"} style={styles.textValue}>
            {`${getCurrentValue(purchaseTotal)}/`}
          </Text>
          <Text key={"TotalText2"} style={styles.textTotal}>
            {purchaseAverageTotal}
          </Text>
        </View>
      </View>
      <ProgressBar key={"PTtotal"} progress={getTotalProgress(getCurrentValue(purchaseTotal), purchaseAverageTotal)} style={styles.progressStyle} color={ProgressBarColors.red} />
    </View>
  );
};
