import React, { useState, useContext } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

//Custom Components
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomButton from "../../components/customButton/customButton";
import Carrossel from "../../components/carrossel/carrossel";

//Context
import { UserContext } from "../../store/user-context";

//Custom Constants
import { _styles } from "./style";
import { dark } from "../../utility/colors";

//Functions
import { verticalScale } from "../../functions/responsive";
import {
  clearIncomeEntity,
  IncomeEntity,
  IncomeModel,
} from "../../store/database/Income/IncomeEntity";
import { useFocusEffect } from "@react-navigation/native";
import { useDatabaseConnection } from "../../store/database-context";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";
import { ExpenseEnum } from "../../models/types";
import DualTextInput, {
  textInputType,
} from "../../components/DualTextInput/DualTextInput";
import { eventEmitter, NotificationEvent } from "../../utility/eventEmitter";
import { createNotification } from "../../components/NotificationBox/NotificationBox";

type IncomeProps = {
  income?: IncomeEntity;
  handleEditCallback?: (newIncome: IncomeEntity) => void;
};

export default function Income({ income, handleEditCallback }: IncomeProps) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const { incomeRepository } = useDatabaseConnection();

  const [listNames, setListNames] = useState<string[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(true);
  const [newIncome, setNewIncome] = useState<IncomeEntity>(
    income || {
      doi: new Date(),
      name: null,
      amount: null,
      userId: email,
      entity: ExpenseEnum.Income,
      id: null,
    }
  );

  const inputConfig: textInputType[] = [
    {
      placeholder: "Name",
      icon: (
        <MaterialIcons
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
          }}
          name="notes"
          size={verticalScale(12)}
          color={dark.textPrimary}
        />
      ),
      value: newIncome.name,
      setValue: (name: string) => {
        setNewIncome({ ...newIncome, name: name });
      },
      onBlurHandle: () =>
        setNewIncome((prev) => ({
          ...prev,
          name: prev.name.trimEnd().trimStart(),
        })),
    },
  ];

  const loadCarroselItems = (items: string[]) => {
    return items.map((item: string) => ({
      label: item,
      color: dark.secundary,
    }));
  };

  const onPressCallback = async () => {
    if (!newIncome.amount || !newIncome.name || !newIncome.userId) {
      eventEmitter.emit(
        NotificationEvent,
        createNotification("Please fill all fields.", dark.error)
      );
      return;
    }

    let income = new IncomeModel();
    if (newIncome.id) income.id = newIncome.id;
    income.amount = newIncome.amount;
    income.doi = newIncome.doi;
    income.name = newIncome.name;
    income.userId = newIncome.userId;
    const resIncome = await incomeRepository.updateOrCreate(income);

    setNewIncome(clearIncomeEntity(email));
    setTriggerRefresh((refresh) => !refresh);
    // Trigger refresh for edit callback
    if (handleEditCallback) handleEditCallback(resIncome);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          if (email) {
            const distinctIncomeNames =
              await incomeRepository.getDistinctIncomeNames(email);
            setListNames(distinctIncomeNames);
          }
        } catch (e) {
          console.log("Income: " + e);
        }
      }
      fetchData();
    }, [email, triggerRefresh])
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}
      ></View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newIncome?.amount?.toString()}
          setValue={(_amount) => {
            setNewIncome({ ...newIncome, amount: _amount });
          }}
          onBlurHandle={() =>
            setNewIncome((prev) => ({
              ...prev,
              amount: Number(prev.amount),
            }))
          }
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
            date={newIncome.doi}
            setInputBuyDate={(_date) => {
              setNewIncome({ ...newIncome, doi: new Date(_date) });
            }}
          />
          <DualTextInput values={inputConfig} direction="column" />
        </View>
        <CustomButton handlePress={onPressCallback} />
      </View>
    </View>
  );
}
