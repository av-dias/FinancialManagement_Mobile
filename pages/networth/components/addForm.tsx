import { View, StyleSheet, Pressable, Text } from "react-native";
import { useState } from "react";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../../components/customInput/customInput";
import { verticalScale } from "../../../functions/responsive";
import { dark } from "../../../utility/colors";
import CustomButton from "../../../components/customButton/customButton";
import Carrossel, {
  CarrosselItemsType,
} from "../../../components/carrossel/carrossel";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import CalendarCard from "../../../components/calendarCard/calendarCard";
import { PortfolioEntity } from "../../../store/database/Portfolio/PortfolioEntity";
import { PortfolioItemEntity } from "../../../store/database/PortfolioItem/PortfolioItemEntity";
import { PortfolioService } from "../../../service/PortfolioService";
import { useFocusEffect } from "@react-navigation/native";
import { PortfolioDAO } from "../../../models/portfolio.models";
import AntDesign from "@expo/vector-icons/AntDesign";
import { eventEmitter, NotificationEvent } from "../../../utility/eventEmitter";
import { createNotification } from "../../../components/NotificationBox/NotificationBox";

const styles = StyleSheet.create({
  iconCenter: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  buttonActive: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    backgroundColor: "lightblue",
    borderRadius: 5,
    zIndex: 1,
  },
  buttonDeactive: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    backgroundColor: dark.complementary,
    borderRadius: 5,
    zIndex: 1,
  },
});

type AddFormProps = {
  items: PortfolioDAO[];
  onSubmit: () => void;
  email: string;
};

export const AddForm = (props: AddFormProps) => {
  const [value, setValue] = useState<number>(0);
  const [name, setName] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [networth, setNetworth] = useState(true);
  const [grossworth, setGrossworth] = useState(true);
  const [exists, setExists] = useState(false);
  const [flags, setFlags] = useState({
    networthFlag: false,
    grossworthFlag: false,
  });

  const portfolioService = new PortfolioService();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const exists = isExistingName();
        if (exists) {
          loadFlags();
        }
      }
      fetchData();
    }, [name])
  );

  const loadFlags = () => {
    props.items.find(
      (item) =>
        item.name == name &&
        setFlags({
          networthFlag: item.networthFlag,
          grossworthFlag: item.grossworthFlag,
        })
    );
  };

  const isExistingName = () => {
    const found = props.items.find((item) => item.name == name);
    setExists(found ? true : false);
    return found;
  };

  const loadCarroselItems = () => {
    return props.items.map((item) => ({
      label: item.name,
      color: dark.secundary,
    }));
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
    if (!name || !value || value == 0 || !currentMonth || !currentYear) {
      eventEmitter.emit(
        NotificationEvent,
        createNotification("Please fill all fields.", dark.error)
      );
      return;
    }

    await portfolioService.update(createPortfolio(), createPortfolioItem());
    props.onSubmit();
  };

  return (
    <View style={{ flex: 1 }}>
      <MoneyInputHeader
        value={value.toString()}
        setValue={setValue}
        onBlurHandle={() => setValue((prev) => Number(prev))}
      />
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ alignItems: "flex-end" }}>
          <CalendarCard
            monthState={[currentMonth, setCurrentMonth]}
            yearState={[currentYear, setCurrentYear]}
          />
        </View>
        <CustomInput
          placeholder="Name"
          setValue={setName}
          value={name}
          Icon={
            <MaterialIcons
              style={styles.iconCenter}
              name="drive-file-rename-outline"
              size={verticalScale(20)}
              color={dark.textPrimary}
            />
          }
        />
        <Carrossel
          type={name}
          setType={setName}
          size={verticalScale(90)}
          iconSize={30}
          items={loadCarroselItems()}
          iconBorderColor={dark.secundary}
        />

        <View style={{ paddingTop: 10, gap: 10 }}>
          {(!exists || (exists && flags.networthFlag)) && (
            <Pressable
              disabled={exists}
              style={networth ? styles.buttonActive : styles.buttonDeactive}
              onPress={() => {
                setNetworth((prev) => !prev);
              }}
            >
              <Text style={{ textAlign: "center" }}>Networth</Text>
              {exists && <AntDesign name="check" size={24} color="green" />}
            </Pressable>
          )}
          {(!exists || (exists && flags.grossworthFlag)) && (
            <Pressable
              disabled={exists}
              style={grossworth ? styles.buttonActive : styles.buttonDeactive}
              onPress={() => {
                setGrossworth((prev) => !prev);
              }}
            >
              <Text style={{ textAlign: "center" }}>Grossworth</Text>
              {exists && <AntDesign name="check" size={24} color="green" />}
            </Pressable>
          )}
        </View>
      </View>
      <CustomButton handlePress={onHandlePressCallback} />
    </View>
  );

  //  items: { label: string; color: string; icon?: ReactNode }[];
};
