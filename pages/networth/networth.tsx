import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { useContext, useState } from "react";
import { UserContext } from "../../store/user-context";
import { _styles } from "./style";
import { FlatItem } from "../../components/flatItem/flatItem";
import { MainCard } from "./components/mainCard";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import { IconButton } from "../../components/iconButton/IconButton";
import ModalCustom from "../../components/modal/modal";
import { AddForm } from "./components/addForm";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useDatabaseConnection } from "../../store/database-context";
import { PortfolioWithItemEntity } from "../../store/database/Portfolio/PortfolioEntity";
import { PortfolioDAO } from "../../models/portfolio.models";
import CalendarCard from "../../components/calendarCard/calendarCard";
import { PortfolioService } from "../../service/PortfolioService";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import { AlertData } from "../../constants/listConstants/deleteDialog";
import { NetworthAlertData } from "../../constants/networthConstants/networthDeleteDialog";
import { PortfolioItemEntity } from "../../store/database/PortfolioItem/PortfolioItemEntity";
import { logTimeTook } from "../../utility/logger";
import { loadPortfolioAnalyses, loadWorthData } from "../../functions/networth";

type PortfolioStatusType = {
  networth: { absolute: number; relative: number };
  grossworth: { absolute: number; relative: number };
};

export default function Networth({ navigation }) {
  const email = useContext(UserContext).email;
  const { portfolioRepository } = useDatabaseConnection();
  const portfolioService = new PortfolioService();

  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [items, setItems] = useState<PortfolioDAO[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioWithItemEntity[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState({
    networth: 0,
    grossworth: 0,
  });
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatusType>({
    networth: { absolute: 0, relative: 0 },
    grossworth: { absolute: 0, relative: 0 },
  });
  const [worthData, setWorthData] = useState({ grossworth: [], networth: [] });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioDAO>();

  const onSubmiteCallback = () => {
    setModalVisible(false);
  };

  const onAddPressCallback = () => {
    setModalVisible(true);
  };

  const onTradePressCallback = () => {
    navigation.navigate("Trade");
  };

  const deleteQuery = async ({ name, value }) => {
    await portfolioService.deletePortfolioItem(
      email,
      name,
      value,
      currentMonth,
      currentYear
    );
  };

  /* Loads the dialog data when list item is pressed */
  const getModalDialogData = (data: PortfolioDAO): AlertData => {
    return NetworthAlertData(data.name, data.value, async () => {
      await deleteQuery({ name: data.name, value: data.value });
      setTriggerRefresh((prev) => !prev);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            // TODO: Remove repository and use service instead
            const distinctPortfolioNames =
              await portfolioRepository.getDistinctPortfolioNames(email);
            setItems(distinctPortfolioNames);

            const nearestPortfolioItems =
              await portfolioService.getNearestPortfolioItem(
                email,
                currentMonth,
                currentYear
              );
            const lastMonthNearestPortfolioItems =
              await portfolioService.getNearestPortfolioItem(
                email,
                currentMonth - 1,
                currentYear
              );
            const { currWorth, prevWorth } = loadWorthData(
              nearestPortfolioItems,
              lastMonthNearestPortfolioItems
            );
            setPortfolioWorth(currWorth);
            const worthStats = loadPortfolioAnalyses(currWorth, prevWorth);
            setPortfolioStatus(worthStats);
            setPortfolio(nearestPortfolioItems);

            const worthGroupedByMonth =
              await portfolioService.getWorthGroupedByMonth(
                email,
                currentMonth,
                currentYear
              );
            setWorthData(worthGroupedByMonth);
          }
        } catch (e) {
          console.log("Networth: " + e);
        }
      }
      if (portfolioService.isReady()) {
        let startTime = performance.now();
        fetchData();
        let endTime = performance.now();
        logTimeTook("Networth", "Fetch", endTime, startTime);
      }
    }, [
      email,
      modalVisible,
      currentMonth,
      currentYear,
      triggerRefresh,
      portfolioRepository,
      portfolioService.isReady(),
    ])
  );

  const isItemMonthYear = (item: PortfolioItemEntity) => {
    return (
      item.value !== 0 && item.month == currentMonth && item.year == currentYear
    );
  };

  const loadOptions = (p: PortfolioWithItemEntity) => {
    return (
      <View style={styles.rowGap}>
        {isItemMonthYear(p.item) && (
          <Ionicons name="add-circle" size={20} color="lightgray" />
        )}
        <FontAwesome5
          name="money-check"
          size={20}
          color={p.grossworthFlag ? dark.secundary : "gray"}
        />
        <FontAwesome5
          name="money-check-alt"
          size={20}
          color={p.networthFlag ? "lightblue" : "gray"}
        />
      </View>
    );
  };

  const loadModalDialog = (data: PortfolioDAO) => {
    setAlertVisible(true);
    setSelectedItem(data);
  };

  /*
   * Networth and Grossworth switch should be global to type
   * and should not vary by date
   *
   * Makes everything consisten on load functions
   * return value and only then set data
   */
  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {modalVisible && (
          <ModalCustom
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            size={15}
            hasColor={true}
          >
            <AddForm items={items} onSubmit={onSubmiteCallback} email={email} />
          </ModalCustom>
        )}
        {alertVisible && (
          <ModalDialog
            visible={alertVisible}
            setVisible={setAlertVisible}
            size={2.5}
            data={getModalDialogData(selectedItem)}
          />
        )}
        <View style={styles.mainContainer}>
          <MainCard
            key={"MainCardGrossWorth"}
            value={portfolioWorth.grossworth.toFixed(0)}
            absoluteIncrease={portfolioStatus.grossworth.absolute.toFixed(0)}
            relativeIncrease={portfolioStatus.grossworth.relative.toFixed(0)}
            title={"Grossworth"}
            icon={
              <FontAwesome5
                name="money-check"
                size={15}
                color={dark.secundary}
              />
            }
            data={worthData.grossworth}
            onPress={() => navigation.navigate("NetworthStats")}
          />
          <MainCard
            key={"MainCardNetWorth"}
            value={portfolioWorth.networth.toFixed(0)}
            absoluteIncrease={portfolioStatus.networth.absolute.toFixed(0)}
            relativeIncrease={portfolioStatus.networth.relative.toFixed(0)}
            title={"Networth"}
            icon={
              <FontAwesome5
                name="money-check-alt"
                size={15}
                color="lightblue"
              />
            }
            data={worthData.networth}
            onPress={() => navigation.navigate("NetworthStats")}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 5 }}>
          <View style={styles.dividerContainer}>
            <CustomTitle
              title="Portefolio"
              icon={<FontAwesome name="book" size={24} color="white" />}
            />

            <View style={styles.rowGap}>
              <CalendarCard
                monthState={[currentMonth, setCurrentMonth]}
                yearState={[currentYear, setCurrentYear]}
              />
              <IconButton
                addStyle={{ borderRadius: 12, justifyContent: "center" }}
                icon={
                  <Entypo
                    style={styles.iconButton}
                    name="add-to-list"
                    size={20}
                    color={"white"}
                  />
                }
                onPressHandle={onAddPressCallback}
              />
              <IconButton
                addStyle={{ borderRadius: 12, justifyContent: "center" }}
                icon={
                  <Ionicons
                    style={styles.iconButton}
                    name="analytics-outline"
                    size={20}
                    color="white"
                  />
                }
                onPressHandle={onTradePressCallback}
              />
            </View>
          </View>
          {/*
           * Fix Item giving its date to allow delete
           */}
          <ScrollView contentContainerStyle={{ gap: 5 }}>
            {portfolio?.map((p) => (
              <FlatItem
                key={p.name}
                name={p.name}
                value={p.item.value}
                options={loadOptions(p)}
                onPressCallback={
                  isItemMonthYear(p.item) ? loadModalDialog : undefined
                }
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
