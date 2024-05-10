import { Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import Header from "../../components/header/header";
import ModalCustom from "../../components/modal/modal";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import SplitSlider from "../../components/splitSlider/splitSlider";
import CustomInput from "../../components/customInput/customInput";
import Carrossel from "../../components/carrossel/carrossel";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import { ModalPurchase } from "../../utility/modalContent";

//Custom Constants
import { _styles } from "./style";

//Functions
import { getUser } from "../../functions/basic";
import { handlePurchase } from "./handler";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { horizontalScale, verticalScale } from "../../functions/responsive";

export default function Purchase({ navigation }) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [newPurchase, setNewPurchase] = useState({ dop: new Date().toISOString().split("T")[0] });

  const [slider, setSlider] = useState(50);
  const [splitStatus, setSplitStatus] = useState(false);
  const [splitUser, setSplitUser] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [list, setList] = useState([]);

  const [refundActive, setRefundActive] = useState(false);

  const appCtx = useContext(AppContext);

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
      setNewPurchase({ ...newPurchase, note: "Refund" });
    } else {
      setNewPurchase({ ...newPurchase, note: "" });
    }
  }, [refundActive]);

  return (
    <LinearGradient colors={["#121212", "#121212", "#121212", "#000000"]} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1 }}>
          {modalVisible && (
            <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
              {ModalPurchase(
                list,
                newPurchase.value,
                email,
                modalContentFlag,
                modalVisible,
                setModalVisible,
                getSplitEmail(splitUser),
                slider,
                styles
              )}
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
          <MoneyInputHeader
            value={newPurchase.value}
            setValue={(_value) => {
              setNewPurchase({ ...newPurchase, value: _value });
            }}
            signal={refundActive ? "-" : "+"}
          />
          <View style={styles.form}>
            <Carrossel
              type={newPurchase.type}
              setType={(_type) => {
                setNewPurchase({ ...newPurchase, type: _type });
              }}
              size={verticalScale(90)}
              iconSize={30}
            />
            <CustomCalendarStrip
              pickerCurrentDate={new Date(newPurchase.dop)}
              setPickerCurrentDate={(_date) => {
                setNewPurchase({ ...newPurchase, dop: _date.toISOString().split("T")[0] });
              }}
            />
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
                setValue={(_name) => {
                  setNewPurchase({ ...newPurchase, name: _name });
                }}
                value={newPurchase.name}
              />
              <CustomInput
                noStyle={true}
                Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
                placeholder="Notes"
                setValue={(_note) => {
                  setNewPurchase({ ...newPurchase, note: _note });
                }}
                value={newPurchase.note}
              />
            </CardWrapper>
            <SplitSlider
              value={newPurchase.value}
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
                newPurchase,
                setNewPurchase,
                splitStatus,
                setSplitStatus,
                getSplitEmail(splitUser),
                slider,
                setList,
                refundActive,
                setRefundActive,
                appCtx.setExpenses
              );
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
