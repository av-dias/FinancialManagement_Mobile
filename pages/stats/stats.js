import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { VictoryChart, VictoryLine, VictoryBar, VictoryScatter } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Custom Components
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import TypeCard from "../../components/typeCard/typeCard";

//Custom Constants
import { _styles } from "./style";
import { STATS_TYPE, STATS_MODE } from "../../utility/keys";
import { months } from "../../utility/calendar";
//Functions
import { getPurchaseStats, getPurchaseTotal } from "../../functions/purchase";
import { heightTreshold, horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { getTransactions, getTransactionStats, getTransactionTotalReceived, getTransactionTotalSent } from "../../functions/transaction";

export default function Stats({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");

  const [purchaseTotalByDate, setPurchaseTotalByDate] = useState({ currentYear: [{ x: "Jan", y: 0 }], lastYear: [{ x: "Jan", y: 0 }] });
  const [spendByType, setSpendByType] = useState([{ x: "Supermarket", y: 0 }]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [transactionsTotalReceived, setTransactionsTotalReceived] = useState({
    Received: [{ x: "Jan", y: 0 }],
    Sent: [{ x: "Jan", y: 0 }],
    Total: [{ x: "Jan", y: 0 }],
  });

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("Fetching data...");
        let email = await getUser();
        setEmail(email);
        let transactions = await getTransactions(email);

        let auxCurrentPurchaseTotal = {},
          auxPreviousPurchaseTotal = {},
          auxSpendByType = {},
          resTransationStats,
          resTransationTotal,
          resTransationTotalSent;

        for (let type of Object.values(STATS_TYPE)) {
          // Current Year Spend by Type
          let resPurchaseStats = await getPurchaseStats(email, currentYear, type).catch((error) => console.log(error));
          auxSpendByType[type] = resPurchaseStats;

          // Current Year Total Purchases
          let resCurrentPurchaseTotal = await getPurchaseTotal(email, currentYear, type).catch((error) => console.log(error));
          auxCurrentPurchaseTotal[type] = resCurrentPurchaseTotal;

          // Previous Year Total Purchase
          let resPreviousPurchaseTotal = await getPurchaseTotal(email, currentYear - 1, type).catch((error) => console.log(error));
          auxPreviousPurchaseTotal[type] = resPreviousPurchaseTotal;
        }

        if (Object.keys(auxSpendByType["Personal"]).length == 0 || Object.keys(auxSpendByType["Total"]).length == 0) return;

        // Reconcile values with transactions
        resTransationTotal = await getTransactionTotalReceived(transactions, currentYear);
        resTransationTotalSent = await getTransactionTotalSent(transactions, currentYear);
        resTransationStats = await getTransactionStats(transactions, currentYear);

        let auxPurchaseTotalByDate = { currentYear: [], lastYear: [] };
        let auxPurchaseSpendByType = [];
        let value = [];
        let transactionTotal;

        for (let date of Object.keys(auxCurrentPurchaseTotal[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxCurrentPurchaseTotal[STATS_TYPE[0]][date]);
          let purchasePersonal = parseFloat(auxCurrentPurchaseTotal[STATS_TYPE[1]][date]);

          // Reconcile values with transactions
          if (resTransationTotal.hasOwnProperty(date)) transactionTotal = parseFloat(resTransationTotal[date]);
          else transactionTotal = 0;

          auxPurchaseTotalByDate["currentYear"].push({ x: months[date], y: purchaseTotal - purchasePersonal + transactionTotal });
        }

        if (auxPreviousPurchaseTotal[STATS_TYPE[0]] != {}) {
          for (let date of Object.keys(auxPreviousPurchaseTotal[STATS_TYPE[0]])) {
            let purchaseTotal = parseFloat(auxPreviousPurchaseTotal[STATS_TYPE[0]][date]);
            let purchasePersonal = parseFloat(auxPreviousPurchaseTotal[STATS_TYPE[1]][date]);
            auxPurchaseTotalByDate["lastYear"].push({ x: months[date], y: purchaseTotal - purchasePersonal });
          }

          value = auxPurchaseTotalByDate["lastYear"].filter(
            (value) => !auxPurchaseTotalByDate["currentYear"].map((currentYear) => currentYear.x).includes(value.x)
          );
        }

        // Reconcile values with transactions
        for (let tType of Object.keys(resTransationStats)) {
          auxSpendByType[STATS_TYPE[0]][tType] = (auxSpendByType[STATS_TYPE[0]][tType] || 0) + resTransationStats[tType];
        }

        for (let type of Object.keys(auxSpendByType[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxSpendByType[STATS_TYPE[0]][type]);

          auxPurchaseSpendByType.push({ x: type, y: purchaseTotal });
        }

        let auxReceived = [],
          auxSent = [],
          auxTotal = [];

        for (let month of Object.keys(resTransationTotal)) {
          let purchaseTotal = parseFloat(resTransationTotal[month]);

          //auxTotal.push({ x: months[month], y: purchaseTotal });
          auxReceived.push({ x: months[month], y: purchaseTotal });
        }

        for (let month of Object.keys(resTransationTotalSent)) {
          let purchaseTotal = parseFloat(resTransationTotalSent[month]);

          auxSent.push({ x: months[month], y: purchaseTotal });
        }

        for (let month of months) {
          let received = findKeyJsonArray(auxReceived, month);
          let sent = findKeyJsonArray(auxSent, month);

          if (received.length > 0 || sent.length > 0) {
            if (received.length == 0) received = [{ y: 0 }];
            if (sent.length == 0) sent = [{ y: 0 }];

            auxTotal.push({ x: month, y: -(received[0].y + sent[0].y) });
          }
        }

        setTransactionsTotalReceived({ Received: auxReceived, Sent: auxSent, Total: auxTotal });

        setPurchaseTotalByDate({ currentYear: auxPurchaseTotalByDate["currentYear"], lastYear: value });
        setSpendByType(auxPurchaseSpendByType);
      }
      fetchData();
    }, [currentYear])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function checkTransaction() {
        if (transactionsTotalReceived["Total"].length == 1) {
          let indexMonth = months.findIndex((str, index) => {
            if (str === transactionsTotalReceived["Total"][0].x) {
              return index;
            }
          });

          if (indexMonth == 0) {
            indexMonth = 1;
          } else if (indexMonth == 11) {
            indexMonth = 10;
          } else {
            indexMonth--;
          }

          transactionsTotalReceived["Total"].push({ x: months[indexMonth], y: 0 });
        }
      }

      checkTransaction();
    }, [transactionsTotalReceived])
  );

  const calculateArrayVariation = (arr) => {
    let maxArray = arr.sort(function (a, b) {
      return b.y - a.y;
    });

    let variation = Math.abs(maxArray[0].y - maxArray[maxArray.length - 1].y);
    return variation;
  };

  const getMaxArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;
    let maxArray = arr.sort(function (a, b) {
      return b.y - a.y;
    });

    let max = maxArray[0].y;

    return max + calculateArrayVariation(arr) * 0.6;
  };

  const getMinArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;

    let minArray = arr.sort(function (a, b) {
      return a.y - b.y;
    });

    let min = minArray[0].y;

    return min - calculateArrayVariation(arr) * 0.3;
  };

  const getSumArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;
    return arr.reduce((acc, value) => acc + parseFloat(value.y), 0);
  };

  const findKeyJsonArray = (arr, value) => {
    let found = arr.filter((data) => {
      return data.x == value;
    });
    return found;
  };

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ alignSelf: "center", flexDirection: "row", paddingBottom: 10, gap: 10 }}>
          <TypeCard setItem={setCurrentYear} itemList={[2024, 2023]} />
          <CardWrapper style={{ width: verticalScale(100), alignItems: "center" }}>
            <Text>Split: {getSumArrayObject(purchaseTotalByDate["currentYear"]).toFixed(0)}€</Text>
          </CardWrapper>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={false} contentContainerStyle={{ flexGrow: 1, gap: verticalScale(10) }}>
            <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
              <View style={styles.chart}>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text>Total Purchase by Month</Text>
                </View>
                <VictoryLine
                  domain={{
                    x: [0, 13],
                    y: [getMinArrayObject(purchaseTotalByDate["currentYear"]), getMaxArrayObject(purchaseTotalByDate["currentYear"])],
                  }}
                  padding={{ left: 20 }}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  categories={{ x: months }}
                  data={purchaseTotalByDate["currentYear"]}
                  interpolation="natural"
                  labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                />
                {purchaseTotalByDate["lastYear"].length != 0 && (
                  <View style={{ position: "absolute" }}>
                    <VictoryLine
                      domain={{
                        x: [0, 13],
                        y: [getMinArrayObject(purchaseTotalByDate["lastYear"]), getMaxArrayObject(purchaseTotalByDate["lastYear"])],
                      }}
                      padding={{ left: 20 }}
                      style={{
                        data: { stroke: "blue" },
                        parent: { border: "1px solid #ccc" },
                      }}
                      categories={{ x: months }}
                      data={purchaseTotalByDate["lastYear"]}
                      interpolation="natural"
                      labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                    />
                  </View>
                )}
              </View>
            </CardWrapper>
            <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
              <View style={styles.chart}>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text>Total Purchase by Type</Text>
                </View>
                <VictoryBar
                  horizontal
                  cornerRadius={{ top: 5 }}
                  domain={{ y: [-40, getMaxArrayObject(spendByType)] }}
                  domainPadding={20}
                  padding={30}
                  style={{
                    data: { stroke: "#c43a31" },
                    labels: { fontSize: 8 },
                    parent: { border: "1px solid #ccc" },
                  }}
                  data={spendByType}
                  interpolation="natural"
                  labels={({ datum }) => datum.x + " " + datum.y.toFixed(0) + "€"}
                />
              </View>
            </CardWrapper>
            <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20, elevation: 0 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }}>Months</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", color: "darkred" }}>Sent</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold", color: "darkgreen" }}>Received</Text>
                </View>
              </View>
              <View style={styles.chart}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {months.map((month, i) => (
                      <Text style={{ color: i % 2 ? "black" : "gray" }} key={"M" + month}>
                        {month}
                      </Text>
                    ))}
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {months.map((month, i) => {
                      let itemSent = findKeyJsonArray(transactionsTotalReceived["Sent"], month);
                      if (itemSent.length > 0)
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            {-itemSent[0].y}
                          </Text>
                        );
                      else
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            0
                          </Text>
                        );
                    })}
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {months.map((month, i) => {
                      let itemReceived = findKeyJsonArray(transactionsTotalReceived["Received"], month);
                      if (itemReceived.length > 0)
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            {-itemReceived[0].y}
                          </Text>
                        );
                      else
                        return (
                          <Text key={"R" + month} style={{ color: i % 2 ? "black" : "gray" }}>
                            0
                          </Text>
                        );
                    })}
                  </View>
                </View>
              </View>
            </CardWrapper>
            <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
              <View style={styles.chart}>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text>Total Transaction by Month</Text>
                </View>
                <VictoryLine
                  domain={{
                    x: [0, 13],
                    y: [getMinArrayObject(transactionsTotalReceived["Total"]), getMaxArrayObject(transactionsTotalReceived["Total"])],
                  }}
                  padding={{ left: 20 }}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  categories={{ x: months }}
                  data={transactionsTotalReceived["Total"]}
                  interpolation="natural"
                  labels={({ datum }) => datum.x + "\n" + datum.y.toFixed(0) + "€"}
                />
              </View>
            </CardWrapper>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
