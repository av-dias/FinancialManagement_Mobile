import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
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
import { useDatabaseConnection } from "../../store/database-context";
import { PortfolioModel } from "../../store/database/Portfolio/PortfolioEntity";
import { PortfolioDAO } from "../../models/portfolio.models";
import CalendarCard from "../../components/calendarCard/calendarCard";
import { PortfolioService } from "../../store/database/Portfolio/PortfolioService";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import { AlertData } from "../../constants/listConstants/deleteDialog";
import { NetworthAlertData } from "../../constants/networthConstants/networthDeleteDialog";

type PortfolioStatusType = { networth: { absolute: number; relative: number }; grossworth: { absolute: number; relative: number } };

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const { portfolioRepository } = useDatabaseConnection();
  const portfolioService = new PortfolioService();

  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [items, setItems] = useState<PortfolioDAO[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioDAO[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState({ networth: 0, grossworth: 0 });
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatusType>({
    networth: { absolute: 0, relative: 0 },
    grossworth: { absolute: 0, relative: 0 },
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioDAO>();

  const loadPortfolioData = (sortedPortfolio: PortfolioModel[]) => {
    let currPortfolio = [];
    let prevPortfolio = [];

    sortedPortfolio.map((portfolio) => {
      let currItem = portfolio.items[0];
      let prevItem = { value: 0 };

      if (currItem.month == currentMonth && currItem.year == currentYear) {
        prevItem = portfolio?.items[1] || { value: 0 };
      } else {
        prevItem = currItem;
      }

      // Push most recent item
      currPortfolio.push({
        name: portfolio.name,
        value: currItem.value,
        networthFlag: portfolio.networthFlag,
        grossworthFlag: portfolio.grossworthFlag,
        month: currItem.month,
        year: currItem.year,
      });

      // Push most recent last item
      prevPortfolio.push({
        name: portfolio.name,
        value: prevItem.value,
        networthFlag: portfolio.networthFlag,
        grossworthFlag: portfolio.grossworthFlag,
      });
    });

    return { currPortfolio: currPortfolio, prevPortfolio: prevPortfolio };
  };

  const loadWorthData = (curr: PortfolioDAO[], prev: PortfolioDAO[]) => {
    let networth = 0,
      grossworth = 0,
      prevNetworth = 0,
      prevGrossworth = 0;

    curr.map((item) => {
      item.networthFlag && (networth += Number(item.value));
      item.grossworthFlag && (grossworth += Number(item.value));
    });

    prev.map((item) => {
      item.networthFlag && (prevNetworth += Number(item.value));
      item.grossworthFlag && (prevGrossworth += Number(item.value));
    });

    return { currWorth: { networth: networth, grossworth: grossworth }, prevWorth: { networth: prevNetworth, grossworth: prevGrossworth } };
  };

  const loadPortfolioAnalyses = (currWorth, prevWorth) => {
    const networthAbsolute = currWorth.networth - prevWorth.networth;
    const grossworthAbsolute = currWorth.grossworth - prevWorth.grossworth;

    const networthRelative = (networthAbsolute / currWorth.networth) * 100 || 0;
    const grosswortRelative = (grossworthAbsolute / currWorth.grossworth) * 100 || 0;

    return {
      networth: { absolute: networthAbsolute, relative: networthRelative },
      grossworth: { absolute: grossworthAbsolute, relative: grosswortRelative },
    };
  };

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
    await portfolioService.deletePortfolioItem(appCtx.email, name, value, currentMonth, currentYear);
  };

  /* Loads the dialog data when list item is pressed */
  const getModalDialogData = (data: PortfolioDAO): AlertData => {
    return NetworthAlertData(data.name, data.value, async () => {
      await deleteQuery({ name: data.name, value: data.value });
      setTriggerRefresh((prev) => !prev);
    });
  };

  /* TODO BUG
   * Portefolio Calculation is wrong
   * when lastest item does not exist in current month
   */

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (appCtx.email) {
            //console.log("UseEffect Triggered...");
            const p = await portfolioRepository.getAll(appCtx.email);
            //p.map((item) => console.log(item));

            const distinctPortfolioNames = await portfolioRepository.getDistinctPortfolioNames(appCtx.email);
            setItems(distinctPortfolioNames);

            const sortedPortfolio = await portfolioRepository.getSortedPortfolio(appCtx.email, currentMonth, currentYear);
            const { currPortfolio, prevPortfolio } = loadPortfolioData(sortedPortfolio);
            setPortfolio(currPortfolio);

            const { currWorth, prevWorth } = loadWorthData(currPortfolio, prevPortfolio);
            setPortfolioWorth(currWorth);

            const worthStats = loadPortfolioAnalyses(currWorth, prevWorth);
            setPortfolioStatus(worthStats);
          }
        } catch (e) {
          console.log("Networth: " + e);
        }
      }
      fetchData();
    }, [appCtx.email, modalVisible, currentMonth, currentYear, triggerRefresh, portfolioRepository])
  );

  const isItemMonthYear = (item) => {
    return item.month == currentMonth && item.year == currentYear;
  };

  const loadOptions = (item: PortfolioDAO) => {
    return (
      <View style={styles.rowGap}>
        {isItemMonthYear(item) && <Ionicons name="add-circle" size={20} color="lightgray" />}
        <FontAwesome5 name="money-check" size={20} color={item.grossworthFlag ? dark.secundary : "gray"} />
        <FontAwesome5 name="money-check-alt" size={20} color={item.networthFlag ? "lightblue" : "gray"} />
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
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {modalVisible && (
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={15} hasColor={true}>
            <AddForm items={items} onSubmit={onSubmiteCallback} email={appCtx.email} />
          </ModalCustom>
        )}
        {alertVisible && <ModalDialog visible={alertVisible} setVisible={setAlertVisible} size={2.5} data={getModalDialogData(selectedItem)} />}
        <View style={styles.mainContainer}>
          <MainCard
            value={portfolioWorth.grossworth.toFixed(0)}
            absoluteIncrease={portfolioStatus.grossworth.absolute.toFixed(0)}
            relativeIncrease={portfolioStatus.grossworth.relative.toFixed(0)}
            title={"Grossworth"}
            icon={<FontAwesome5 name="money-check" size={15} color={dark.secundary} />}
          />
          <MainCard
            value={portfolioWorth.networth.toFixed(0)}
            absoluteIncrease={portfolioStatus.networth.absolute.toFixed(0)}
            relativeIncrease={portfolioStatus.networth.relative.toFixed(0)}
            title={"Networth"}
            icon={<FontAwesome5 name="money-check-alt" size={15} color="lightblue" />}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 5 }}>
          <View style={styles.dividerContainer}>
            <CustomTitle title="Portefolio" icon={<FontAwesome name="book" size={24} color="white" />} />

            <View style={styles.rowGap}>
              <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
              <IconButton
                addStyle={{ borderRadius: 12, justifyContent: "center" }}
                icon={<Entypo style={styles.iconButton} name="add-to-list" size={20} color={"white"} />}
                onPressHandle={onAddPressCallback}
              />
              <IconButton
                addStyle={{ borderRadius: 12, justifyContent: "center" }}
                icon={<Ionicons style={styles.iconButton} name="analytics-outline" size={20} color="white" />}
                onPressHandle={onTradePressCallback}
              />
            </View>
          </View>
          {/*
           * Fix Item giving its date to allow delete
           */}
          <ScrollView contentContainerStyle={{ gap: 5 }}>
            {portfolio?.map((item) => (
              <FlatItem key={item.name} name={item.name} value={item.value} options={loadOptions(item)} onPressCallback={isItemMonthYear(item) ? loadModalDialog : undefined} />
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
