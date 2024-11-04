import { View, Text, StyleSheet } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import { ReactNode } from "react";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: string;
  absoluteIncrease: string;
  relativeIncrease: string;
};

const styles = StyleSheet.create({
  wrapperContainer: { padding: 15, flex: 1, height: 150 },
  titleContainer: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  valueContainer: { flex: 3, justifyContent: "center", padding: 10 },
  statusContainer: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  valueStyle: { fontSize: 35, fontWeight: "bold", color: dark.textSecundary, textAlign: "center", textAlignVertical: "center" },
  titleStyle: { fontSize: 14, color: dark.textPrimary },
  symbolStyle: { fontSize: 13, color: dark.textPrimary, textAlignVertical: "bottom" },
});

const StatsIcon = ({ value }) => {
  if (value > 0) {
    return <Entypo name="arrow-long-up" size={15} color="green" />;
  } else if (value < 0) {
    return <Entypo name="arrow-long-down" size={15} color="red" />;
  } else {
    return <Entypo style={{ marginBottom: -1 }} name="select-arrows" size={15} color="gray" />;
  }
};

export const MainCard = (content: MainCardPropsType) => (
  <CardWrapper style={styles.wrapperContainer}>
    <View style={styles.titleContainer}>
      {content.icon}
      <Text style={styles.titleStyle}>{content.title}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.valueStyle}>{content.value}</Text>
    </View>
    <View style={styles.statusContainer}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.titleStyle}>{`${content.absoluteIncrease}`}</Text>
        <Text style={styles.symbolStyle}>{`€`}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ justifyContent: "center" }}>
          <StatsIcon value={content.absoluteIncrease} />
        </View>
        <Text style={styles.titleStyle}>{`${content.relativeIncrease}`}</Text>
        <Text style={styles.symbolStyle}>{`%`}</Text>
      </View>
    </View>
  </CardWrapper>
);
