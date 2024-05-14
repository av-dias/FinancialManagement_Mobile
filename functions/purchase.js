import { getFromStorage } from "./secureStorage";
import { KEYS } from "../utility/storageKeys";

export const getAllPurchaseStats = async (email) => {
  try {
    let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));
    if (!purchases) return [];
    return purchases;
  } catch (e) {
    return [];
  }
};
