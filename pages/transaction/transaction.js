import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import Header from "../../components/header/header";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../components/customInput/customInput";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import { KEYS } from "../../utility/storageKeys";
import { saveToStorage, getFromStorage, addToStorage } from "../../functions/secureStorage";
import { getSplitUser, getSplitEmail } from "../../functions/split";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const handleTransaction = async () => {
    let _destination = getSplitEmail(destination);
    if (_destination == "" || value == "" || description == "" || date == "") {
      alert("Please fill all fields.");
      return;
    }
    let newTransaction = [{ amount: value, dot: date.toISOString().split("T")[0], description: description, user_destination_id: _destination }];
    await addToStorage(KEYS.TRANSACTION, JSON.stringify(newTransaction), email);

    setValue("");
    setDescription("");
    console.log("Transaction Added: " + newTransaction);
  };

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
    }, [email, date])
  );

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={{ flex: 2, backgroundColor: "transparent" }}>
            <MoneyInputHeader value={value} setValue={setValue} />
          </View>
          <View style={{ flex: 7, backgroundColor: "transparent", gap: verticalScale(20) }}>
            <CustomCalendarStrip pickerCurrentDate={date} setPickerCurrentDate={setDate} />
            <CustomInput
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color="black" />}
              placeholder="Email"
              value={getSplitEmail(destination)}
              editable={false}
            />
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />}
              placeholder="Description"
              setValue={setDescription}
              value={description}
            />
          </View>
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <CustomButton handlePress={handleTransaction} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
