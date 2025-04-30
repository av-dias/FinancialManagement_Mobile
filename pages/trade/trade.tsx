import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";
import { useContext, useState } from "react";
import { UserContext } from "../../store/user-context";
import { _styles } from "./styles";
import CustomInput from "../../components/customInput/customInput";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import { SecurityInvestmentService } from "../../store/database/SecurityInvestment/SecurityInvestmentService";
import { InvestmentEntity, SecurityEntity } from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useDatabaseConnection } from "../../store/database-context";
import ModalCustom from "../../components/modal/modal";
import Carrossel from "../../components/carrossel/carrossel";
import { logTimeTook } from "../../utility/logger";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { TradeItem } from "./tradeComponents/tradeItem";
import { verticalScale } from "../../functions/responsive";
import { months } from "../../utility/calendar";
import { dateSorterAsc } from "../../functions/dates";
import { IconButton } from "../../components/iconButton/IconButton";
import { EvilIcons } from "@expo/vector-icons";

export default function Trade({ navigation }) {
  const email = useContext(UserContext).email;
  const securityInvestmentService = new SecurityInvestmentService();
  const { investmentRepository, securityRepository } = useDatabaseConnection();
  const noFilter = "NoFilter";
  const styles = _styles;

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
  const [modalType, setModalType] = useState<"Trade" | "Security">(null);

  const [sortedDates, setSortedDates] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState<string>(noFilter);

  const createInvestment = (): InvestmentEntity => {
    return { shares: Number(inputShareValue.replace(",", ".")), buyPrice: Number(inputBuyPrice), buyDate: inputBuyDate, userId: email };
  };

  const addInvestmentCallback = async () => {
    if (inputInvestmentTicker === "") return;
    await securityInvestmentService.insertInvestment(createInvestment(), inputInvestmentTicker);
    setRefresh((prev) => !prev);
    //setModalVisible(null);
    setInputBuyPrice(0);
    setInputShareValue("0");
  };

  const addSecurityCallback = async () => {
    if (inputName === "" || inputTicker === "") return;

    await securityRepository.updateOrCreate({ name: inputName, ticker: inputTicker });
    setInputName("");
    setInputTicker("");
    setRefresh((prev) => !prev);
    //setModalVisible(null);
  };

  const addForm = () => {
    if (modalType === "Security") {
      return (
        <View style={{ flex: 1, gap: 20 }}>
          <CustomTitle title={"Add Security"} textStyle={{ padding: 0, fontSize: 18, fontWeight: "bold" }} containerStyle={{ paddingTop: verticalScale(10), paddingBottom: verticalScale(15) }} />
          <CustomInput Icon={undefined} placeholder={"Name"} value={inputName} setValue={setInputName} />
          <CustomInput Icon={undefined} placeholder={"Ticker"} value={inputTicker} setValue={setInputTicker} capitalize="characters" />
          <View style={{ flex: 1, justifyContent: "flex-end", bottom: 20 }}>
            <Pressable
              onPress={async () => {
                await addSecurityCallback();
              }}
              style={({ pressed }) => [{ borderRadius: 10, padding: 10, margin: pressed ? 1 : 0, alignItems: "center", backgroundColor: pressed ? "orange" : dark.button }]}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Security</Text>
            </Pressable>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 2, gap: 20 }}>
          <MoneyInputHeader verticalHeight={180} value={inputBuyPrice.toString()} setValue={setInputBuyPrice} onBlurHandle={() => setInputBuyPrice((prev) => Number(prev))} />
          <FlatCalendar setInputBuyDate={setInputBuyDate} />
          <CustomInput keyboardType="numeric" Icon={undefined} placeholder={"Shares"} value={inputShareValue} setValue={setInputShareValue} />
          <Carrossel items={loadSecurityItems()} type={inputInvestmentTicker} setType={setInputInvestmentTicker} size={60} iconBackground={dark.complementary} />
          <View style={{ flex: 1, justifyContent: "flex-end", bottom: 20 }}>
            <Pressable
              onPress={async () => {
                await addInvestmentCallback();
              }}
              style={({ pressed }) => [{ borderRadius: 10, padding: 10, margin: pressed ? 1 : 0, alignItems: "center", backgroundColor: pressed ? "orange" : dark.button }]}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Trade</Text>
            </Pressable>
          </View>
        </View>
      );
    }
  };

  const loadSecurityIcon = (ticker: string) => (
    <View style={{ backgroundColor: "black", padding: 10, borderRadius: 5, width: 50 }}>
      <Text style={{ color: dark.textPrimary, textAlign: "center" }}>{ticker}</Text>
    </View>
  );

  const loadSecurityItems = () => {
    return securities.map((security) => ({ label: security.ticker, color: dark.secundary, component: loadSecurityIcon(security.ticker) }));
  };

  const dateTitleFormat = (dates) => {
    let date = new Date(dates);

    return (
      <View key={dates} style={{ flexDirection: "row", justifyContent: "space-around", paddingBottom: 5, gap: 5, width: 80 }}>
        <Text style={{ color: dark.textPrimary, textAlign: "right", width: 20 }}>{date.getDate()}</Text>
        <Text style={{ color: dark.textPrimary, textAlign: "right", width: 25 }}>{months[date.getMonth()]}</Text>
        <Text style={{ color: dark.textPrimary, textAlign: "right", width: 35 }}>{date.getFullYear()}</Text>
      </View>
    );
  };

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
                listInvestment = listInvestment.filter((investment) => investment.security.ticker == selectedTicker);
              }

              listInvestment.map((investment) => dateList.push(investment.buyDate.toISOString().split("T")[0]));
              const sortedList = new Set(dateSorterAsc(dateList).reverse());
              setSortedDates(Array.from(sortedList));
              //console.log(Array.from(sortedList));
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
    }, [email, securityRepository, investmentRepository, refresh, selectedTicker])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 30, padding: 10 }}>
          {modalVisible && (
            <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={15} hasColor={true}>
              {addForm()}
            </ModalCustom>
          )}
          <View style={{ flexDirection: "row", gap: 5 }}>
            <CardWrapper style={{ width: 60, height: 60, alignItems: "center", backgroundColor: selectedTicker === noFilter ? dark.secundary : dark.complementary }}>
              <IconButton
                addStyle={{ backgroundColor: "transparent", paddingBottom: 5 }}
                icon={<EvilIcons name="search" size={30} color="white" />}
                onPressHandle={() => setSelectedTicker(noFilter)}
              />
            </CardWrapper>
            <View style={{ flex: 1 }}>
              <Carrossel items={loadSecurityItems()} type={selectedTicker} setType={setSelectedTicker} size={60} iconBackground={dark.complementary} />
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setModalType("Security");
              }}
              style={{ borderRadius: 10, borderWidth: 1, borderColor: dark.textPrimary }}
            >
              <CustomTitle textStyle={{ padding: 5 }} title="Security" />
            </Pressable>
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setModalType("Trade");
              }}
              style={{ borderRadius: 10, borderWidth: 1, borderColor: dark.textPrimary }}
            >
              <CustomTitle textStyle={{ padding: 5 }} title="Trade" />
            </Pressable>
          </View>
          <CardWrapper style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }}>
            <CustomTitle title={"Investments"} textStyle={{ padding: 0, fontSize: 16, fontWeight: "bold" }} containerStyle={{ paddingTop: verticalScale(10), paddingBottom: verticalScale(15) }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 30 }}>
              {sortedDates.map((dates) => {
                return (
                  <View key={`Date${dates}`} style={{ gap: 10 }}>
                    {dateTitleFormat(dates)}
                    {investments
                      .filter((item) => item.buyDate.toISOString().split("T")[0] === dates)
                      .map((item) => {
                        return (
                          <View key={`View${item.id}`}>
                            <TradeItem
                              key={item.id}
                              icon={loadSecurityIcon(item.security.ticker)}
                              shares={item.shares.toString()}
                              cost={Number(item.buyPrice) * item.shares}
                              ticker={item.security.ticker}
                              name={item.security.name}
                            />
                          </View>
                        );
                      })}
                  </View>
                );
              })}
            </ScrollView>
          </CardWrapper>
        </View>
      </View>
    </LinearGradient>
  );
}
