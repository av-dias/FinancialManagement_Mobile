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
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";

export default function Stats({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");

  const [purchaseTotalByDate, setPurchaseTotalByDate] = useState({ currentYear: [{ x: "Jan", y: 0 }], lastYear: [{ x: "Jan", y: 0 }] });
  const [spendByType, setSpendByType] = useState([{ x: "Supermarket", y: 0 }]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("Fetching data...");
        let email = await getUser();
        setEmail(email);

        let auxCurrentPurchaseTotal = {},
          auxPreviousPurchaseTotal = {},
          auxSpendByType = {};

        for (let type of Object.values(STATS_TYPE)) {
          // Current Month Data
          let resPurchaseStats = await getPurchaseStats(email, currentYear, type).catch((error) => console.log(error));
          auxSpendByType[type] = resPurchaseStats;

          let resCurrentPurchaseTotal = await getPurchaseTotal(email, currentYear, type).catch((error) => console.log(error));
          auxCurrentPurchaseTotal[type] = resCurrentPurchaseTotal;

          let resPreviousPurchaseTotal = await getPurchaseTotal(email, currentYear - 1, type).catch((error) => console.log(error));
          auxPreviousPurchaseTotal[type] = resPreviousPurchaseTotal;
        }

        let auxPurchaseTotalByDate = { currentYear: [], lastYear: [] };
        let auxPurchaseSpendByType = [];
        let value = [];

        for (let date of Object.keys(auxCurrentPurchaseTotal[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxCurrentPurchaseTotal[STATS_TYPE[0]][date]);
          let purchasePersonal = parseFloat(auxCurrentPurchaseTotal[STATS_TYPE[1]][date]);
          auxPurchaseTotalByDate["currentYear"].push({ x: months[date], y: purchaseTotal - purchasePersonal });
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

        for (let type of Object.keys(auxSpendByType[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxSpendByType[STATS_TYPE[0]][type]);
          let purchasePersonal = parseFloat(auxSpendByType[STATS_TYPE[1]][type]);
          auxPurchaseSpendByType.push({ x: type, y: purchaseTotal + purchasePersonal });
        }

        setPurchaseTotalByDate({ currentYear: auxPurchaseTotalByDate["currentYear"], lastYear: value });
        setSpendByType(auxPurchaseSpendByType);
      }
      fetchData();
    }, [currentYear])
  );

  const getMaxArrayObject = (arr, offset) => {
    let max = arr.reduce((acc, value) => {
      if (value.y > acc) {
        return value.y;
      }
      return acc;
    }, 0);

    return max + offset;
  };

  const getSumArrayObject = (arr) => {
    if (!arr || arr.length == 0) return 0;
    return arr.reduce((acc, value) => acc + parseFloat(value.y), 0);
  };

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: verticalScale(10) }}>
          <View style={{ alignSelf: "center", flexDirection: "row", gap: 10 }}>
            <TypeCard setItem={setCurrentYear} itemList={[2024, 2023]} />
            <CardWrapper style={{ width: verticalScale(100), alignItems: "center" }}>
              <Text>Split: {getSumArrayObject(purchaseTotalByDate["currentYear"])}€</Text>
            </CardWrapper>
          </View>
          <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
            <View style={styles.chart}>
              <View style={{ position: "absolute" }}>
                <VictoryLine
                  domain={{ x: [0, 13], y: [-40, getMaxArrayObject(purchaseTotalByDate["currentYear"], 200)] }}
                  padding={20}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  categories={{ x: months }}
                  data={purchaseTotalByDate["currentYear"]}
                  interpolation="natural"
                  labels={({ datum }) => datum.x + "\n" + datum.y + "€"}
                />
              </View>
              {purchaseTotalByDate["lastYear"].length != 0 && (
                <View style={{ position: "absolute" }}>
                  <VictoryScatter
                    style={{ data: { fill: "blue" }, labels: { fontSize: 8 } }}
                    size={3}
                    categories={{ x: months }}
                    data={purchaseTotalByDate["lastYear"]}
                    labels={({ datum }) => datum.x + "\n" + datum.y + "€"}
                  />
                </View>
              )}
            </View>
          </CardWrapper>
          <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
            <View style={styles.chart}>
              <VictoryBar
                horizontal
                cornerRadius={{ top: 5 }}
                domain={{ y: [-40, getMaxArrayObject(spendByType, 2000)] }}
                domainPadding={20}
                padding={30}
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={spendByType}
                interpolation="natural"
                labels={({ datum }) => datum.y + "€\n" + datum.x}
              />
            </View>
          </CardWrapper>
        </View>
      </View>
    </LinearGradient>
  );
}
