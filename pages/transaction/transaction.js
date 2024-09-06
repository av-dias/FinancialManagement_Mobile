import React, { useState, useContext } from "react";
import { View, Pressable, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//Custom Components
import Header from "../../components/header/header";
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
import { verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { handleTransaction } from "./handler";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [receivedActive, setReceivedActive] = useState(false);
  const [destination, setDestination] = useState("");
  const [newTransaction, setNewTransaction] = useState({ dot: new Date().toISOString().split("T")[0] });

  const appCtx = useContext(AppContext);

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
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ position: "absolute", right: 15, paddingVertical: 10, gap: 10 }}>
          <Pressable
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: receivedActive ? "lightblue" : dark.complementary,
              borderRadius: 10,
              zIndex: 1,
            }}
            onPress={() => {
              setReceivedActive(!receivedActive);
            }}
          >
            <Text>Received</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <MoneyInputHeader
            value={newTransaction.amount}
            setValue={(_amount) => {
              setNewTransaction({ ...newTransaction, amount: _amount });
            }}
          />
          <Carrossel
            type={newTransaction.type}
            setType={(_type) => {
              setNewTransaction({ ...newTransaction, type: _type });
            }}
            size={verticalScale(90)}
            iconSize={30}
          />
          <View style={{ flex: 7, gap: verticalScale(20), paddingTop: verticalScale(20) }}>
            <CustomCalendarStrip
              pickerCurrentDate={newTransaction.dot}
              setPickerCurrentDate={(_date) => {
                setNewTransaction({ ...newTransaction, dot: new Date(_date).toISOString().split("T")[0] });
              }}
            />
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Description"
              setValue={(_description) => {
                setNewTransaction({ ...newTransaction, description: _description });
              }}
              value={newTransaction.description}
            />
            <CustomInput
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Email"
              value={getSplitEmail(destination)}
              editable={false}
            />
          </View>
          <CustomButton
            handlePress={() => {
              handleTransaction(newTransaction, setNewTransaction, destination, receivedActive, email, appCtx.setExpenses);
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
