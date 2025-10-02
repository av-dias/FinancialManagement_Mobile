import { Text, View } from "react-native";
import { _styles } from "../style";
import { ProgressBar } from "react-native-paper";
import { ProgressBarColors } from "../../../utility/colors";
import { BlurText } from "../../../components/BlurText/BlurText";

type AverageProgressBar = {
  purchaseTotal: any;
  purchaseAverageTotal: any;
  privacyShield: boolean;
};

export const AverageProgressBar = ({
  purchaseTotal,
  purchaseAverageTotal,
  privacyShield = false,
}: AverageProgressBar) => {
  const styles = _styles;

  const getCurrentValue = (value) => {
    if (isNaN(value)) return 0;
    return Number(value).toFixed(0) || 0;
  };

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0)
      return 0;
    return monthValue / monthAverage;
  };

  return (
    <View key={"TotalView"} style={styles.containerAverage}>
      <View style={styles.averageTextTitle}>
        <Text key={"TotalTextAverage"} style={styles.textValue}>
          {"Average"}
        </Text>
        <BlurText
          text={
            <View style={styles.averageTextValue}>
              <Text key={"TotalText1"} style={styles.textValue}>
                {`${getCurrentValue(purchaseTotal)}/`}
              </Text>
              <Text key={"TotalText2"} style={styles.textTotal}>
                {getCurrentValue(purchaseAverageTotal)}
              </Text>
            </View>
          }
          privacyShield={privacyShield}
          style={undefined}
        />
      </View>
      <ProgressBar
        key={"PTtotal"}
        progress={getTotalProgress(
          getCurrentValue(purchaseTotal),
          purchaseAverageTotal
        )}
        style={styles.progressStyle}
        color={ProgressBarColors.red}
      />
    </View>
  );
};
