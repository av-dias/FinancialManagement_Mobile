import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { VictoryChart, VictoryLine, VictoryBar, VictoryAxis } from "victory-native";
import { LinearGradient } from "expo-linear-gradient";

//Custom Components
import Header from "../../components/header/header";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

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

  const [spendByType, setSpendByType] = useState({ [STATS_TYPE[0]]: [[""]] });
  const [purchaseTotalByDate, setPurchaseTotalByDate] = useState([{ x: "Jan", y: 0 }]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        console.log("Fetching data...");
        let email = await getUser();
        setEmail(email);

        let auxPurchaseTotal = {},
          auxSpendByType = {};

        let currentYear = 2024;

        for (let type of Object.values(STATS_TYPE)) {
          // Current Month Data
          let resPurchaseStats = await getPurchaseStats(email, currentYear, type).catch((error) => console.log(error));
          auxSpendByType[type] = resPurchaseStats;

          let resPurchaseTotal = await getPurchaseTotal(email, currentYear, type).catch((error) => console.log(error));
          auxPurchaseTotal[type] = resPurchaseTotal;
        }

        let auxPurchaseTotalByDate = [];
        let auxPurchaseSpendByType = [];

        for (let date of Object.keys(auxPurchaseTotal[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxPurchaseTotal[STATS_TYPE[0]][date]);
          let purchasePersonal = parseFloat(auxPurchaseTotal[STATS_TYPE[1]][date]);
          auxPurchaseTotalByDate.push({ x: months[date], y: purchaseTotal - purchasePersonal });
        }

        for (let type of Object.keys(auxSpendByType[STATS_TYPE[0]])) {
          let purchaseTotal = parseFloat(auxSpendByType[STATS_TYPE[0]][type]);
          let purchasePersonal = parseFloat(auxSpendByType[STATS_TYPE[1]][type]);
          auxPurchaseSpendByType.push({ x: type, y: purchaseTotal + purchasePersonal });
        }

        setPurchaseTotalByDate(auxPurchaseTotalByDate);
        setSpendByType(auxPurchaseSpendByType);
        console.log(auxPurchaseTotalByDate);
        console.log(auxPurchaseSpendByType);
      }
      fetchData();
    }, [])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: verticalScale(10) }}>
          <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
            <View style={styles.chart}>
              <VictoryLine
                domain={{ x: [0, 12], y: [-40, 1200] }}
                padding={20}
                style={{
                  data: { stroke: "#c43a31" },
                  parent: { border: "1px solid #ccc" },
                }}
                categories={{ x: months }}
                data={purchaseTotalByDate}
                interpolation="natural"
                labels={({ datum }) => datum.x + "\n" + datum.y + "€"}
              />
            </View>
          </CardWrapper>
          <CardWrapper style={{ flex: 1, justifyContent: "center", alignItems: "center", elevation: 0 }}>
            <View style={styles.chart}>
              <VictoryChart>
                <VictoryBar
                  domain={{ y: [-40, 8000] }}
                  domainPadding={20}
                  padding={20}
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc" },
                  }}
                  data={spendByType}
                  interpolation="natural"
                  labels={({ datum }) => datum.y + "€"}
                />
              </VictoryChart>
            </View>
          </CardWrapper>
        </View>
      </View>
    </LinearGradient>
  );
}
