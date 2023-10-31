import { StyleSheet, Text, View, TextInput, Image, Pressable, Dimensions, ScrollView } from "react-native";

import React, { useState, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

import { saveToStorage, getFromStorage } from "../../functions/secureStorage";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import { KEYS } from "../../utility/storageKeys";
import { handlePurchase } from "./handler";

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
      await getSplitUser();
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, [email]);

  const getSplitUser = async () => {
    let splitList = JSON.parse(await getFromStorage(KEYS.SPLIT_USERS, email));

    let value = { email: "Not Registed", name: "Not Registed" };
    if (splitList && splitList.length != 0) value = splitList[0];
    setSplitUser(value);
  };

  const getSplitName = () => {
    return splitUser.name;
  };

  const getSplitEmail = () => {
    return splitUser.email;
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setOnLoadData(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 6 }}>
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
            {ModalPurchase(list, value, email, modalContentFlag, modalVisible, setModalVisible, getSplitName(), slider, styles)}
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
            <Carrossel
              type={type}
              setType={setType}
              handlePress={() => {
                setName("");
              }}
            />
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
            handlePurchase(email, value, type, name, note, splitStatus, getSplitEmail(), slider, setValue, setNote, list, setList);
          }}
        />
      </View>
    </View>
  );
}
