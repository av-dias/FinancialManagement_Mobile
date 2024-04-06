import { getFromStorage } from "./secureStorage";
import { KEYS } from "../utility/storageKeys";

export const getTransactionCount = async (email) => {
  let transactions = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));

  return transactions.length;
};

export const getTransactions = async (email) => {
  try {
    let transactions = JSON.parse(await getFromStorage(KEYS.TRANSACTION, email));
    return transactions;
  } catch (e) {
    return [];
  }
};

export const getMonthTransactionStats = async (transactions, currentMonth, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    } else if (new Date(t.dot).getMonth() == currentMonth && new Date(t.dot).getFullYear() == currentYear) {
      if (t.user_origin_id) acc[t.type] = parseFloat(acc[t.type] || 0) + parseFloat(t.amount);
      else acc[t.type] = parseFloat(acc[t.type] || 0) - parseFloat(t.amount);
    }
    return acc;
  }, {});

  return res;
};

export const getMonthTransactionTotal = async (transactions, currentMonth, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    } else if (new Date(t.dot).getMonth() == currentMonth && new Date(t.dot).getFullYear() == currentYear) {
      if (t.user_origin_id) return parseFloat(acc) + parseFloat(t.amount);
      else return parseFloat(acc) - parseFloat(t.amount);
    }
    return parseFloat(acc);
  }, 0);
  return parseFloat(res).toFixed(0);
};
