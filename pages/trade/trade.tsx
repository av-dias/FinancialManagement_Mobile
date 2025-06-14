import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";
import { useContext, useState } from "react";
import { UserContext } from "../../store/user-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { styles } from "./styles";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import { SecurityInvestmentService } from "../../store/database/SecurityInvestment/SecurityInvestmentService";
import {
  InvestmentEntity,
  SecurityEntity,
} from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useDatabaseConnection } from "../../store/database-context";
import ModalCustom from "../../components/modal/modal";
import { logTimeTook } from "../../utility/logger";
import {
  LoadSecurityIcon,
  nameComponent,
  valueComponent,
} from "./tradeComponents/tradeItem";
import { verticalScale } from "../../functions/responsive";
import { dateSorterAsc } from "../../functions/dates";
import {
  addInvestmentCallback,
  addSecurityCallback,
  editOption,
} from "./tradeHandler";
import {
  DateTitleFormat,
  InvestmentForm,
  SecurityForm,
} from "./tradeComponents/tradeForms";
import { SecurityFilter } from "./tradeComponents/securityFilter";
import { TradeHeaderOptions } from "./tradeComponents/tradeHeaderOptions";
import { FlatItem } from "../../components/flatItem/flatItem";
import { ModalDialog } from "../../components/ModalDialog/ModalDialog";
import { FlatOptionsItem } from "../../components/flatOptionsItem/flatOptionsItem";

export default function Trade({ navigation }) {
  const email = useContext(UserContext).email;
  const noFilter = "NoFilter";

  const securityInvestmentService = new SecurityInvestmentService();
  const { investmentRepository, securityRepository } = useDatabaseConnection();

  const [inputName, setInputName] = useState("");
  const [inputTicker, setInputTicker] = useState("");
  const [inputBuyPrice, setInputBuyPrice] = useState<number>(0);
  const [inputBuyDate, setInputBuyDate] = useState<Date>(new Date());
  const [inputShareValue, setInputShareValue] = useState<string>("");
  const [inputInvestmentTicker, setInputInvestmentTicker] = useState("");
  const [securities, setSecurities] = useState<SecurityEntity[]>([]);
  const [investments, setInvestments] = useState<InvestmentEntity[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"Trade" | "Security">(null);

  const [selectedItem, setSelectedItem] = useState<InvestmentEntity>(null);
  const [sortedDates, setSortedDates] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState<string>(noFilter);

  const icon = (ticker) => <LoadSecurityIcon ticker={ticker} />;

  const loadSecurityItems = () => {
    return securities.map((security) => ({
      label: security.ticker,
      color: dark.secundary,
      component: <LoadSecurityIcon ticker={security.ticker} />,
    }));
  };

  const callSecurityCallback = async () => {
    await addSecurityCallback(
      inputName,
      inputTicker,
      securityRepository,
      setInputName,
      setInputTicker,
      setRefresh
    );
  };

  const callInvestmentCallback = async () => {
    await addInvestmentCallback(
      inputInvestmentTicker,
      inputBuyDate,
      inputShareValue,
      inputBuyPrice,
      securityInvestmentService,
      setRefresh,
      setInputBuyPrice,
      setInputShareValue,
      email
    );
  };

  /**
   * All available options that will show
   * as icons on the flatItem
   */
  const loadOptions = (item: InvestmentEntity) => {
    let options = [];
    options.push(
      editOption(setSelectedItem, item, setModalVisible, setModalType)
    );
    return options;
  };

  const getModalDialogData = (item: InvestmentEntity) => ({
    title: "Delete Investment",
    content: `Are you sure you want to delete this investment?\n
Name: ${item.security.name}
Shares: ${item.shares}
Buy Price: ${item.buyPrice}€
Buy Date: ${item.buyDate.toISOString().split("T")[0]}\n`,
    cancelText: "Cancel",
    confirmText: "Delete",
    confirmCallback: async () => {
      await investmentRepository.delete(item.id);
      setRefresh((prev) => !prev);
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            try {
              const listSecurity = await securityRepository.getAll(email);
              setSecurities(listSecurity);

              let dateList = [];
              let listInvestment = await investmentRepository.getAll(email);

              // Check if filter is selected and filter appropriately
              if (selectedTicker != noFilter) {
                listInvestment = listInvestment.filter(
                  (investment) => investment.security.ticker == selectedTicker
                );
              }

              listInvestment.forEach((investment) =>
                dateList.push(investment.buyDate.toISOString().split("T")[0])
              );

              const sortedList = new Set(dateSorterAsc(dateList).reverse());
              setSortedDates(Array.from(sortedList));
              setInvestments(listInvestment);
            } catch (e) {
              setSecurities([]);
              setInvestments([]);
              console.log(e);
            }
          }
        } catch (e) {
          console.log("Trade: " + e);
        }
      }
      if (securityRepository.isReady() && investmentRepository.isReady()) {
        let startTime = performance.now();
        fetchData();
        let endTime = performance.now();
        logTimeTook("Trade", "Fetch", endTime, startTime);
      }
    }, [
      email,
      securityRepository,
      investmentRepository,
      refresh,
      selectedTicker,
    ])
  );

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
            {modalType === "Security" ? (
              <SecurityForm
                inputName={inputName}
                setInputName={setInputName}
                inputTicker={inputTicker}
                setInputTicker={setInputTicker}
                addSecurityCallback={callSecurityCallback}
              />
            ) : (
              <InvestmentForm
                securityItems={loadSecurityItems()}
                addInvestmentCallback={callInvestmentCallback}
                inputBuyPrice={inputBuyPrice}
                setInputBuyPrice={setInputBuyPrice}
                inputInvestmentTicker={inputInvestmentTicker}
                setInputInvestmentTicker={setInputInvestmentTicker}
                setInputBuyDate={setInputBuyDate}
                inputShareValue={inputShareValue}
                setInputShareValue={setInputShareValue}
              />
            )}
          </ModalCustom>
        )}
        {alertVisible && (
          <ModalDialog
            size={4}
            visible={alertVisible}
            setVisible={setAlertVisible}
            data={getModalDialogData(selectedItem)}
          />
        )}
        <SecurityFilter
          selectedTicker={selectedTicker}
          noFilter={noFilter}
          setSelectedTicker={setSelectedTicker}
          securityItems={loadSecurityItems()}
        />
        <TradeHeaderOptions
          setModalVisible={setModalVisible}
          setModalType={setModalType}
        />
        <CustomTitle title={"Investments"} textStyle={styles.mainTitleStyle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
        >
          {sortedDates.map((dates) => {
            return (
              <View key={`Date${dates}`} style={{ gap: 10 }}>
                <DateTitleFormat dates={dates} />
                {investments
                  .filter(
                    (item) => item.buyDate.toISOString().split("T")[0] === dates
                  )
                  .map((item) => {
                    return (
                      <View key={`View${item.id}`}>
                        <FlatOptionsItem
                          key={item.id}
                          name={nameComponent(item)}
                          value={valueComponent(item)}
                          icon={icon(item.security.ticker)}
                          paddingVertical={verticalScale(10)}
                          paddingHorizontal={verticalScale(10)}
                          onPressCallback={() => {
                            setAlertVisible(true);
                            setSelectedItem(item);
                          }}
                          options={loadOptions(item)}
                        />
                      </View>
                    );
                  })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
