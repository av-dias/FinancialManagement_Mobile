import navLogo from "../../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { color } from "../../utility/colors";
import { Divider } from "react-native-paper";
import { Slider } from "@rneui/themed";

import React, { useState, useEffect } from "react";
import CalendarStrip from "react-native-calendar-strip";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

import { saveToStorage, getFromStorage } from "../../utility/secureStorage";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../utility/responsive";
import { _styles } from "./style";
import { categoryIcons } from "../../assets/icons";
import Header from "../../components/header/header";
import ModalCustom from "../../components/modal/modal";
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

  const getUser = async () => {
    try {
      const email = await getFromStorage("email");
      return email;
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  const handlePurchase = async () => {
    let date = this._calendar.getSelectedDate();
    console.log(type, name, value, date);
    if (type == "" || name == "" || value == "" || date == "" || !date) {
      alert("Please fill all fields.");
      return;
    }
    if (!note) setNote("");
    try {
      let purchases = await getFromStorage("purchases", email);
      let newPurchase = { type: type, name: name, value: value, dop: date.toISOString().split("T")[0], note: note };

      if (purchases) {
        purchases = JSON.parse(purchases);
        purchases.push(newPurchase);
      } else {
        purchases = [newPurchase];
      }

      await saveToStorage("purchases", JSON.stringify(purchases), email);
      setList([
        [categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === type).icon, name, value, date.toISOString().split("T")[0]],
        ...list,
      ]);
      this.textInputValue.clear();
      this.textInputNote.clear();
      setValue("");
      setNote("");

      console.log("Purchase: " + purchases);
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
          <View style={{ flex: 4, backgroundColor: "white", borderRadius: 20, padding: verticalScale(20) }}>
            <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
                <Entypo name="cross" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
            <View style={{ flex: 1, padding: verticalScale(20) }}>
              <Text style={{ textAlign: "center", fontSize: 20 }}>Send to: al.vrdias@gmail.com</Text>
              <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}>
                <Text style={{ textAlign: "center", fontSize: 20 }}>Pending Amount: {(value * slider) / 100}</Text>
                <Text style={{ textAlign: "center", fontSize: 20 }}>Your Amount: {(value * (100 - slider)) / 100}</Text>
              </View>
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
            <View style={styles.rowNoBorder}>
              <Text style={styles.symbolBig}>+</Text>
              <TextInput
                ref={(input) => {
                  this.textInputValue = input;
                }}
                keyboardType="numeric"
                style={styles.valueInput}
                placeholder="0"
                onChangeText={setValue}
              />
              <Text style={styles.symbolBig}>€</Text>
            </View>

            <View style={{ backgroundColor: "transparent", height: "15%", maxHeight: 100, borderRadius: BORDER_RADIUS }}>
              <ScrollView
                horizontal={true}
                rowGap={20}
                style={styles.categoryScrollContainer}
                contentContainerStyle={{
                  gap: verticalScale(10),
                  paddingHorizontal: 1,
                  paddingVertical: 10,
                }}
              >
                {categoryIcons().map((iconComponent) => {
                  return (
                    <CardWrapper
                      key={iconComponent.label}
                      style={{ backgroundColor: type == iconComponent.label ? color.secundary : color.complementary }}
                    >
                      <Pressable
                        key={iconComponent.label}
                        style={{
                          ...styles.categoryContainer,
                        }}
                        onPress={() => {
                          setType(iconComponent.label);
                          this.textInputName.clear();
                        }}
                      >
                        <View style={styles.categoryIconContainer}>{iconComponent.icon}</View>
                        <Text style={styles.iconLabel}>{iconComponent.label}</Text>
                      </Pressable>
                    </CardWrapper>
                  );
                })}
              </ScrollView>
            </View>

            <CalendarStrip
              ref={(component) => (this._calendar = component)}
              selectedDate={pickerCurrentDate}
              calendarAnimation={{ type: "sequence", duration: 15 }}
              daySelectionAnimation={{ type: "border", duration: 100, borderWidth: 1, borderHighlightColor: color.calendarBorder }}
              style={{ height: "15%", backgroundColor: color.complementary, borderRadius: BORDER_RADIUS, elevation: 2 }}
              calendarHeaderStyle={{
                color: "black",
                marginTop: 5,
                padding: horizontalScale(3),
                fontSize: verticalScale(15),
                borderWidth: 1,
                borderRadius: BORDER_RADIUS,
                borderColor: "white",
                backgroundColor: "white",
                elevation: 2,
              }}
              calendarColor={"transparent"}
              dateNumberStyle={{ color: "black", fontSize: verticalScale(15) }}
              dateNameStyle={{ color: "black", fontSize: verticalScale(10) }}
              highlightDateNumberStyle={{ color: color.secundary, fontSize: verticalScale(20) }}
              highlightDateNameStyle={{ color: color.secundary }}
              disabledDateNameStyle={{ color: "grey" }}
              disabledDateNumberStyle={{ color: "grey" }}
              iconContainer={{ flex: 0.1 }}
              startFromMonday={true}
              scrollable={true}
              scrollerPaging={true}
              onHeaderSelected={() => {
                calendarPicker();
              }}
            />
            {datePicker ? null : (
              <CardWrapper
                style={{
                  position: "absolute",
                  top: "30%",
                  alignSelf: "center",
                  zIndex: 1,
                }}
              >
                <CalendarPicker
                  width={horizontalScale(345)}
                  onDateChange={(date) => {
                    changeDateCalendar(date);
                  }}
                  todayBackgroundColor="transparent"
                  todayTextStyle={{
                    color: "gray",
                    fontWeight: "bold",
                    padding: 5,
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                  monthYearHeaderWrapperStyle={{
                    color: "black",
                    borderWidth: 1,
                    borderRadius: BORDER_RADIUS,
                    padding: horizontalScale(3),
                    borderColor: "white",
                    backgroundColor: "white",
                  }}
                  monthTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15) }}
                  yearTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15) }}
                  selectedDayColor="red"
                  startFromMonday={true}
                  initialDate={pickerCurrentDate}
                />
                <View style={{ marginTop: -verticalScale(26) }}>
                  <Pressable
                    style={{ alignSelf: "flex-end", backgroundColor: "transparent", marginTop: -verticalScale(5) }}
                    onPress={() => {
                      changeDateCalendar(pickerCurrentDate);
                    }}
                  >
                    <AntDesign style={{ padding: verticalScale(5) }} name="closecircle" size={verticalScale(20)} color="black" />
                  </Pressable>
                </View>
              </CardWrapper>
            )}

            <CardWrapper
              style={{
                gap: 10,
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <View style={{ ...styles.row, backgroundColor: "transparent" }}>
                <MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Name"
                  ref={(input) => {
                    this.textInputName = input;
                  }}
                  onChangeText={setName}
                />
              </View>

              <View style={{ ...styles.row, backgroundColor: "transparent" }}>
                <MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Notes"
                  ref={(input) => {
                    this.textInputNote = input;
                  }}
                  onChangeText={setNote}
                />
              </View>
            </CardWrapper>
            <CardWrapper
              style={{
                flex: 2,
                maxHeight: HEIGHT > heightTreshold ? 150 : 100,
                paddingVertical: verticalScale(10),
                backgroundColor: splitStatus ? "white" : "gray",
                gap: verticalScale(10),
              }}
            >
              <View style={{ backgroundColor: "transparent" }}>
                <Pressable
                  disabled={splitStatus ? false : true}
                  onPress={() => {
                    setModalVisible(true);
                    setModalContentFlag("split_info");
                  }}
                  style={{ position: "absolute", right: 0, width: 30, padding: 5, backgroundColor: "transparent", alignItems: "center" }}
                >
                  <AntDesign name="plus" size={20} color="black" />
                </Pressable>
              </View>
              <Pressable
                style={{
                  ...styles.button,
                  backgroundColor: splitStatus ? color.secundary : "lightgray",
                  width: "30%",
                  maxWidth: 100,
                  alignSelf: "center",
                }}
                onPress={() => {
                  setSplitStatus(!splitStatus);
                  setSlider(50);
                }}
              >
                <Text>Split {splitStatus ? slider + "%" : ""}</Text>
              </Pressable>
              <View style={{ paddingHorizontal: 20 }}>
                <Slider
                  value={slider}
                  onValueChange={setSlider}
                  maximumValue={100}
                  minimumValue={0}
                  step={1}
                  disabled={splitStatus ? false : true}
                  allowTouchTrack={!splitStatus ? false : true}
                  trackStyle={{ height: 5, backgroundColor: "transparent" }}
                  thumbStyle={{ height: verticalScale(32), width: verticalScale(32), backgroundColor: "transparent" }}
                  thumbProps={{
                    children: <AntDesign name="pausecircle" size={verticalScale(30)} color="black" />,
                  }}
                />
              </View>
            </CardWrapper>
          </View>
        </View>
        <View style={styles.submitButton}>
          <Pressable style={styles.button} onPress={handlePurchase}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
