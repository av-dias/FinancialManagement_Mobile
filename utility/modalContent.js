import { Text, View, Pressable, ScrollView } from "react-native";
import { verticalScale } from "../functions/responsive";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import commonStyles from "../utility/commonStyles";
import CustomInput from "../components/customInput/customInput";
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
  index,
  selectedItem,
  setSelectedItem,
  splitUser,
  refreshTrigger,
  setRefreshTrigger,
  slider,
  setSlider,
  splitStatus,
  setSplitStatus,
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
          <MoneyInputHeader
            value={String(selectedItem.amount)}
            setValue={(_amout) => {
              setSelectedItem({
                ...selectedItem,
                amount: _amout,
              });
            }}
          />
          <View style={{ flex: 7, gap: verticalScale(20), paddingTop: verticalScale(20) }}>
            <CustomCalendarStrip
              pickerCurrentDate={selectedItem.date}
              setPickerCurrentDate={(_dot) => {
                setSelectedItem({
                  ...selectedItem,
                  date: new Date(_dot).toISOString().split("T")[0],
                });
              }}
            />
            <CustomInput
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color="black" />}
              placeholder="Email"
              value={splitUser}
              editable={false}
            />
            <CustomInput
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color="black" />}
              placeholder="Description"
              setValue={(_description) => {
                setSelectedItem({
                  ...selectedItem,
                  description: _description,
                });
              }}
              value={selectedItem.description}
            />
          </View>
          <CustomButton
            handlePress={() => {
              handleEditTransaction(email, index, selectedItem, splitUser, refreshTrigger, setRefreshTrigger, setEditVisible);
            }}
          />
        </View>
      );
      break;
    default:
      content = (
        <View style={{ flex: 1 }}>
          <MoneyInputHeader
            value={selectedItem.value}
            setValue={(_value) => {
              setSelectedItem({
                ...selectedItem,
                value: _value,
              });
            }}
            verticalHeight={65}
          />
          <View style={styles.form}>
            <Carrossel
              type={selectedItem.type}
              setType={(_type) => {
                setSelectedItem({
                  ...selectedItem,
                  type: _type,
                  name: "",
                  note: "",
                });
              }}
              size={verticalScale(90)}
              iconSize={30}
            />
            <CustomCalendarStrip
              pickerCurrentDate={selectedItem.date}
              setPickerCurrentDate={(_dop) => {
                setSelectedItem({
                  ...selectedItem,
                  date: new Date(_dop).toISOString().split("T")[0],
                });
              }}
            />
            <CustomInput
              noStyle={false}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
              placeholder="Name"
              setValue={(_name) => {
                setSelectedItem({
                  ...selectedItem,
                  name: _name,
                });
              }}
              value={selectedItem.name}
            />
            <CustomInput
              noStyle={false}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
              placeholder="Notes"
              setValue={(_note) => {
                setSelectedItem({
                  ...selectedItem,
                  note: _note,
                });
              }}
              value={selectedItem.note}
            />
            <SplitSlider
              userInfo={false}
              value={selectedItem.value}
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
              handleEditPurchase(email, index, selectedItem, splitStatus, splitUser, slider, refreshTrigger, setRefreshTrigger, setEditVisible);
            }}
          />
        </View>
      );
      break;
  }

  return content;
};
