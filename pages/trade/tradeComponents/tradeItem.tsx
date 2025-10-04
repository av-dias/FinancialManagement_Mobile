import { View, Text } from "react-native";
import { dark, utilsColors } from "../../../utility/colors";
import { styles } from "../styles";
import {
  InvestmentEntity,
  SecurityEntity,
} from "../../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import { VictoryChart, VictoryAxis, VictoryLine } from "victory-native";
import { verticalScale } from "../../../functions/responsive";
import { BlurText } from "../../../components/BlurText/BlurText";
import { getMonthsBetween } from "../../../utility/calendar";

const axisStyle = {
  axis: { stroke: "transparent" }, // Adjust strokeWidth
};

const loadChartData = (investments: InvestmentEntity[]) => {
  if (investments.length < 1) return [];
  let previousDate = null;

  const sortedInvestments = investments.sort(
    (a, b) => new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
  );

  let finalList = [],
    acc = 0,
    index = 0;

  if (sortedInvestments.length > 1) {
    for (const i of sortedInvestments) {
      if (previousDate) {
        const onDate = new Date(i.buyDate);
        const monthsBetween = getMonthsBetween(
          previousDate.getMonth(),
          previousDate.getFullYear(),
          onDate.getMonth(),
          onDate.getFullYear()
        );

        for (let monthCount = 0; monthCount < monthsBetween; monthCount++) {
          finalList.push({
            x: index++,
            y: acc,
          });
        }
      }

      const currentValue = Number(i.buyPrice) * Number(i.shares);
      acc += currentValue;

      finalList.push({
        x: index++,
        y: acc,
      });

      previousDate = new Date(i.buyDate);
    }
  }

  const lastValue = finalList[finalList.length - 1].y;
  const lastDate = new Date(
    sortedInvestments[sortedInvestments.length - 1].buyDate
  );
  const todayDay = new Date();

  const monthsBetween = getMonthsBetween(
    lastDate.getMonth(),
    lastDate.getFullYear(),
    todayDay.getMonth(),
    todayDay.getFullYear()
  );

  for (let i = 0; i < monthsBetween; i++) {
    finalList.push({
      x: index++,
      y: lastValue,
    });
  }

  return finalList;
};

export const LoadSecurityHeaderIcon = ({
  security,
  investments,
  privacyShield,
}: {
  security: SecurityEntity;
  investments: InvestmentEntity[];
  privacyShield: boolean;
}) => {
  const chartData = loadChartData(investments);
  const maxValue =
    investments.length > 0 ? Math.max(...chartData.map((inv) => inv.y)) : 0;
  const minValue =
    investments.length > 0 ? Math.min(...chartData.map((inv) => inv.y)) : 0;

  return (
    <View
      key={security.name}
      style={{
        flex: 1,
        padding: 5,
      }}
    >
      <View style={{ position: "absolute", left: 0, top: 0 }}>
        <Text style={{ color: dark.textPrimary, fontSize: 12 }}>
          {security.ticker}
        </Text>
        <BlurText
          text={
            <Text style={{ color: dark.textPrimary }}>
              <Text style={{ fontSize: 8 }}>
                {investments
                  .reduce(
                    (sum, inv) =>
                      sum + Number(inv.buyPrice) * Number(inv.shares),
                    0
                  )
                  .toFixed(0)}
              </Text>
              <Text style={{ fontSize: 6 }}>{`€`}</Text>
            </Text>
          }
          privacyShield={privacyShield}
          style={undefined}
        />
      </View>
      <VictoryChart
        height={verticalScale(50)} // Adjust this value to control the chart's height
        width={verticalScale(50)} // Adjust this value to control the chart's width
        domain={{
          y: [minValue * 0.99, maxValue + ((maxValue - minValue) * 20) / 100],
        }} // Set the Y-axis domain
        padding={verticalScale(2)}
      >
        <VictoryAxis
          tickLabelComponent={<View></View>} // Remove tick labels
          style={axisStyle}
        />
        <VictoryAxis
          style={axisStyle}
          tickLabelComponent={<View></View>} // Remove tick labels
        />
        <VictoryLine
          style={{
            data: {
              stroke: utilsColors.green50,
              strokeWidth: 2,
            }, // Set the stroke color to green
          }}
          data={chartData}
          interpolation="basis"
        />
      </VictoryChart>
    </View>
  );
};

export const LoadSecurityIcon = ({ ticker }) => (
  <View style={styles.securityIconContainer}>
    <Text style={{ color: dark.textPrimary, textAlign: "center" }}>
      {ticker || ""}
    </Text>
  </View>
);

export const nameComponent = (item: InvestmentEntity) => (
  <View style={{ alignItems: "flex-start" }}>
    <Text style={styles.normalText}>{item?.security?.name}</Text>
    <Text style={styles.smallText}>
      {`${item.buyPrice} `}
      <Text style={styles.symbolText}>{`€`}</Text>
    </Text>
  </View>
);

export const valueComponent = (item: InvestmentEntity) => (
  <TradeItem
    cost={Number(item.buyPrice) * Number(item.shares)}
    shares={item.shares}
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
