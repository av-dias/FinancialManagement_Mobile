import { StyleSheet, Text, View, TextInput, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import React, { useState, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import { handlePurchase } from "./handler";
import { getSplitUser, getSplitName, getSplitEmail } from "../../functions/split";

import Header from "../../components/header/header";
import ModalCustom from "../../components/modal/modal";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import SplitSlider from "../../components/splitSlider/splitSlider";
import CustomInput from "../../components/customInput/customInput";
import Carrossel from "../../components/carrossel/carrossel";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import { ModalPurchase } from "../../utility/modalContent";

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [onLoadData, setOnLoadData] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [email, setEmail] = useState("");
  const [pickerCurrentDate, setPickerCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [slider, setSlider] = useState(50);
  const [splitStatus, setSplitStatus] = useState(false);
  const [splitUser, setSplitUser] = useState("");

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
      await getSplitUser(setSplitUser, email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, [email]);

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setOnLoadData(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 6 }}>
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
            {ModalPurchase(list, value, email, modalContentFlag, modalVisible, setModalVisible, getSplitName(splitUser), slider, styles)}
          </ModalCustom>
          <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
            <Pressable
              style={{}}
              onPress={() => {
                setModalVisible(true);
                setModalContentFlag("table_info");
              }}
            >
              <FontAwesome name="history" size={24} color="black" />
            </Pressable>
          </View>
          <View style={styles.form}>
            <MoneyInputHeader value={value} setValue={setValue} />
            <Carrossel type={type} setType={setType} />
            <CustomCalendarStrip pickerCurrentDate={pickerCurrentDate} setPickerCurrentDate={setPickerCurrentDate} />
            <CardWrapper
              style={{
                gap: 10,
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <CustomInput
                noStyle={true}
                Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />}
                placeholder="Name"
                setValue={setName}
                value={name}
              />
              <CustomInput
                noStyle={true}
                Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
                placeholder="Notes"
                setValue={setNote}
                value={note}
              />
            </CardWrapper>
            <SplitSlider
              value={value}
              setModalVisible={setModalVisible}
              setModalContentFlag={setModalContentFlag}
              splitStatus={splitStatus}
              setSplitStatus={setSplitStatus}
              slider={slider}
              setSlider={setSlider}
            />
          </View>
        </View>
        <CustomButton
          handlePress={() => {
            handlePurchase(
              email,
              value,
              type,
              name,
              setName,
              note,
              splitStatus,
              setSplitStatus,
              getSplitEmail(splitUser),
              slider,
              setValue,
              setNote,
              list,
              setList
            );
          }}
        />
      </View>
    </LinearGradient>
  );
}
