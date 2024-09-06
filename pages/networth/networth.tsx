import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Table, TableWrapper, Cell, Row, Rows, Col } from "react-native-table-component";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { _styles } from "./style";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { FlatItem } from "../../components/flatItem/flatItem";
import { MainCard } from "./components/mainCard";
import commonStyles from "../../utility/commonStyles";

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const styles = _styles;

  const state = {
    tableHead: ["", "Bond", "TR", "Invest", "AIB", "Rev", "Crypt", "Caution", "Aon"],
    tableTitle: ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tableData: [
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
      ["2000", "10000", "2000", "20000", "100", "400", "1000", "4000"],
    ],
  };

  const styles_ = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
    head: { height: 40, backgroundColor: "gray", borderRadius: 4, textAlign: "right" },
    wrapper: { flexDirection: "row" },
    title: { flex: 1 },
    row: { height: 25 },
    text: { textAlign: "center", color: dark.textPrimary },
  });

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ gap: 20, padding: 10 }}>
          <MainCard
            value={"42000"}
            absoluteIncrease={"500€"}
            relativeIncrease={"15%"}
            title={"Grossworth"}
            icon={<FontAwesome5 name="money-check" size={24} color="orange" />}
          />
          <MainCard
            value={"36000"}
            absoluteIncrease={"200€"}
            relativeIncrease={"5%"}
            title={"Networth"}
            icon={<FontAwesome5 name="money-check-alt" size={24} color="lightblue" />}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 10 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, paddingBottom: 0, paddingRight: 0 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="book" size={24} color="white" />
              <Text style={_styles.textTitle}>Portefolio</Text>
            </View>
            <Pressable style={_styles.iconButton} onPress={() => alert("Show")}>
              <Entypo name="add-to-list" size={20} color={"white"} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {[
              { name: "Bond", value: 2000 },
              { name: "TR Cash", value: 11000 },
              { name: "TR Wealth", value: 2000 },
              { name: "AIB", value: 2000 },
              { name: "REV", value: 11000 },
              { name: "Caution", value: 2000 },
              { name: "Crypto", value: 2000 },
              { name: "Aon", value: 11000 },
            ].map((item) => (
              <FlatItem key={item.name} name={item.name} value={item.value} />
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
