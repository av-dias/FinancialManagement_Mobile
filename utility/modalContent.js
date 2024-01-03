import { StyleSheet, Text, View, TextInput, Image, Pressable, Dimensions, ScrollView } from "react-native";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../functions/responsive";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import commonStyles from "../utility/commonStyles";
import CustomInput from "../components/customInput/customInput";
import CardWrapper from "../components/cardWrapper/cardWrapper";
import Carrossel from "../components/carrossel/carrossel";
import CustomCalendarStrip from "../components/customCalendarStrip/customCalendarStrip";
import MoneyInputHeader from "../components/moneyInputHeader/moneyInputHeader";
import SplitSlider from "../components/splitSlider/splitSlider";
import CustomButton from "../components/customButton/customButton";

export const ModalPurchase = (list, value, email, modalContentFlag, modalVisible, setModalVisible, splitName, slider, styles) => {
  const state = {
    tableHead: ["Type", "Name", "Value", "Date"],
  };

  let content;

  switch (modalContentFlag) {
    case "split_info":
      content = (
        <View style={{ flex: 4, backgroundColor: "transparent", borderRadius: commonStyles.borderRadius, padding: verticalScale(30), gap: 20 }}>
          <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
            <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
              <Entypo name="cross" size={verticalScale(20)} color="black" />
            </Pressable>
          </View>
          <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
            <Text style={{ fontSize: 15 }}>Split with</Text>
            <Text style={{ fontSize: 15 }}>{splitName}</Text>
            <Text style={{ fontSize: 15 }}>Amount: {(value * slider) / 100}</Text>
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
          </View>
          <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
            <Text style={{ fontSize: 15 }}>You</Text>
            <Text style={{ fontSize: 15 }}>{email}</Text>
            <Text style={{ fontSize: 15 }}>Amount: {(value * (100 - slider)) / 100}</Text>
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
          </View>
        </View>
      );
      break;
    default:
      content = (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: commonStyles.borderRadius,
            padding: verticalScale(20),
            marginVertical: verticalScale(10),
          }}
        >
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

export const ModalList = (
  email,
  purchases,
  setPurchases,
  transactions,
  setTransactions,
  index,
  splitUser,
  refreshTrigger,
  setRefreshTrigger,
  slider,
  setSlider,
  splitStatus,
  setSplitStatus,
  value,
  setValue,
  name,
  setName,
  note,
  setNote,
  type,
  setType,
  description,
  setDescription,
  pickerCurrentDate,
  setPickerCurrentDate,
  modalContentFlag,
  handleEditPurchase,
  handleEditTransaction,
  setEditVisible,
  styles
) => {
  let content;
  switch (modalContentFlag) {
    case "Transaction":
      content = (
        <View style={{ flex: 1 }}>
          <MoneyInputHeader value={String(value)} setValue={setValue} />
          <View style={{ flex: 7, gap: verticalScale(20), paddingTop: verticalScale(20) }}>
            <CustomCalendarStrip pickerCurrentDate={pickerCurrentDate} setPickerCurrentDate={setPickerCurrentDate} />
            <CustomInput
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color="black" />}
              placeholder="Email"
              value={splitUser}
              editable={false}
            />
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />}
              placeholder="Description"
              setValue={setDescription}
              value={description}
            />
          </View>
          <CustomButton
            handlePress={() => {
              handleEditTransaction(
                email,
                transactions,
                setTransactions,
                index,
                value,
                description,
                pickerCurrentDate,
                splitUser,
                refreshTrigger,
                setRefreshTrigger,
                setEditVisible
              );
            }}
          />
        </View>
      );
      break;
    default:
      content = (
        <View style={{ flex: 1 }}>
          <MoneyInputHeader value={value} setValue={setValue} verticalHeight={65} />
          <View style={styles.form}>
            <Carrossel
              type={type}
              setType={(value) => {
                setType(value);
                setName("");
                setNote("");
              }}
              size={verticalScale(90)}
              iconSize={30}
            />
            <CustomCalendarStrip pickerCurrentDate={pickerCurrentDate} setPickerCurrentDate={setPickerCurrentDate} />
            <CustomInput
              noStyle={false}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
              placeholder="Name"
              setValue={setName}
              value={name}
            />
            <CustomInput
              noStyle={false}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
              placeholder="Notes"
              setValue={setNote}
              value={note}
            />
            <SplitSlider
              userInfo={false}
              value={value}
              splitStatus={splitStatus}
              setSplitStatus={setSplitStatus}
              slider={slider}
              setSlider={setSlider}
              size={verticalScale(90)}
            />
          </View>
          <CustomButton
            text="Save"
            handlePress={() => {
              handleEditPurchase(
                email,
                purchases,
                setPurchases,
                index,
                name,
                value,
                type,
                note,
                pickerCurrentDate,
                splitStatus,
                slider,
                splitUser,
                refreshTrigger,
                setRefreshTrigger,
                setEditVisible
              );
            }}
          />
        </View>
      );
      break;
  }

  return content;
};
