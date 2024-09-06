import { View, Text, StyleSheet } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import { ReactNode } from "react";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: number;
  absoluteIncrease: number;
  relativeIncrease: number;
};

const styles = StyleSheet.create({
  wrapperContainer: { flexDirection: "row", padding: 25, width: "100%", height: 150 },
  valueContainer: { flex: 4, justifyContent: "center", backgroundColor: "transparent", padding: 10 },
  valueStyle: { fontSize: 50, fontWeight: "bold", color: dark.textSecundary },
  titleStyle: { fontSize: 20, color: dark.textPrimary },
  statusContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "transparent", alignItems: "flex-end", padding: 10 },
});

export const MainCard = (content: MainCardPropsType) => (
  <CardWrapper style={styles.wrapperContainer}>
    <View style={styles.valueContainer}>
      <Text style={styles.valueStyle}>{content.value}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {content.icon}
        <Text style={styles.titleStyle}>{content.title}</Text>
      </View>
    </View>
    <View style={styles.statusContainer}>
      <Text style={styles.titleStyle}>{`${content.absoluteIncrease}€`}</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ justifyContent: "center" }}>
          <Entypo name="arrow-long-up" size={20} color="green" />
        </View>
        <Text style={styles.titleStyle}>{`${content.relativeIncrease}%`}</Text>
      </View>
    </View>
  </CardWrapper>
);
