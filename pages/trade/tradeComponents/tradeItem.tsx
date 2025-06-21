import { View, Text } from "react-native";
import { dark } from "../../../utility/colors";
import { styles } from "../styles";
import { InvestmentEntity } from "../../../store/database/SecurityInvestment/SecurityInvestmentEntity";

export const LoadSecurityIcon = ({ ticker }) => (
  <View style={styles.securityIconContainer}>
    <Text style={{ color: dark.textPrimary, textAlign: "center" }}>
      {ticker || ""}
    </Text>
  </View>
);

export const nameComponent = (item: InvestmentEntity) => (
  <View>
    <Text style={styles.normalText}>{item?.security?.name}</Text>
    <Text style={styles.smallText}>
      {`${item.buyPrice} `}
      <Text style={styles.symbolText}>{`€`}</Text>
    </Text>
  </View>
);

export const valueComponent = (item: InvestmentEntity) => (
  <TradeItem
    cost={Number(item.buyPrice) * item.shares}
    shares={item.shares.toString()}
    ticker={item?.security?.ticker}
  />
);

const TradeItem = ({ cost, shares, ticker }) => (
  <View style={{ alignItems: "flex-end" }}>
    <View>
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
        <Text
          style={{
            color: dark.textPrimary,
            fontSize: 10,
            textAlignVertical: "bottom",
          }}
        >
          {` €`}
        </Text>
      </Text>
      <Text style={{ textAlign: "right" }}>
        <Text
          style={{
            color: dark.textComplementary,
            textAlignVertical: "bottom",
            fontSize: 10,
          }}
        >
          {`${shares} `} {/* Added space after shares */}
        </Text>
        <Text
          style={{
            color: dark.textComplementary,
            fontSize: 8,
            textAlignVertical: "bottom",
          }}
        >
          {ticker || ""}
        </Text>
      </Text>
    </View>
  </View>
);
