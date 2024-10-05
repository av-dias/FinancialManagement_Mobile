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

type incomeType = {
  amount: number;
  doi: string;
  name: string;
};

export default function Income({ navigation }) {
  const styles = _styles;
  const [newIncome, setNewIncome] = useState<incomeType>({
    doi: new Date().toISOString().split("T")[0],
    name: "",
    amount: 0,
  });

  const loadCarroselItems = (items: string[]) => {
    return items.map((item: string) => ({ label: item, color: dark.secundary }));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}></View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newIncome.amount.toString()}
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
          items={loadCarroselItems(["Citi"])}
          iconBackground="gray"
        />
        <View style={styles.form}>
          <CustomCalendarStrip
            pickerCurrentDate={newIncome.doi}
            setPickerCurrentDate={(_date) => {
              setNewIncome({ ...newIncome, doi: new Date(_date).toISOString().split("T")[0] });
            }}
          />
          <CardWrapper
            style={{
              paddingHorizontal: horizontalScale(10),
              paddingVertical: horizontalScale(5),
              //height: verticalScale(90),
            }}
          >
            <CustomInput
              noStyle={true}
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Name"
              setValue={(name) => {
                setNewIncome({ ...newIncome, name: name });
              }}
              value={newIncome.name}
            />
          </CardWrapper>
        </View>
        <CustomButton handlePress={() => {}} />
      </View>
    </View>
  );
}
