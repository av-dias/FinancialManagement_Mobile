import { getFromStorage } from "./secureStorage";
import { KEYS } from "../utility/storageKeys";

export const getTransactionCount = async (email) => {
  let transactions = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));

  return transactions.length;
};
