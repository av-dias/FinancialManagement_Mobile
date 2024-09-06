import { View } from "react-native";
import { verticalScale } from "../../../../functions/responsive";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

// Components
import CustomInput from "../../../../components/customInput/customInput";
import Carrossel from "../../../../components/carrossel/carrossel";
import CustomCalendarStrip from "../../../../components/customCalendarStrip/customCalendarStrip";
import MoneyInputHeader from "../../../../components/moneyInputHeader/moneyInputHeader";
import SplitSlider from "../../../../components/splitSlider/splitSlider";
import CustomButton from "../../../../components/customButton/customButton";

// Handler
import { handleEditPurchase, handleEditTransaction } from "../../handler";

// Contants
import { KEYS as KEYS_SERIALIZER } from "../../../../utility/keys";

export default function ModalList(email, expense, setSelectedItem, splitUser, sliderStatus, setSliderStatus, setEditVisible, styles, setExpenses) {
  let selectedItem = expense.element;
  switch (expense.key) {
    case KEYS_SERIALIZER.TRANSACTION:
      return (
        <View style={{ flex: 1 }}>
          <MoneyInputHeader
            value={String(selectedItem.amount)}
            setValue={(_amout) => {
              setSelectedItem({
                ...expense,
                element: {
                  ...selectedItem,
                  amount: _amout,
                },
              });
            }}
          />
          <View style={{ flex: 7, gap: verticalScale(20), paddingTop: verticalScale(20) }}>
            <Carrossel
              type={selectedItem.type}
              setType={(_type) => {
                setSelectedItem({ ...expense, element: { ...selectedItem, type: _type } });
              }}
              size={verticalScale(90)}
              iconSize={30}
            />
            <CustomCalendarStrip
              pickerCurrentDate={selectedItem.dot}
              setPickerCurrentDate={(_dot) => {
                setSelectedItem({
                  ...expense,
                  element: {
                    ...selectedItem,
                    dot: new Date(_dot).toISOString().split("T")[0],
                  },
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
                  ...expense,
                  element: {
                    ...selectedItem,
                    description: _description,
                  },
                });
              }}
              value={selectedItem.description}
            />
          </View>
          <CustomButton
            handlePress={() => {
              handleEditTransaction(email, expense, setEditVisible, setExpenses);
            }}
          />
        </View>
      );
    default:
      return (
        <View style={{ flex: 1 }}>
          <MoneyInputHeader
            value={selectedItem.value}
            setValue={(_value) => {
              setSelectedItem({ ...expense, element: { ...selectedItem, value: _value } });
            }}
            verticalHeight={65}
          />
          <View style={styles.form}>
            <Carrossel
              type={selectedItem.type}
              setType={(_type) => {
                setSelectedItem({
                  ...expense,
                  element: {
                    ...selectedItem,
                    type: _type,
                    name: "",
                    note: "",
                  },
                });
              }}
              size={verticalScale(90)}
              iconSize={30}
            />
            <CustomCalendarStrip
              pickerCurrentDate={selectedItem.dop}
              setPickerCurrentDate={(_dop) => {
                setSelectedItem({
                  ...expense,
                  element: {
                    ...selectedItem,
                    dop: new Date(_dop).toISOString().split("T")[0],
                  },
                });
              }}
            />
            <CustomInput
              noStyle={false}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color="black" />}
              placeholder="Name"
              setValue={(_name) => {
                setSelectedItem({
                  ...expense,
                  element: {
                    ...selectedItem,
                    name: _name,
                  },
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
                  ...expense,
                  element: {
                    ...selectedItem,
                    note: _note,
                  },
                });
              }}
              value={selectedItem.note}
            />
            <SplitSlider
              userInfo={false}
              value={selectedItem.value}
              splitStatus={sliderStatus}
              setSplitStatus={setSliderStatus}
              slider={"split" in selectedItem ? selectedItem.split.weight : 50}
              setSlider={(_slider) => {
                setSelectedItem({ ...expense, element: { ...selectedItem, split: { weight: _slider, userId: splitUser } } });
              }}
              size={verticalScale(90)}
            />
          </View>
          <CustomButton
            text="Save"
            handlePress={() => {
              handleEditPurchase(email, expense, sliderStatus, setEditVisible, setExpenses);
            }}
          />
        </View>
      );
  }
}
