import { Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

import { horizontalScale, verticalScale } from "../../functions/responsive";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import { handlePurchase } from "./handler";
import { getSplitUser, getSplitEmail } from "../../functions/split";

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

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [pickerCurrentDate, setPickerCurrentDate] = useState(new Date());

  const [slider, setSlider] = useState(50);
  const [splitStatus, setSplitStatus] = useState(false);
  const [splitUser, setSplitUser] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [list, setList] = useState([]);

  const [refundActive, setRefundActive] = useState(false);

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
    if (refundActive) {
      setNote("Refund");
    } else {
      setNote("");
    }
  }, [refundActive]);

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1 }}>
          {modalVisible && (
            <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
              {ModalPurchase(list, value, email, modalContentFlag, modalVisible, setModalVisible, getSplitEmail(splitUser), slider, styles)}
            </ModalCustom>
          )}
          <View style={{ position: "absolute", right: 0, paddingVertical: 10, gap: 10 }}>
            <Pressable
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: refundActive ? "lightblue" : "lightgray",
                borderRadius: 10,
                zIndex: 1,
              }}
              onPress={() => {
                setRefundActive(!refundActive);
              }}
            >
              <Text>Refund</Text>
            </Pressable>
            <Pressable
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: modalContentFlag == "history" && modalVisible ? "lightblue" : "lightgray",
                borderRadius: 10,
                zIndex: 1,
              }}
              onPress={() => {
                setModalContentFlag("history");
                setModalVisible(true);
              }}
            >
              <Text>History</Text>
            </Pressable>
          </View>
          <MoneyInputHeader value={value} setValue={setValue} signal={refundActive ? "-" : "+"} />
          <View style={styles.form}>
            <Carrossel type={type} setType={setType} size={verticalScale(90)} iconSize={30} />
            <CustomCalendarStrip pickerCurrentDate={pickerCurrentDate} setPickerCurrentDate={setPickerCurrentDate} />
            <CardWrapper
              style={{
                paddingHorizontal: horizontalScale(10),
                height: verticalScale(90),
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
              size={verticalScale(90)}
            />
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
                setList,
                refundActive,
                setRefundActive
              );
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
