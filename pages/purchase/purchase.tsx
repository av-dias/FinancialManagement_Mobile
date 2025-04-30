import { Text, View, Pressable } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";

//Context
import { UserContext } from "../../store/user-context";

//Custom Components
import CustomButton from "../../components/customButton/customButton";
import SplitSlider from "../../components/splitSlider/splitSlider";
import Carrossel from "../../components/carrossel/carrossel";
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import { dark } from "../../utility/colors";

//Custom Constants
import { _styles } from "./style";

//Functions
import { getSplitUser } from "../../functions/split";
import { verticalScale } from "../../functions/responsive";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";
import { clearPurchaseEntity, PurchaseEntity } from "../../store/database/Purchase/PurchaseEntity";
import { ExpensesService } from "../../service/ExpensesService";
import DualTextInput, { textInputType } from "../../components/DualTextInput/DualTextInput";

type PurchaseProps = {
  purchase?: PurchaseEntity;
  callback?: () => void;
};

export default function Purchase({ purchase, callback }: PurchaseProps) {
  const styles = _styles;
  const expenseService = new ExpensesService();
  const email = useContext(UserContext).email;

  const [newPurchase, setNewPurchase] = useState<PurchaseEntity>(purchase || clearPurchaseEntity(null, email));
  const [slider, setSlider] = useState<number>(Number(purchase?.split?.weight) || 50);
  const [splitStatus, setSplitStatus] = useState<boolean>((purchase !== undefined && purchase?.split !== null) || false);
  const [splitUser, setSplitUser] = useState({ email: "", value: "" });

  const inputConfig: textInputType[] = [
    {
      value: newPurchase.name,
      setValue: (_name) => setNewPurchase((prev) => ({ ...prev, name: _name })),
      onBlurHandle: () =>
        setNewPurchase((prev) => ({
          ...prev,
          name: prev.name.trimEnd().trimStart(),
        })),
      placeholder: "Name",
      icon: <MaterialIcons style={{ display: "flex", justifyContent: "center", alignSelf: "center" }} name="notes" size={verticalScale(12)} color={dark.textPrimary} />,
    },
    {
      value: newPurchase.note,
      setValue: (_note) => setNewPurchase((prev) => ({ ...prev, note: _note })),
      onBlurHandle: () =>
        setNewPurchase((prev) => ({
          ...prev,
          note: prev.note.trimEnd().trimStart(),
        })),
      placeholder: "Note",
      icon: <MaterialIcons style={{ display: "flex", justifyContent: "center", alignSelf: "center" }} name="drive-file-rename-outline" size={verticalScale(12)} color={dark.textPrimary} />,
    },
  ];

  useEffect(() => {
    async function fetchData() {
      await getSplitUser(setSplitUser, email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, [email]);

  useEffect(() => {
    async function fetchSplit() {
      if (splitStatus) {
        setNewPurchase({ ...newPurchase, split: { userId: splitUser.email, weight: slider } });
      } else {
        setNewPurchase({ ...newPurchase, split: undefined });
      }
    }
    // write your code here, it's like componentWillMount
    fetchSplit();
  }, [splitStatus, slider]);

  useEffect(() => {
    async function load() {
      if (!newPurchase?.split) {
        setSplitStatus(false);
      }
    }
    load();
  }, [newPurchase]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}>
        <Pressable
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: newPurchase.isRefund ? dark.secundary : dark.complementary,
            borderRadius: 10,
            zIndex: 1,
          }}
          onPress={() => {
            setNewPurchase({ ...newPurchase, isRefund: !newPurchase.isRefund });
          }}
        >
          <Text style={styles.text}>Refund</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newPurchase.amount.toString()}
          setValue={(_value) => {
            setNewPurchase({ ...newPurchase, amount: _value });
          }}
          onBlurHandle={() =>
            setNewPurchase((prev) => ({
              ...prev,
              amount: Number(prev.amount),
            }))
          }
          signal={newPurchase.isRefund ? "-" : "+"}
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
            date={newPurchase.date}
            setInputBuyDate={(_date) => {
              setNewPurchase({ ...newPurchase, date: _date.toISOString().split("T")[0] });
            }}
          />
          <DualTextInput values={inputConfig} />
          <SplitSlider value={newPurchase.amount} splitStatus={splitStatus} setSplitStatus={setSplitStatus} slider={slider} setSlider={setSlider} size={verticalScale(40)} />
        </View>
        <CustomButton
          addStyle={{ top: 0 }}
          handlePress={async () => {
            try {
              await expenseService.createPurchase(newPurchase);
              setNewPurchase(clearPurchaseEntity(newPurchase));
              callback && callback();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </View>
    </View>
  );
}
