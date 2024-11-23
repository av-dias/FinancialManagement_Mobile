import { View, Text, ScrollView, Pressable } from "react-native";
import CardWrapper from "../cardWrapper/cardWrapper";
import { dark } from "../../utility/colors";
import { _styles } from "./style";
import { useRef } from "react";
import commonStyles from "../../utility/commonStyles";

type CustomBarChartProps = {
  maxBarValue: number; // Maximum value of the bar chart
  data: any[]; // Data for the bar chart (array of objects with 'value' and 'color' properties)
  labels: string[]; // Labels for the bar chart (array of objects with
  onPressCallback?: (index: number) => void; // Callback
};

const loadScrollViewPosition = () => {
  const today = new Date();
  const currentMonthIndex = today.getMonth(); // 0 (January) to 11 (December)

  if (currentMonthIndex < 3) return 0;

  // Calculate the offset based on the width of each bar and the target index
  const barWidth = 50; // Adjust based on actual bar width
  const offset = (currentMonthIndex - 3) * barWidth;

  return offset;
};

export const CustomBarChart = ({ maxBarValue = 1, data, labels, onPressCallback }: CustomBarChartProps) => {
  const styles = _styles;
  const ref = useRef<ScrollView>(null); // Improve scrollView positioning based on current month
  if (!data) return null;

  return (
    <CardWrapper noStyle={true}>
      <ScrollView
        ref={ref}
        onContentSizeChange={() => ref.current.scrollTo({ x: loadScrollViewPosition(), animated: true })}
        horizontal={true}
        contentContainerStyle={styles.scrollviewContainer}
        showsHorizontalScrollIndicator={false}
      >
        {labels.map((month, index) => {
          let value = Number(data.find((element) => element.label === month).value);
          return (
            <Pressable key={`barChart${month}`} style={({ pressed }) => commonStyles.onBarPressBounce(pressed, styles.barContainer, onPressCallback)} onPress={() => onPressCallback(index)}>
              <View style={styles.barValueContainer}>
                <Text style={styles.barValueText}>{value.toFixed(0)}</Text>
              </View>
              <View style={styles.barOutterStyle}>
                <View style={{ ...styles.barUnfilledStyle, flex: 1 - value / maxBarValue }} />
                <View
                  style={{
                    ...styles.barFilledStyle,
                    flex: value / maxBarValue,
                  }}
                />
              </View>
              <Text style={{ color: dark.textPrimary, textAlign: "center" }}>{month}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </CardWrapper>
  );
};
