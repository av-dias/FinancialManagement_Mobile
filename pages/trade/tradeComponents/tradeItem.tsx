import { View, Text } from "react-native";
import { dark } from "../../../utility/colors";
import { styles } from "../styles";

export const LoadSecurityIcon = ({ ticker }) => (
  <View style={styles.securityIconContainer}>
    <Text style={{ color: dark.textPrimary, textAlign: "center" }}>
      {ticker}
    </Text>
  </View>
);

export const valueComponent = (item) => (
  <TradeItem
    cost={Number(item.buyPrice) * item.shares}
    shares={item.shares.toString()}
    ticker={item.security.ticker}
  />
);

const TradeItem = ({ cost, shares, ticker }) => (
  <View style={{ flex: 3, alignItems: "flex-end" }}>
    <View style={{ gap: 1 }}>
      <Text style={{ textAlign: "right" }}>
        <Text
          style={{
            color: dark.textPrimary,
            textAlignVertical: "bottom",
            fontSize: 12,
          }}
        >
          {cost.toFixed(2)}
        </Text>
        <Text> </Text>
        <Text
          style={{
            color: dark.textPrimary,
            fontSize: 10,
            textAlignVertical: "bottom",
          }}
        >
          €
        </Text>
      </Text>
      <Text style={{ textAlign: "right" }}>
        <Text
          style={{
            color: dark.textComplementary,
            textAlignVertical: "bottom",
            fontSize: 12,
          }}
        >
          {shares}
        </Text>
        <Text> </Text>
        <Text
          style={{
            color: dark.textComplementary,
            fontSize: 10,
            textAlignVertical: "bottom",
          }}
        >
          {ticker}
        </Text>
      </Text>
    </View>
  </View>
);
