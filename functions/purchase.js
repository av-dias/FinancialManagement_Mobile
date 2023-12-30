import { getFromStorage } from "./secureStorage";
import { STATS_TYPE } from "../utility/keys";

export const getPurchaseStats = async (email, currentMonth, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, { type, value, dop, split }) => {
    if (statsType == STATS_TYPE[1] && split) {
      value = (value * (100 - split.weight)) / 100;
    }
    if (new Date(dop).getMonth() == currentMonth && new Date(dop).getFullYear() == currentYear) {
      acc[type] = parseFloat(acc[type] || 0) + parseFloat(value);
    }
    return acc;
  }, {});

  return res;
};

export const getPurchaseTotal = async (email, currentMonth, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, curr) => {
    if (statsType == STATS_TYPE[1] && curr.split) {
      curr.value = (curr.value * (100 - curr.split.weight)) / 100;
    }
    if (new Date(curr.dop).getMonth() == currentMonth && new Date(curr.dop).getFullYear() == currentYear) {
      return parseFloat(acc) + parseFloat(curr.value);
    }
    return parseFloat(acc);
  }, 0);
  return parseFloat(res).toFixed(0);
};
