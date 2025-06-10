import { Text, View } from "react-native";
import { categoryIcons } from "../../../utility/icons";
import { _styles } from "../style";
import { ProgressBar } from "react-native-paper";
import { dark, ProgressBarColors } from "../../../utility/colors";
import { TypeIcon } from "../../../components/TypeIcon/TypeIcon";

type StatsProgressBar = {
  type: any;
  spendAverageByType: any;
  expensesPrevTotalByType: any;
  expensesTotalByType: any;
  purchaseCurrentStats: any;
  currentYear: string;
  currentMonth: string;
};

export const StatsProgressBar = ({
  type,
  spendAverageByType,
  expensesPrevTotalByType,
  expensesTotalByType,
  purchaseCurrentStats,
  currentYear,
  currentMonth,
}: StatsProgressBar) => {
  const styles = _styles;

  const getTotalProgress = (monthValue, monthAverage) => {
    if (!monthValue || !monthAverage || monthAverage == 0 || monthValue == 0)
      return 0;
    return monthValue / monthAverage;
  };

  let lastAverageTypeValue =
    parseFloat(spendAverageByType[type]?.toFixed(0)) || 0;
  let lastTotalTypeValue =
    parseFloat(expensesPrevTotalByType[type]?.toFixed(0)) || 0;
  let currentTypeValue =
    parseFloat(purchaseCurrentStats[type]?.toFixed(0)) || 0;
  let currentTotalTypeValue =
    parseFloat(expensesTotalByType[type]?.toFixed(0)) || 0;

  const ProgressBarComponent = ({
    type,
    color,
    currentTypeValue,
    lastAverageTypeValue,
    totalProgress,
  }) => (
    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <Text
          key={type + "TextM1"}
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: dark.textPrimary,
            textAlign: "right",
          }}
        >
          {currentTypeValue + "/"}
        </Text>
        <Text
          key={type + "TextM2"}
          style={{ color: dark.textPrimary, textAlign: "right", fontSize: 12 }}
        >
          {lastAverageTypeValue}
        </Text>
      </View>
      <ProgressBar
        key={"PM" + type}
        progress={totalProgress}
        style={styles.progressStyle}
        color={color}
      />
    </View>
  );

  return (
    <View key={type + "View"} style={styles.containerItem}>
      <ProgressBarComponent
        color={ProgressBarColors.red}
        type={type}
        currentTypeValue={currentTotalTypeValue}
        lastAverageTypeValue={lastTotalTypeValue}
        totalProgress={getTotalProgress(
          currentTotalTypeValue,
          lastTotalTypeValue
        )}
      />
      <View style={styles.itemContainer}>
        <TypeIcon
          icon={categoryIcons(25).find((category) => category.label === type)}
        />
      </View>
      <ProgressBarComponent
        color={ProgressBarColors.blue}
        type={type}
        currentTypeValue={currentTypeValue}
        lastAverageTypeValue={lastAverageTypeValue}
        totalProgress={getTotalProgress(currentTypeValue, lastAverageTypeValue)}
      />
    </View>
  );
};
