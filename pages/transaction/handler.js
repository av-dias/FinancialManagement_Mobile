import { addToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { getSplitEmail } from "../../functions/split";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { addExpenses } from "../../functions/expenses";

export const handleTransaction = async (newTransaction, setNewTransaction, destination, receivedActive, email, setExpenses) => {
  let _destination = getSplitEmail(destination);
  if (
    _destination == "" ||
    !newTransaction.amount ||
    newTransaction.amount == "" ||
    !newTransaction.description ||
    newTransaction.description == "" ||
    !newTransaction.dot ||
    newTransaction.dot == ""
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (!_destination || _destination == "" || _destination == "Not Registed") {
    alert("Please register a split user on the settings.");
    return;
  }

  if (!newTransaction.type || newTransaction.type == "") newTransaction.type = "Other";

  if (!receivedActive) {
    newTransaction = { ...newTransaction, user_destination_id: _destination };
  } else {
    newTransaction = { ...newTransaction, user_origin_id: _destination, user_destination_id: email };
  }

  await addToStorage(KEYS.TRANSACTION, JSON.stringify([newTransaction]), email);
  addExpenses(newTransaction, KEYS_SERIALIZER.TRANSACTION, setExpenses);

  setNewTransaction({ ...newTransaction, amount: "", description: "" });

  console.log("Transaction Added: " + newTransaction);
};
