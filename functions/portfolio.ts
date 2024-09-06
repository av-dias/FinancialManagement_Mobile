import { ReactNode } from "react";
import { KEYS } from "../utility/storageKeys";
import { getFromStorage } from "./secureStorage";

export const getPortfolio = async (email: string) => {
  try {
    let portfolio = JSON.parse(await getFromStorage(KEYS.PORTFOLIO, email));
    if (!portfolio) return [];
    return portfolio;
  } catch (e) {
    return [];
  }
};
