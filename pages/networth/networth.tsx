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
import { PortfolioEntity } from "../../store/database/Portfolio/PortfolioEntity";

type PortfolioStatusType = { networth: { absolute: number; relative: number }; grossworth: { absolute: number; relative: number } };

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const { portfolioRepository } = useDatabaseConnection();

  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [portfolio, setPortfolio] = useState<PortfolioEntity[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState({ networth: 0, grossworth: 0 });
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatusType>({
    networth: { absolute: 0, relative: 0 },
    grossworth: { absolute: 0, relative: 0 },
  });
  const [currenMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const loadPortfolioCarrosselItems = (portfolio) => {
    let carrosselItems = [];
    if (portfolio != undefined) {
      portfolio?.map((item) => !carrosselItems.find((c) => c.label == item.name) && carrosselItems.push({ label: item.name, color: "black" }));
    }
    setItems(carrosselItems);
  };

  const loadPortfolioWorth = (portfolio: PortfolioEntity[]) => {
    let networth = 0,
      grossworth = 0;
    portfolio.map((item) => {
      item.networthFlag && (networth += Number(item.value));
      item.grossworthFlag && (grossworth += Number(item.value));
    });
    return { networth: networth, grossworth: grossworth };
  };

  const loadPrevPortfolioWorth = (lastPortolio) => {
    let prevPortfolio = [];
    Object.keys(lastPortolio).forEach((key) => {
      if (lastPortolio[key].length > 1) {
        prevPortfolio.push(lastPortolio[key][1]);
      }
    });

    return loadPortfolioWorth(prevPortfolio);
  };

  const loadPortfolioList = (portfolio: PortfolioEntity[]) => {
    let portfolioList = [];
    portfolio?.map((item) => item.month === currenMonth && item.year === currentYear && portfolioList.push(item));
    return portfolioList;
  };

  const loadLastPortfolio = (portfolio: PortfolioEntity[]) => {
    let portfolioListSorted = {};
    portfolio?.map((item) => {
      if (Object.keys(portfolioListSorted).includes(item.name)) portfolioListSorted[item.name].push(item);
      else portfolioListSorted[item.name] = [item];
    });
    Object.keys(portfolioListSorted).forEach((key) =>
      portfolioListSorted[key].sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return b.month - a.month;
      })
    );
    return portfolioListSorted;
  };

  const loadPortfolioAnalyses = (currWorth, prevWorth) => {
    const networthAbsolute = currWorth.networth - prevWorth.networth;
    const grossworthAbsolute = currWorth.grossworth - prevWorth.grossworth;

    const networthRelative = (currWorth.networth / prevWorth.networth) * 100 - 100;
    const grosswortRelative = (currWorth.grossworth / prevWorth.grossworth) * 100 - 100;

    return {
      networth: { absolute: networthAbsolute, relative: Number(networthRelative.toFixed(0)) },
      grossworth: { absolute: grossworthAbsolute, relative: Number(grosswortRelative.toFixed(0)) },
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
        const portfolioFromStorage = await portfolioRepository.getAll(appCtx.email);
        loadPortfolioCarrosselItems(portfolioFromStorage);

        console.log("----------------");
        portfolioFromStorage.map((item) => console.log(item));

        // Load most recent portfolio
        const portfolio = loadPortfolioList(portfolioFromStorage);
        setPortfolio(portfolio);
        const currWorth = loadPortfolioWorth(portfolio);
        setPortfolioWorth(currWorth);

        // Load most previsous
        const lastPortolio = loadLastPortfolio(portfolioFromStorage);
        const prevWorth = loadPrevPortfolioWorth(lastPortolio);

        // Load overall portfolio analyses
        const worthAnalyses = loadPortfolioAnalyses(currWorth, prevWorth);
        setPortfolioStatus(worthAnalyses);
        try {
        } catch (e) {
          console.log("Networth AddForm: " + e);
        }
      }
      fetchData();
    }, [appCtx.email, modalVisible])
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
