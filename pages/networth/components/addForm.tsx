import { View, StyleSheet, Pressable, Text } from "react-native";
import { useState } from "react";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../../components/customInput/customInput";
import { verticalScale } from "../../../functions/responsive";
import { dark } from "../../../utility/colors";
import CustomButton from "../../../components/customButton/customButton";
import Carrossel, { CarrosselItemsType } from "../../../components/carrossel/carrossel";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import CalendarCard from "../../../components/calendarCard/calendarCard";
import { PortfolioEntity } from "../../../store/database/Portfolio/PortfolioEntity";
import { PortfolioItemEntity } from "../../../store/database/PortfolioItem/PortfolioItemEntity";
import { PortfolioService } from "../../../store/database/Portfolio/PortfolioService";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center", backgroundColor: "transparent" },
  buttonActive: {
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    backgroundColor: "lightblue",
    borderRadius: 5,
    zIndex: 1,
  },
  buttonDeactive: {
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: dark.complementary,
    justifyContent: "center",
    borderRadius: 5,
    zIndex: 1,
  },
});

type AddFormProps = {
  items: CarrosselItemsType[];
  onSubmit: () => void;
  email: string;
};

export const AddForm = (props: AddFormProps) => {
  const [value, setValue] = useState();
  const [name, setName] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [networth, setNetworth] = useState(true);
  const [grossworth, setGrossworth] = useState(true);
  const [exists, setExists] = useState(false);

  const portfolioService = new PortfolioService();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        isExistingName();
      }
      fetchData();
    }, [name])
  );

  const isExistingName = () => {
    const found = props.items.find((item) => item.label == name);
    setExists(found ? true : false);
  };

  const createPortfolio = (): PortfolioEntity => {
    return {
      name: name,
      networthFlag: networth,
      grossworthFlag: grossworth,
      userId: props.email,
    };
  };

  const createPortfolioItem = (): PortfolioItemEntity => {
    return {
      value: value,
      month: currentMonth,
      year: currentYear,
    };
  };

  const onHandlePressCallback = async () => {
    await portfolioService.update(createPortfolio(), createPortfolioItem());
    props.onSubmit();
  };

  return (
    <View style={{ flex: 1 }}>
      <MoneyInputHeader value={value} setValue={setValue} />

      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ alignItems: "flex-end" }}>
          <CalendarCard monthState={[currentMonth, setCurrentMonth]} yearState={[currentYear, setCurrentYear]} />
        </View>
        <CustomInput
          placeholder="Name"
          setValue={setName}
          value={name}
          Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
        />
        <Carrossel type={name} setType={setName} size={verticalScale(90)} iconSize={30} items={props.items} />
        {!exists && (
          <View style={{ paddingTop: 10, gap: 10 }}>
            <Pressable
              style={networth ? styles.buttonActive : styles.buttonDeactive}
              onPress={() => {
                setNetworth((prev) => !prev);
              }}
            >
              <Text style={{ textAlign: "center" }}>Networth</Text>
            </Pressable>
            <Pressable
              style={grossworth ? styles.buttonActive : styles.buttonDeactive}
              onPress={() => {
                setGrossworth((prev) => !prev);
              }}
            >
              <Text style={{ textAlign: "center" }}>Grossworth</Text>
            </Pressable>
          </View>
        )}
      </View>
      <CustomButton handlePress={onHandlePressCallback} />
    </View>
  );

  //  items: { label: string; color: string; icon?: ReactNode }[];
};
