import React, { View } from "react-native";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";

//Custom Constants
import { _styles } from "./style";
import { useContext, useState } from "react";
import { UserContext } from "../../store/user-context";
import { LinearGradient } from "expo-linear-gradient";
import ButtonSwitch from "../../components/ButtonSwitch/ButtonSwitch";
import Purchase from "../purchase/purchase";
import Transaction from "../transaction/transaction";
import Income from "../income/income";
import { NotificationBox } from "../../components/NotificationBox/NotificationBox";

const options = ["Purchase", "Transaction", "Income"];

export default function Add({ navigation }) {
  const styles = _styles;
  const email = useContext(UserContext).email;
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <NotificationBox />
      <View style={styles.usableScreen}>
        <View>
          <ButtonSwitch
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            options={options}
          />
        </View>
        {selectedOption == options[0] && <Purchase />}
        {selectedOption == options[1] && <Transaction />}
        {selectedOption == options[2] && <Income />}
      </View>
    </LinearGradient>
  );
}
