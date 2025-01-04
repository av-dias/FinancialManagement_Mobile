import React, { useState, useContext } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

//Custom Components
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../components/customInput/customInput";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import Carrossel from "../../components/carrossel/carrossel";

//Context
import { AppContext } from "../../store/app-context";

//Custom Constants
import { _styles } from "./style";
import { dark } from "../../utility/colors";

//Functions
import { horizontalScale, verticalScale } from "../../functions/responsive";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { IncomeEntity, IncomeModel } from "../../store/database/Income/IncomeEntity";
import { useFocusEffect } from "@react-navigation/native";
import { useDatabaseConnection } from "../../store/database-context";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";

type IncomeProps = {
  income?: IncomeEntity;
  handleEditCallback?: (newIncome: IncomeEntity) => void;
};

export default function Income({ income, handleEditCallback }: IncomeProps) {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  const { incomeRepository } = useDatabaseConnection();

  const [listNames, setListNames] = useState<string[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(true);
  const [newIncome, setNewIncome] = useState<IncomeEntity>(
    income || {
      doi: new Date(),
      name: null,
      amount: null,
      userId: appCtx.email,
      id: null,
    }
  );

  const loadCarroselItems = (items: string[]) => {
    return items.map((item: string) => ({ label: item, color: dark.secundary }));
  };

  const onPressCallback = async () => {
    if (!newIncome.amount || !newIncome.name || !newIncome.userId) {
      alert("Please fill all fields.");
      return;
    }

    let income = new IncomeModel();
    if (newIncome.id) income.id = newIncome.id;
    income.amount = newIncome.amount;
    income.doi = newIncome.doi;
    income.name = newIncome.name;
    income.userId = newIncome.userId;
    const resIncome = await incomeRepository.updateOrCreate(income);

    setNewIncome({
      doi: new Date(),
      name: null,
      amount: null,
      userId: appCtx.email,
      id: null,
    });
    setTriggerRefresh((refresh) => !refresh);
    // Trigger refresh for edit callback
    if (handleEditCallback) handleEditCallback(resIncome);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (appCtx.email) {
            const distinctIncomeNames = await incomeRepository.getDistinctIncomeNames(appCtx.email);
            setListNames(distinctIncomeNames);
          }
        } catch (e) {
          console.log("Income: " + e);
        }
      }
      fetchData();
    }, [appCtx.email, triggerRefresh])
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}></View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newIncome?.amount?.toString()}
          setValue={(_amount) => {
            setNewIncome({ ...newIncome, amount: _amount });
          }}
        />
        <Carrossel
          type={newIncome.name}
          setType={(name) => {
            setNewIncome({ ...newIncome, name: name });
          }}
          size={verticalScale(90)}
          iconSize={30}
          items={loadCarroselItems(listNames)}
          iconBorderColor={dark.secundary}
        />
        <View style={styles.form}>
          <FlatCalendar
            setInputBuyDate={(_date) => {
              setNewIncome({ ...newIncome, doi: new Date(_date) });
            }}
          />
          <View style={{ gap: verticalScale(5) }}>
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Name"
              setValue={(name: string) => {
                setNewIncome({ ...newIncome, name: name });
              }}
              value={newIncome.name}
            />
          </View>
        </View>
        <CustomButton handlePress={onPressCallback} />
      </View>
    </View>
  );
}
