import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
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

type PortfolioStatusType = { networth: { absolute: number; relative: number }; grossworth: { absolute: number; relative: number } };

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const { portfolioRepository } = useDatabaseConnection();

  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioDAO[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState({ networth: 0, grossworth: 0 });
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatusType>({
    networth: { absolute: 0, relative: 0 },
    grossworth: { absolute: 0, relative: 0 },
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const loadPortfolioCarrosselItems = (distinctPortfolioNames) => {
    let carrosselItems = [];
    if (distinctPortfolioNames != undefined) {
      distinctPortfolioNames.map((name) => carrosselItems.push({ label: name, color: "black" }));
    }
    setItems(carrosselItems);
  };

  const loadPortfolioData = (sortedPortfolio: PortfolioModel[]) => {
    let currPortfolio = [];
    let prevPortfolio = [];

    sortedPortfolio.map((portfolio) => {
      let currItem = portfolio.items[0];
      let prevItem = portfolio?.items[1] || { value: 0 };

      // Push most recent item
      currPortfolio.push({
        name: portfolio.name,
        value: currItem.value,
        networthFlag: portfolio.networthFlag,
        grossworthFlag: portfolio.grossworthFlag,
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

    const networthRelative = (networthAbsolute / currWorth.networth) * 100;
    const grosswortRelative = (grossworthAbsolute / currWorth.grossworth) * 100;

    return {
      networth: { absolute: networthAbsolute, relative: networthRelative },
      grossworth: { absolute: grossworthAbsolute, relative: grosswortRelative },
    };
  };

  const onSubmiteCallback = () => {
    setModalVisible(false);
  };

  const onIconPressCallback = () => {
    setModalVisible(true);
  };

  /* TODO BUG
   * Portefolio Calculation is wrong
   * when lastest item does not exist in current month
   */

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        /* const portfolioFromStorage = await portfolioRepository.getAll(appCtx.email);
        console.log("\n\n\n\n");
        console.log("----------------");
        portfolioFromStorage.map((item) => console.log(item));
        console.log("----------------"); */
        try {
          if (appCtx.email) {
            const distinctPortfolioNames = await portfolioRepository.getDistinctPortfolioNames(appCtx.email);
            loadPortfolioCarrosselItems(distinctPortfolioNames);

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
    }, [appCtx.email, modalVisible, currentMonth, currentYear, portfolioRepository])
  );

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
        <View style={styles.mainContainer}>
          <MainCard
            value={portfolioWorth.grossworth}
            absoluteIncrease={portfolioStatus.networth.absolute}
            relativeIncrease={portfolioStatus.networth.relative}
            title={"Grossworth"}
            icon={<FontAwesome5 name="money-check" size={24} color={dark.secundary} />}
          />
          <MainCard
            value={portfolioWorth.networth}
            absoluteIncrease={portfolioStatus.grossworth.absolute}
            relativeIncrease={portfolioStatus.grossworth.relative}
            title={"Networth"}
            icon={<FontAwesome5 name="money-check-alt" size={24} color="lightblue" />}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 5 }}>
          <View style={styles.dividerContainer}>
            <CustomTitle title="Portefolio" icon={<FontAwesome name="book" size={24} color="white" />} />
            <IconButton icon={<Entypo name="add-to-list" size={18} color={"white"} />} onPressHandle={onIconPressCallback} />
            <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
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
