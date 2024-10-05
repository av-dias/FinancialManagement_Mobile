import React, { View, Text } from "react-native";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";

//Custom Constants
import { _styles } from "./style";
import { useContext, useState } from "react";
import { AppContext } from "../../store/app-context";
import { LinearGradient } from "expo-linear-gradient";
import ButtonSwitch from "../../components/ButtonSwitch/ButtonSwitch";
import Purchase from "../purchase/purchase";
import Transaction from "../transaction/transaction";
import Income from "../income/income";

const options = ["Purchase", "Transaction", "Income"];

export default function Add({ navigation }) {
  const styles = _styles;
  const appCtx = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View>
          <ButtonSwitch selectedOption={selectedOption} setSelectedOption={setSelectedOption} options={options} />
        </View>
        {selectedOption == options[0] && <Purchase navigation={navigation} />}
        {selectedOption == options[1] && <Transaction navigation={navigation} />}
        {selectedOption == options[2] && <Income navigation={navigation} />}
      </View>
    </LinearGradient>
  );
}
