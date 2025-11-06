import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";
import { useContext, useState } from "react";
import { UserContext } from "../../store/user-context";
import { styles } from "./style";
import { SecurityEntity } from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useDatabaseConnection } from "../../store/database-context";
import { logTimeTook } from "../../utility/logger";
import { IconButton } from "../../components/iconButton/IconButton";
import commonStyles from "../../utility/commonStyles";
import { BlurText } from "../../components/BlurText/BlurText";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
} from "victory-native";
import { horizontalScale } from "../../functions/responsive";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Badge } from "react-native-paper";

type InvestAggregate = {
  security: SecurityEntity;
  avgPrice: number;
  amount: number;
  shares: number;
};

const getVictoryColors = (index: number) =>
  VictoryTheme.material.pie.colorScale[index];

function fillMissingYearsInStackedBarData(data: {
  [key: string]: { x: string; y: number }[];
}) {
  // Collect all unique years from all entries
  const allYears = new Set();
  Object.values(data).forEach((series) => {
    series.forEach((item) => allYears.add(item.x));
  });

  // Sort years chronologically
  const sortedYears = Array.from(allYears).sort();

  // For each series, add missing years with y: 0 and sort
  const filledData: {} = {};
  Object.entries(data).forEach(([key, series]) => {
    const filledSeries = sortedYears.map((year) => {
      const found = series.find((item) => item.x === year);
      return found ? found : { x: year, y: 0 };
    });
    filledData[key] = filledSeries;
  });

  return filledData;
}

export default function Invest({ navigation }) {
  const email = useContext(UserContext).email;

  const { privacyShield } = useContext(UserContext).privacyShield;
  const { investmentRepository } = useDatabaseConnection();
  const [investments, setInvestments] = useState<InvestAggregate[]>([]);
  const [investmentsByYear, setInvestmentsByYear] = useState<{
    [key: string]: any;
  }>({});
  const [total, setTotal] = useState(0);
  const [chart, setChart] = useState(true);
  const [colorPalette, setColorPalette] = useState<{ [key: string]: string }>(
    {}
  );

  const onTradePressCallback = () => {
    navigation.navigate("Trade");
  };
  const onNetworthPressCallback = () => {
    navigation.navigate("Networth");
  };

  const onPressHandle = () => {
    setChart((p) => !p);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            try {
              // aggregate by security with average price and total amount
              let listInvestment = await investmentRepository.getAll(email);
              let totalInvest = 0,
                index = 0;
              let aggregatedInvestments = listInvestment.reduce((acc, item) => {
                if (!acc[item.security.name]) {
                  acc[item.security.name] = {
                    security: item.security,
                    avgPrice: 0,
                    amount: 0,
                    shares: 0,
                  } as InvestAggregate;
                }
                acc[item.security.name].avgPrice += item.buyPrice * item.shares;
                acc[item.security.name].amount += item.buyPrice * item.shares;
                acc[item.security.name].shares += item.shares;
                totalInvest += item.buyPrice * item.shares;
                return acc;
              }, {});

              let colorPalette = {};
              Object.keys(aggregatedInvestments).forEach((key, index) => {
                colorPalette[key] = getVictoryColors(index);
              });

              setColorPalette(colorPalette);

              let aggregatedByname = listInvestment.reduce((acc, item) => {
                const name = item.security.name;
                const year = new Date(item.buyDate).getFullYear();

                if (!acc[name]) {
                  acc[name] = {};
                }

                if (!acc[name][year]) {
                  acc[name][year] = {
                    amount: 0,
                  };
                }

                acc[name][year].amount += item.buyPrice * item.shares;

                return acc;
              }, {});

              const stackedBarData = Object.fromEntries(
                Object.entries(aggregatedByname).map(([name, data]) => {
                  const entries = Object.entries(data).map(
                    ([year, values]) => ({
                      x: year,
                      y: values.amount,
                    })
                  );
                  return [name, entries];
                })
              );

              for (const investment in aggregatedInvestments) {
                aggregatedInvestments[investment].avgPrice /=
                  aggregatedInvestments[investment].shares;
              }

              setTotal(totalInvest);
              setInvestments(
                (
                  Object.values(aggregatedInvestments) as InvestAggregate[]
                ).sort((a, b) => b.amount - a.amount)
              );
              setInvestmentsByYear(
                fillMissingYearsInStackedBarData(stackedBarData)
              );
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.log("Invest: " + e);
        }
      }
      if (investmentRepository.isReady()) {
        let startTime = performance.now();
        fetchData();
        let endTime = performance.now();
        logTimeTook("Invest", "Fetch", endTime, startTime);
      }
    }, [email, investmentRepository])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={{ ...commonStyles.usableScreen, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            addStyle={{
              alignItems: "center",
              width: 40,
              borderRadius: 12,
              padding: 10,
              backgroundColor: dark.blueAccent,
            }}
            icon={<Text style={{ color: dark.textPrimary }}>{"<"}</Text>}
            onPressHandle={onNetworthPressCallback}
          />
          <IconButton
            addStyle={{
              alignItems: "center",
              width: 70,
              borderRadius: 12,
              padding: 10,
              backgroundColor: dark.blueAccent,
            }}
            icon={<Text style={{ color: dark.textPrimary }}>Trades</Text>}
            onPressHandle={onTradePressCallback}
          />
        </View>
        <View>
          <Pressable
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: dark.glass,
              padding: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
              marginBottom: 10,
              zIndex: 10,
            }}
            onPress={onPressHandle}
          >
            <Text style={{ color: dark.textPrimary }}>{">"}</Text>
          </Pressable>
          {chart ? (
            <View
              style={{
                height: horizontalScale(200),
                backgroundColor: dark.glass,
                borderRadius: 10,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <VictoryPie
                height={horizontalScale(150)}
                innerRadius={horizontalScale(50)}
                padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                width={horizontalScale(150)}
                data={Object.values(investments).map((inv) => ({
                  x: inv.security.ticker,
                  y: inv.amount,
                  color: colorPalette[inv.security.name],
                }))}
                style={{
                  data: {
                    fill: ({ datum }) => datum.color,
                  },
                }}
                labelComponent={null}
              />
              <ScrollView
                horizontal={false}
                contentContainerStyle={{
                  height: "100%",
                  padding: 20,
                  justifyContent: "center",
                }}
              >
                {investments &&
                  investments.map((i) => (
                    <View
                      key={i.security.name}
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <Badge
                          size={10}
                          style={{
                            backgroundColor: colorPalette[i.security.name],
                            alignSelf: "center",
                          }}
                        />
                        <Text style={{ color: dark.textPrimary }}>
                          {`${i.security.name}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <BlurText
                          text={
                            <Text>
                              <Text
                                style={{ color: dark.textPrimary }}
                              >{`${i.amount.toFixed(0)}`}</Text>
                              <Text
                                style={{
                                  color: dark.textPrimary,
                                  fontSize: commonStyles.symbolSize,
                                }}
                              >{`€`}</Text>
                            </Text>
                          }
                          privacyShield={privacyShield}
                          style={undefined}
                        />
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                height: horizontalScale(200),
                backgroundColor: dark.glass,
                borderRadius: 10,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={{ color: dark.textPrimary }}>
                  Investment Distribution
                </Text>
              </View>
              <VictoryChart
                height={horizontalScale(220)}
                width={horizontalScale(350)}
                domainPadding={{ y: [0, 20] }}
              >
                <VictoryAxis
                  dependentAxis={false}
                  style={{
                    axis: { stroke: "transparent" }, // Axis line color
                    ticks: { stroke: "transparent" }, // Tick marks color
                    tickLabels: { fill: dark.textPrimary, fontSize: 12 }, // Tick label color
                  }}
                />
                <VictoryStack>
                  {investmentsByYear &&
                    Object.keys(investmentsByYear).map((name, index) => {
                      const data = investmentsByYear[name];
                      return (
                        <VictoryBar
                          key={index}
                          barWidth={30}
                          style={{
                            data: { width: 20, fill: colorPalette[name] },
                          }}
                          cornerRadius={2}
                          data={data}
                          labels={({ datum }) =>
                            datum.y > 0 ? `${datum.y.toFixed(0)}€` : ""
                          }
                          labelComponent={
                            <VictoryLabel
                              // Optionally, you can pass a function to dynamically set dy based on datum
                              dy={({ datum }) => (datum.y > 150 ? 8 : -5)}
                              textAnchor="middle"
                              style={{ fontSize: 8, fill: "gray" }}
                            />
                          }
                        />
                      );
                    })}
                </VictoryStack>
              </VictoryChart>
            </View>
          )}
        </View>
        <View>
          <ScrollView
            contentContainerStyle={{
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {investments.map((inv: InvestAggregate) => (
              <View
                key={inv.security.name}
                style={{
                  padding: 10,
                  width: "48%",
                  aspectRatio: 1,
                  backgroundColor: dark.glass,
                  borderRadius: commonStyles.borderRadius,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: colorPalette[inv.security.name],
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "black" }}>
                      {inv.security.ticker}
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      borderRadius: commonStyles.borderRadius,
                    }}
                  >
                    <Text>
                      <Text
                        style={{
                          color: dark.textPrimary,
                        }}
                      >
                        {((inv.amount / total) * 100).toFixed(0)}
                      </Text>
                      <Text
                        style={{
                          color: dark.textPrimary,
                          fontSize: commonStyles.symbolSize,
                        }}
                      >
                        {`%`}
                      </Text>
                    </Text>
                  </View>
                </View>
                {/* Content */}
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    gap: 5,
                    justifyContent: "flex-end",
                  }}
                >
                  <BlurText
                    text={
                      <Text>
                        <Text
                          style={{
                            color: dark.textPrimary,
                            fontSize: commonStyles.textSizeLarge,
                            fontWeight: "bold",
                          }}
                        >
                          {inv.amount.toFixed(0)}
                        </Text>
                        <Text
                          style={{
                            color: dark.textPrimary,
                            fontSize: commonStyles.symbolSize,
                            fontWeight: "bold",
                          }}
                        >
                          {`€`}
                        </Text>
                      </Text>
                    }
                    privacyShield={privacyShield}
                    style={undefined}
                  />
                  <View>
                    <Text>
                      <View>
                        <Text
                          style={{
                            color: dark.textPrimary,
                          }}
                        >{`Shares: `}</Text>
                      </View>
                      <BlurText
                        text={
                          <Text
                            style={{
                              color: dark.textPrimary,
                            }}
                          >{`${inv.shares.toFixed(3)}`}</Text>
                        }
                        privacyShield={privacyShield}
                        style={undefined}
                      />
                    </Text>
                    <Text>
                      <View>
                        <Text
                          style={{
                            color: dark.textPrimary,
                          }}
                        >{`Average: `}</Text>
                      </View>
                      <BlurText
                        text={
                          <Text
                            style={{
                              color: dark.textPrimary,
                            }}
                          >{`${inv.avgPrice.toFixed(3)}`}</Text>
                        }
                        privacyShield={privacyShield}
                        style={undefined}
                      />
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
