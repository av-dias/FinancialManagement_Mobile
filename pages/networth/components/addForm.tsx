import { View, StyleSheet } from "react-native";
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
import { addOrUpdateOnStorage } from "../../../functions/secureStorage";
import { KEYS } from "../../../utility/storageKeys";

const styles = StyleSheet.create({
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center", backgroundColor: "transparent" },
});

type AddFormProps = {
  items: CarrosselItemsType[];
  onSubmit: () => void;
};

export const AddForm = (props: AddFormProps) => {
  const [value, setValue] = useState();
  const [name, setName] = useState();
  const appCtx = useContext(AppContext);

  const onHandlePressCallback = async () => {
    await addOrUpdateOnStorage(KEYS.PORTFOLIO, { name: name, value: value }, appCtx.email);
    props.onSubmit();
  };

  return (
    <View style={{ flex: 1 }}>
      <MoneyInputHeader value={value} setValue={setValue} />
      <View style={{ flex: 1, gap: 10 }}>
        <CustomInput
          placeholder="Name"
          setValue={setName}
          value={name}
          Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
        />
        <Carrossel type={name} setType={setName} size={verticalScale(90)} iconSize={30} items={props.items} />
      </View>
      <CustomButton handlePress={onHandlePressCallback} />
    </View>
  );

  //  items: { label: string; color: string; icon?: ReactNode }[];
};
