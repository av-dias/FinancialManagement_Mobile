import { saveToStorage, getFromStorage } from "./secureStorage";
import { KEYS } from "../utility/storageKeys";

export const getSplitUser = async (setSplitUser, email) => {
  let splitList = JSON.parse(await getFromStorage(KEYS.SPLIT_USERS, email));

  let value = { email: "Not Registed", name: "Not Registed" };
  if (splitList && splitList.length != 0) value = splitList[0];
  setSplitUser(value);
};

export const getSplitName = (splitUser) => {
  return splitUser.name;
};

export const getSplitEmail = (splitUser) => {
  return splitUser.email;
};
