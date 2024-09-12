import { View, StyleSheet, Pressable, Text } from "react-native";
import { ReactNode, useContext, useState } from "react";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../../components/customInput/customInput";
import { verticalScale } from "../../../functions/responsive";
import { dark } from "../../../utility/colors";
import CustomButton from "../../../components/customButton/customButton";
import Carrossel, { CarrosselItemsType } from "../../../components/carrossel/carrossel";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { AppContext } from "../../../store/app-context";
import React from "react";
import { addOrUpdateOnDateStorage } from "../../../functions/secureStorage";
import { KEYS } from "../../../utility/storageKeys";
import CalendarCard from "../../../components/calendarCard/calendarCard";
import { useDatabaseConnection } from "../../../store/database-context";
import { PortfolioEntity, PortfolioModel } from "../../../store/database/Portfolio/PortfolioEntity";

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

  const { portfolioRepository } = useDatabaseConnection();

  const isExistingName = () => {
    const found = props.items.find((item) => item.label == name);
    setExists(found ? true : false);
  };

  const createPortfolioItem = (): PortfolioEntity => {
    return {
      name: name,
      value: value,
      networthFlag: networth,
      grossworthFlag: grossworth,
      month: currentMonth,
      year: currentYear,
      userId: props.email,
    };
  };

  const onHandlePressCallback = async () => {
    //await addOrUpdateOnDateStorage(KEYS.PORTFOLIO, createPortfolioItem(), appCtx.email);
    portfolioRepository.create(createPortfolioItem());
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
          <>
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
          </>
        )}
      </View>
      <CustomButton handlePress={onHandlePressCallback} />
    </View>
  );

  //  items: { label: string; color: string; icon?: ReactNode }[];
};
