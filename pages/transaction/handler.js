import { addToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { getSplitEmail } from "../../functions/split";

export const handleTransaction = async (newTransaction, setNewTransaction, destination, email) => {
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

  newTransaction = { ...newTransaction, user_destination_id: _destination };
  await addToStorage(KEYS.TRANSACTION, JSON.stringify([newTransaction]), email);

  setNewTransaction({ ...newTransaction, amount: "", description: "" });

  console.log("Transaction Added: " + newTransaction);
};
