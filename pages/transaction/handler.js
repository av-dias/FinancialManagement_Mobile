import { addToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { getSplitEmail } from "../../functions/split";

export const handleTransaction = async (newTransaction, setNewTransaction, destination, receivedActive, email, triggerReloadTransaction) => {
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

  setNewTransaction({ ...newTransaction, amount: "", description: "" });
  triggerReloadTransaction(new Date(newTransaction.dot).getMonth(), new Date(newTransaction.dot).getFullYear());

  console.log("Transaction Added: " + newTransaction);
};
