import React, { useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//Custom Components
import Header from "../../components/header/header";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../components/customInput/customInput";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";

//Custom Constants
import { _styles } from "./style";

//Functions
import { verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { handleTransaction } from "./handler";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [newTransaction, setNewTransaction] = useState({ dot: new Date().toISOString().split("T")[0] });

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);

        await getSplitUser(setDestination, email);
        try {
        } catch (e) {
          console.log("Transaction: " + e);
        }
      }
      fetchData();
    }, [email])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1 }}>
          <MoneyInputHeader
            value={newTransaction.amount}
            setValue={(_amount) => {
              setNewTransaction({ ...newTransaction, amount: _amount });
            }}
          />
          <View style={{ flex: 7, gap: verticalScale(20), paddingTop: verticalScale(20) }}>
            <CustomCalendarStrip
              pickerCurrentDate={newTransaction.dot}
              setPickerCurrentDate={(_date) => {
                setNewTransaction({ ...newTransaction, dot: new Date(_date).toISOString().split("T")[0] });
              }}
            />
            <CustomInput
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color="black" />}
              placeholder="Email"
              value={getSplitEmail(destination)}
              editable={false}
            />
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />}
              placeholder="Description"
              setValue={(_description) => {
                setNewTransaction({ ...newTransaction, description: _description });
              }}
              value={newTransaction.description}
            />
          </View>
          <CustomButton
            handlePress={() => {
              handleTransaction(newTransaction, setNewTransaction, destination, email);
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
