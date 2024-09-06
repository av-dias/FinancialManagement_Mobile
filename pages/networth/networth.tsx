import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Table, TableWrapper, Cell, Row, Rows, Col } from "react-native-table-component";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { useContext, useState } from "react";
import { AppContext } from "../../store/app-context";
import { _styles } from "./style";
import { FlatItem } from "../../components/flatItem/flatItem";
import { MainCard } from "./components/mainCard";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import { IconButton } from "../../components/iconButton/IconButton";
import ModalCustom from "../../components/modal/modal";
import { AddForm } from "./components/addForm";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { getPortfolio } from "../../functions/portfolio";

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioStatus, setPortfolioStatus] = useState({ networth: 0, grossworth: 0 });

  const loadPortfolioCarrosselItems = (portfolio) => {
    let carrosselItems = [];
    if (portfolio != undefined) {
      portfolio?.map((item) => carrosselItems.push({ label: item.name, color: "black" }));
    }
    setItems(carrosselItems);
  };

  const loadPortfolioStatus = (portfolio) => {
    let networth = 0;
    portfolio.map((item) => (networth += Number(item.value)));
    setPortfolioStatus({ networth: networth, grossworth: networth });
  };

  const onSubmiteCallback = () => {
    setModalVisible(false);
  };

  const onIconPressCallback = () => {
    setModalVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const portfolio = await getPortfolio(appCtx.email);
        loadPortfolioCarrosselItems(portfolio);
        loadPortfolioStatus(portfolio);
        setPortfolio(portfolio);
        try {
        } catch (e) {
          console.log("Networth AddForm: " + e);
        }
      }
      fetchData();
    }, [appCtx.email, modalVisible])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {modalVisible && (
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={15} hasColor={true}>
            <AddForm items={items} onSubmit={onSubmiteCallback} />
          </ModalCustom>
        )}
        <View style={styles.mainContainer}>
          <MainCard
            value={portfolioStatus.networth}
            absoluteIncrease={500}
            relativeIncrease={15}
            title={"Grossworth"}
            icon={<FontAwesome5 name="money-check" size={24} color={dark.secundary} />}
          />
          <MainCard
            value={portfolioStatus.networth}
            absoluteIncrease={200}
            relativeIncrease={5}
            title={"Networth"}
            icon={<FontAwesome5 name="money-check-alt" size={24} color="lightblue" />}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 5 }}>
          <View style={styles.dividerContainer}>
            <CustomTitle title="Portefolio" icon={<FontAwesome name="book" size={24} color="white" />} />
            <IconButton icon={<Entypo name="add-to-list" size={18} color={"white"} />} onPressHandle={onIconPressCallback} />
          </View>
          <ScrollView contentContainerStyle={{ gap: 5 }}>
            {portfolio?.map((item) => (
              <FlatItem key={item.name} name={item.name} value={item.value} />
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
