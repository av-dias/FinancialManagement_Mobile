import React, { useState, useContext } from "react";
import { View, Pressable, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

//Custom Components
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomInput from "../../components/customInput/customInput";
import CustomCalendarStrip from "../../components/customCalendarStrip/customCalendarStrip";
import CustomButton from "../../components/customButton/customButton";
import Carrossel from "../../components/carrossel/carrossel";

//Context
import { AppContext } from "../../store/app-context";

//Custom Constants
import { _styles } from "./style";
import { dark } from "../../utility/colors";

//Functions
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { getUser } from "../../functions/basic";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { handleTransaction } from "./handler";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { TransactionType } from "../../models/types";

type TransactionProps = {
  handleEdit?: (newTransaction: TransactionType, receivedActive: boolean, destination: string) => void;
  transaction?: TransactionType;
};

const loadReceivedActive = (transaction: TransactionType) => {
  if (!transaction) return false;
  if (transaction?.user_origin_id) return true;
  return false;
};

export default function Transaction({ handleEdit, transaction }: TransactionProps) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [receivedActive, setReceivedActive] = useState<boolean>(loadReceivedActive(transaction));
  const [destination, setDestination] = useState("");
  const [newTransaction, setNewTransaction] = useState<TransactionType>(
    transaction || {
      amount: "",
      type: "",
      description: "",
      user_destination_id: null,
      user_origin_id: null,
      dot: new Date().toISOString().split("T")[0].toString(),
    }
  );

  const appCtx = useContext(AppContext);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        let email = await getUser();
        setEmail(email);

        await getSplitUser(setDestination, email);
        try {
        } catch (e) {
          console.log("Transaction: " + e);
        }
      }
      fetchData();
    }, [email])
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: "absolute", right: 0, paddingTop: 50, gap: 10 }}>
        <Pressable
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: receivedActive ? dark.secundary : dark.complementary,
            borderRadius: 10,
            zIndex: 1,
          }}
          onPress={() => {
            setReceivedActive(!receivedActive);
          }}
        >
          <Text style={styles.text}>Received</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newTransaction.amount}
          setValue={(_amount) => {
            setNewTransaction({ ...newTransaction, amount: _amount });
          }}
        />
        <Carrossel
          type={newTransaction.type}
          setType={(_type) => {
            setNewTransaction({ ...newTransaction, type: _type });
          }}
          size={verticalScale(90)}
          iconSize={30}
        />
        <View style={styles.form}>
          <CustomCalendarStrip
            pickerCurrentDate={newTransaction.dot}
            setPickerCurrentDate={(_date) => {
              setNewTransaction({ ...newTransaction, dot: new Date(_date).toISOString().split("T")[0] });
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
              placeholder="Description"
              setValue={(_description) => {
                setNewTransaction({ ...newTransaction, description: _description });
              }}
              value={newTransaction.description}
            />
            <CustomInput
              noStyle={true}
              Icon={<Entypo style={styles.iconCenter} name="email" size={verticalScale(20)} color={dark.textPrimary} />}
              placeholder="Email"
              value={getSplitEmail(destination)}
              setValue={() => {}}
              editable={false}
            />
          </CardWrapper>
        </View>
        <CustomButton
          handlePress={() => {
            handleEdit ? handleEdit(newTransaction, receivedActive, destination) : handleTransaction(newTransaction, setNewTransaction, destination, receivedActive, email, appCtx.setExpenses);
          }}
        />
      </View>
    </View>
  );
}
