import navLogo from "../../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { color } from "../../utility/colors";
import { Divider } from "react-native-paper";

import React, { useState, useEffect } from "react";
import CalendarStrip from "react-native-calendar-strip";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

import { saveToStorage, getFromStorage } from "../../functions/secureStorage";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { _styles } from "./style";
import { categoryIcons } from "../../assets/icons";
import { getUser } from "../../functions/basic";
import { KEYS } from "../../utility/storageKeys";

import Header from "../../components/header/header";
import ModalCustom from "../../components/modal/modal";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import SplitSlider from "../../components/splitSlider/splitSlider";
import CustomInput from "../../components/customInput/customInput";
import Carrossel from "../../components/carrossel/carrossel";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";

import commonStyles from "../../utility/commonStyles";

const HEIGHT = Dimensions.get("window").height;
const BORDER_RADIUS = 10;
const CATERGORY_ICON_SIZE = 25;
const TABLE_ICON_SIZE = 15;

export default function Purchase({ navigation }) {
  const styles = _styles;
  const [onLoadData, setOnLoadData] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [email, setEmail] = useState("");
  const [datePicker, setDatePicker] = useState(true);
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

  const handlePurchase = async () => {
    let date = this._calendar.getSelectedDate();
    if (type == "" || name == "" || value == "" || date == "" || !date) {
      alert("Please fill all fields.");
      return;
    }

    if (!note) setNote("");
    try {
      let purchases = await getFromStorage(KEYS.PURCHASE, email);
      let newPurchase = { type: type, name: name, value: value, dop: date.toISOString().split("T")[0], note: note };

      //improve split destination logic
      if (splitStatus) {
        newPurchase["split"] = {};
        newPurchase["split"]["userId"] = getSplitEmail();
        newPurchase["split"]["weight"] = slider;
      }

      if (purchases) {
        purchases = JSON.parse(purchases);
        purchases.push(newPurchase);
      } else {
        purchases = [newPurchase];
      }

      console.log(newPurchase);

      await saveToStorage(KEYS.PURCHASE, JSON.stringify(purchases), email);
      setList([
        [categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === type).icon, name, value, date.toISOString().split("T")[0]],
        ...list,
      ]);
      setValue("");
      setNote("");
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setOnLoadData(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  const state = {
    tableHead: ["Type", "Name", "Value", "Date"],
  };

  const calendarPicker = () => {
    setDatePicker(!datePicker);
  };

  const changeDateCalendar = (date) => {
    calendarPicker();
    setPickerCurrentDate(new Date(date));
  };

  const ModalContent = () => {
    let content;

    switch (modalContentFlag) {
      case "split_info":
        content = (
          <View style={{ flex: 4, backgroundColor: "transparent", borderRadius: 20, padding: verticalScale(30), gap: 20 }}>
            <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
                <Entypo name="cross" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
            <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: 20 }}>
              <Text style={{ fontSize: 20 }}>Split with: {getSplitName()}</Text>
              <Text style={{ fontSize: 20 }}>Amount: {(value * slider) / 100}</Text>
              <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
            </View>
            <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: 20 }}>
              <Text style={{ fontSize: 20 }}>You: {email}</Text>
              <Text style={{ fontSize: 20 }}>Amount: {(value * (100 - slider)) / 100}</Text>
              <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
            </View>
          </View>
        );
        break;
      default:
        content = (
          <View style={{ flex: 4, backgroundColor: "white", borderRadius: 20, padding: verticalScale(20) }}>
            <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
                <Entypo name="cross" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
            <View style={styles.tableInfo}>
              <Table style={styles.textCenter} borderStyle={{ borderColor: "transparent" }}>
                <Row data={state.tableHead} style={{ alignContent: "center" }} textStyle={styles.textCenterHead} />
                <ScrollView style={styles.scrollTable}>
                  {list.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.rowTable}>
                      {rowData.map((cellData, cellIndex) => (
                        <Cell textStyle={styles.tableText} key={cellIndex} data={cellData} />
                      ))}
                    </TableWrapper>
                  ))}
                </ScrollView>
              </Table>
            </View>
          </View>
        );
    }

    return content;
  };

  return (
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 6 }}>
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
            {ModalContent()}
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
        <CustomButton handlePress={handlePurchase} />
      </View>
    </View>
  );
}
