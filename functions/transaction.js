import { getFromStorage } from "./secureStorage";
import { KEYS } from "../utility/storageKeys";

export const getAllTransactionsStats = async (email) => {
  try {
    let transactions = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));
    if (!transactions) return [];
    return transactions;
  } catch (e) {
    return [];
  }
};
