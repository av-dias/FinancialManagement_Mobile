import { Text, View, Pressable } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";

//Context
import { AppContext } from "../../store/app-context";

//Custom Components
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import ModalCustom from "../../components/modal/modal";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import SplitSlider from "../../components/splitSlider/splitSlider";
import CustomInput from "../../components/customInput/customInput";
import Carrossel from "../../components/carrossel/carrossel";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import { dark } from "../../utility/colors";

//Custom Constants
import { _styles } from "./style";

//Functions
import { getUser } from "../../functions/basic";
import { handlePurchase, modalContent } from "./handler";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { PurchaseType } from "../../models/types";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";

type PurchaseProps = {
  handleEdit?: (purchase: PurchaseType, splitStatus: boolean, slider: number, splitEmail) => void;
  purchase?: PurchaseType;
};

export default function Purchase({ handleEdit, purchase }: PurchaseProps) {
  const styles = _styles;

  const [email, setEmail] = useState("");
  const [newPurchase, setNewPurchase] = useState<PurchaseType>(
    purchase || {
      value: "",
      name: "",
      type: "",
      description: "",
      note: "",
      dop: new Date().toISOString().split("T")[0].toString(),
      split: null,
    }
  );

  const [slider, setSlider] = useState<number>(Number(purchase?.split?.weight) || 50);
  const [splitStatus, setSplitStatus] = useState<boolean>(purchase?.split !== undefined || false);
  const [splitUser, setSplitUser] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [list, setList] = useState([]);

  const [refundActive, setRefundActive] = useState<boolean>(purchase?.note == "Refund" || false);

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
    <View style={{ flex: 1 }}>
      {modalVisible && (
        <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible}>
          {modalContent(list, newPurchase.value, email, modalContentFlag, modalVisible, setModalVisible, getSplitEmail(splitUser), slider)}
        </ModalCustom>
      )}
      <View style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}>
        <Pressable
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: refundActive ? dark.secundary : dark.complementary,
            borderRadius: 10,
            zIndex: 1,
          }}
          onPress={() => {
            setRefundActive(!refundActive);
          }}
        >
          <Text style={styles.text}>Refund</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newPurchase.value}
          setValue={(_value) => {
            setNewPurchase({ ...newPurchase, value: _value });
          }}
          signal={refundActive ? "-" : "+"}
        />
        <Carrossel
          type={newPurchase.type}
          setType={(_type) => {
            setNewPurchase({ ...newPurchase, type: _type });
          }}
          size={verticalScale(90)}
          iconSize={30}
        />
        <View style={styles.form}>
          <FlatCalendar
            setInputBuyDate={(_date) => {
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
              Icon={<MaterialIcons style={styles.iconCenter} name="drive-file-rename-outline" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Name"
              setValue={(_name) => {
                setNewPurchase({ ...newPurchase, name: _name });
              }}
              value={newPurchase.name}
            />
            <CustomInput
              noStyle={true}
              Icon={<MaterialIcons style={styles.iconCenter} name="notes" size={verticalScale(20)} color={dark.textPrimary} />}
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
          addStyle={{ top: handleEdit ? 15 : 0 }}
          handlePress={() => {
            handleEdit
              ? handleEdit(newPurchase, splitStatus, slider, getSplitEmail(splitUser))
              : handlePurchase(email, newPurchase, setNewPurchase, splitStatus, setSplitStatus, getSplitEmail(splitUser), slider, setList, refundActive, setRefundActive, appCtx.setExpenses);
          }}
        />
      </View>
    </View>
  );
}
