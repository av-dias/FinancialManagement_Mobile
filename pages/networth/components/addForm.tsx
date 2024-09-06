import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../../components/customInput/customInput";
import { verticalScale } from "../../../functions/responsive";
import { dark } from "../../../utility/colors";
import CustomButton from "../../../components/customButton/customButton";
import Carrossel from "../../../components/carrossel/carrossel";

const styles = StyleSheet.create({
  iconCenter: { display: "flex", justifyContent: "center", alignSelf: "center", backgroundColor: "transparent" },
});

export const AddForm = () => {
  const [value, setValue] = useState();
  const [name, setName] = useState();

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
        <Carrossel type={name} setType={setName} size={verticalScale(90)} iconSize={30} items={[]} />
      </View>
      <CustomButton handlePress={() => {}} />
    </View>
  );
};
