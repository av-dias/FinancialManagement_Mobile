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
import commonStyles from "../../utility/commonStyles";

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

  const createInvestment = (): InvestmentEntity => {
    return { shares: Number(inputShareValue), buyPrice: Number(inputBuyPrice), buyDate: new Date(), userId: appCtx.email };
  };

  const addInvestmentCallback = async () => {
    console.log("Adding investment...");
    await securityInvestmentService.insertInvestment(createInvestment(), inputInvestmentTicker);
    setRefresh((prev) => !prev);
  };

  const addSecurityCallback = async () => {
    console.log("Adding security...");
    await securityRepository.updateOrCreate({ name: inputName, ticker: inputTicker });
    setInputName("");
    setInputTicker("");
    setRefresh((prev) => !prev);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (appCtx.email) {
            try {
              const listSecurity = await securityRepository.getAll(appCtx.email);
              listSecurity.map((security) => console.log(security));
              setSecurities(listSecurity);

              const listInvestment = await investmentRepository.getAll(appCtx.email);
              listInvestment.map((investment) => console.log(investment));
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
      console.log("UseEffect Trade");
      if (securityRepository.isReady() && investmentRepository.isReady()) {
        fetchData();
      }
    }, [appCtx.email, securityRepository, investmentRepository, refresh])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 20 }}>
          <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: "white", gap: 10 }} horizontal={true}>
            {securities.map((item) => (
              <Text key={item.ticker}>{item.ticker}</Text>
            ))}
          </ScrollView>
          <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: "white", gap: 10 }} horizontal={true}>
            {investments.map((item) => (
              <Text key={item.id}>{item.shares}</Text>
            ))}
          </ScrollView>
          {/* Security - Name Ticket Investments */}
          <View style={{ flex: 4, gap: 20 }}>
            <CustomTitle title={"Security"} />
            <CustomInput Icon={undefined} placeholder={"Name"} value={inputName} setValue={setInputName} />
            <CustomInput Icon={undefined} placeholder={"Ticker"} value={inputTicker} setValue={setInputTicker} />
            <Pressable
              onPress={async () => {
                await addSecurityCallback();
              }}
              style={{ borderRadius: 10, padding: 10, alignItems: "center", backgroundColor: dark.button }}
            >
              <Text>Security</Text>
            </Pressable>
          </View>
          {/* Investments - BuyPrice, BuyDate, Shares, SellPrice, SellDate, Security */}
          <View style={{ flex: 8, gap: 20 }}>
            <CustomTitle title={"Investment"} />
            <CustomInput Icon={undefined} placeholder={"BuyPrice"} value={inputBuyPrice} setValue={setInputBuyPrice} />
            <CustomInput Icon={undefined} placeholder={"BuyDate"} value={inputBuyDate} setValue={setInputBuyDate} />
            <CustomInput Icon={undefined} placeholder={"Shares"} value={inputShareValue} setValue={setInputShareValue} />
            <CustomInput Icon={undefined} placeholder={"Ticker"} value={inputInvestmentTicker} setValue={setInputInvestmentTicker} />
            <Pressable
              onPress={async () => {
                await addInvestmentCallback();
              }}
              style={{ borderRadius: 10, padding: 10, alignItems: "center", backgroundColor: dark.button }}
            >
              <Text>Investment</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
