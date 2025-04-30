import React, { useState, useContext } from "react";
import { View, Pressable, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

//Custom Components
import MoneyInputHeader from "../../components/moneyInputHeader/moneyInputHeader";
import CustomButton from "../../components/customButton/customButton";
import Carrossel from "../../components/carrossel/carrossel";

//Context
import { UserContext } from "../../store/user-context";

//Custom Constants
import { _styles } from "./style";
import { dark } from "../../utility/colors";

//Functions
import { verticalScale } from "../../functions/responsive";
import { getSplitUser, getSplitEmail } from "../../functions/split";
import { FlatCalendar } from "../../components/flatCalender/FlatCalender";
import { clearTransactionEntity, TransactionEntity, TransactionOperation } from "../../store/database/Transaction/TransactionEntity";
import { ExpensesService } from "../../service/ExpensesService";
import DualTextInput, { textInputType } from "../../components/DualTextInput/DualTextInput";

type TransactionProps = {
  transaction?: TransactionEntity;
  callback?: () => void;
};

export default function Transaction({ transaction, callback }: TransactionProps) {
  const styles = _styles;
  const expenseService = new ExpensesService();
  const email = useContext(UserContext).email;

  const [newTransaction, setNewTransaction] = useState<TransactionEntity>(transaction || clearTransactionEntity(null, email));
  const [destination, setDestination] = useState({ email: "", name: "" });

  const inputConfig: textInputType[] = [
    {
      value: newTransaction.description,
      setValue: (_description) => {
        setNewTransaction({ ...newTransaction, description: _description });
      },
      onBlurHandle: () =>
        setNewTransaction((prev) => ({
          ...prev,
          name: prev.description.trimEnd().trimStart(),
        })),
      placeholder: "Description",
      icon: <MaterialIcons style={{ display: "flex", justifyContent: "center", alignSelf: "center" }} name="notes" size={verticalScale(12)} color={dark.textPrimary} />,
    },
    {
      value: getSplitEmail(destination),
      setValue: () => {},
      onBlurHandle: () => {},
      placeholder: "Email",
      icon: <Entypo style={styles.iconCenter} name="email" size={verticalScale(10)} color={dark.textPrimary} />,
      editable: false,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
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
            backgroundColor: newTransaction.transactionType === TransactionOperation.RECEIVED ? dark.secundary : dark.complementary,
            borderRadius: 10,
            zIndex: 1,
          }}
          onPress={() => {
            newTransaction.transactionType === TransactionOperation.RECEIVED
              ? setNewTransaction({ ...newTransaction, transactionType: TransactionOperation.SENT })
              : setNewTransaction({ ...newTransaction, transactionType: TransactionOperation.RECEIVED });
          }}
        >
          <Text style={styles.text}>Received</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <MoneyInputHeader
          value={newTransaction.amount.toString()}
          setValue={(_amount) => {
            setNewTransaction({ ...newTransaction, amount: Number(_amount) });
          }}
          onBlurHandle={() =>
            setNewTransaction((prev) => ({
              ...prev,
              amount: Number(prev.amount),
            }))
          }
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
          <FlatCalendar
            date={newTransaction.date}
            setInputBuyDate={(_date) => {
              setNewTransaction({ ...newTransaction, date: new Date(_date).toISOString().split("T")[0] });
            }}
          />
          <DualTextInput values={inputConfig} direction="column" />
        </View>
        <CustomButton
          handlePress={async () => {
            try {
              await expenseService.createTransaction({ ...newTransaction, userTransactionId: destination.email });
              setNewTransaction(clearTransactionEntity(newTransaction));
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
