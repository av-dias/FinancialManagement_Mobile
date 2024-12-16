import { View, Text } from "react-native";
import { dark } from "../../../utility/colors";

export const TradeItem = ({ icon, shares, cost, ticker, name }) => {
  return (
    <View style={{ flex: 1, flexDirection: "row", maxHeight: 60 }}>
      <View style={{ flex: 1, alignItems: "flex-start" }}>{icon}</View>
      <View style={{ flex: 3, alignItems: "flex-start", justifyContent: "center" }}>
        <Text style={{ color: dark.textComplementary }}>{name}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <View style={{ gap: 1 }}>
          <Text style={{ textAlign: "right" }}>
            <Text style={{ color: dark.textPrimary, textAlignVertical: "bottom", fontSize: 12 }}>{cost.toFixed(2)}</Text>
            <Text> </Text>
            <Text style={{ color: dark.textPrimary, fontSize: 10, textAlignVertical: "bottom" }}>€</Text>
          </Text>
          <Text style={{ textAlign: "right" }}>
            <Text style={{ color: dark.textComplementary, textAlignVertical: "bottom", fontSize: 12 }}>{shares}</Text>
            <Text> </Text>
            <Text style={{ color: dark.textComplementary, fontSize: 10, textAlignVertical: "bottom" }}>{ticker}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
