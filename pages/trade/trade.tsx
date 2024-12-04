import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";
import { useContext, useState } from "react";
import { AppContext } from "../../store/app-context";
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
import { FlatItem } from "../../components/flatItem/flatItem";
import { logTimeTook } from "../../utility/logger";

export default function Trade({ navigation }) {
  const appCtx = useContext(AppContext);
  const securityInvestmentService = new SecurityInvestmentService();
  const { investmentRepository, securityRepository } = useDatabaseConnection();

  const styles = _styles;
  const [inputName, setInputName] = useState("");
  const [inputTicker, setInputTicker] = useState("");
  const [inputBuyPrice, setInputBuyPrice] = useState("");
  const [inputBuyDate, setInputBuyDate] = useState("");
  const [inputShareValue, setInputShareValue] = useState("");
  const [inputInvestmentTicker, setInputInvestmentTicker] = useState("");
  const [securities, setSecurities] = useState<SecurityEntity[]>([]);
  const [investments, setInvestments] = useState<InvestmentEntity[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTicker, setSelectedTicker] = useState<string>();

  const createInvestment = (): InvestmentEntity => {
    return { shares: Number(inputShareValue), buyPrice: Number(inputBuyPrice), buyDate: new Date(), userId: appCtx.email };
  };

  const addInvestmentCallback = async () => {
    if (inputInvestmentTicker === "") return;
    console.log("Adding investment...");
    await securityInvestmentService.insertInvestment(createInvestment(), inputInvestmentTicker);
    setRefresh((prev) => !prev);
    setModalVisible(false);
  };

  const addSecurityCallback = async () => {
    if (inputName === "" || inputTicker === "") return;

    console.log("Adding security...");
    await securityRepository.updateOrCreate({ name: inputName, ticker: inputTicker });
    setInputName("");
    setInputTicker("");
    setRefresh((prev) => !prev);
    setModalVisible(false);
  };

  const addForm = () => {
    return (
      <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={15} hasColor={true}>
        {/* Security - Name Ticket Investments */}
        <View style={{ flex: 1, gap: 20 }}>
          <CustomTitle title={"Security"} />
          <CustomInput Icon={undefined} placeholder={"Name"} value={inputName} setValue={setInputName} />
          <CustomInput Icon={undefined} placeholder={"Ticker"} value={inputTicker} setValue={setInputTicker} />
          <Pressable
            onPress={async () => {
              await addSecurityCallback();
            }}
            style={({ pressed }) => [{ borderRadius: 10, padding: 10, margin: pressed ? 1 : 0, alignItems: "center", backgroundColor: pressed ? "orange" : dark.button }]}
          >
            <Text>Security</Text>
          </Pressable>
        </View>
        {/* Investments - BuyPrice, BuyDate, Shares, SellPrice, SellDate, Security */}
        <View style={{ flex: 2, gap: 20 }}>
          <CustomTitle title={"Investment"} />
          <CustomInput Icon={undefined} placeholder={"BuyPrice"} value={inputBuyPrice} setValue={setInputBuyPrice} />
          <CustomInput Icon={undefined} placeholder={"BuyDate"} value={inputBuyDate} setValue={setInputBuyDate} />
          <CustomInput Icon={undefined} placeholder={"Shares"} value={inputShareValue} setValue={setInputShareValue} />
          <CustomInput Icon={undefined} placeholder={"Ticker"} value={inputInvestmentTicker} setValue={setInputInvestmentTicker} />
          <Pressable
            onPress={async () => {
              await addInvestmentCallback();
            }}
            style={({ pressed }) => [{ borderRadius: 10, padding: 10, margin: pressed ? 1 : 0, alignItems: "center", backgroundColor: pressed ? "orange" : dark.button }]}
          >
            <Text>Investment</Text>
          </Pressable>
        </View>
      </ModalCustom>
    );
  };

  const loadSecurityIcon = (ticker: string) => (
    <View style={{ backgroundColor: "black", padding: 10, borderRadius: 5, width: 50 }}>
      <Text style={{ color: dark.textPrimary, textAlign: "center" }}>{ticker}</Text>
    </View>
  );

  const loadSecurityItems = () => {
    return securities.map((security) => ({ label: security.ticker, color: dark.secundary, component: loadSecurityIcon(security.ticker) }));
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (appCtx.email) {
            try {
              const listSecurity = await securityRepository.getAll(appCtx.email);
              //listSecurity.map((security) => console.log(security));
              setSecurities(listSecurity);
              setSelectedTicker(listSecurity[0].ticker);

              const listInvestment = await investmentRepository.getAll(appCtx.email);
              //listInvestment.map((investment) => console.log(investment));
              setInvestments(listInvestment);
            } catch (e) {
              setSecurities([]);
              setInvestments([]);
              setSelectedTicker("");
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
    }, [appCtx.email, securityRepository, investmentRepository, refresh])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 20 }}>
          {modalVisible && addForm()}
          <View>
            <Carrossel items={loadSecurityItems()} type={selectedTicker} setType={setSelectedTicker} size={60} iconBackground={dark.complementary} />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Pressable onPress={() => setModalVisible(true)} style={{ borderRadius: 10, borderWidth: 1, borderColor: dark.textPrimary }}>
              <CustomTitle title="Trade" />
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              {investments.map((item) => (
                <FlatItem key={item.id} padding={10} icon={loadSecurityIcon(item.security.ticker)} name={item.shares.toString()} value={item.buyPrice} />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
