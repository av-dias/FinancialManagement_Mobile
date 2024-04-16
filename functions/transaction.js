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

export const getAllTransactionsStats = async (email) => {
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
      if (t.user_origin_id) acc[t.type] = parseFloat(acc[t.type] || 0) - parseFloat(t.amount);
      else acc[t.type] = parseFloat(acc[t.type] || 0) + parseFloat(t.amount);
    }
    return acc;
  }, {});

  return res;
};

export const getTransactionStats = async (transactions, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    } else if (new Date(t.dot).getFullYear() == currentYear) {
      if (t.user_origin_id) acc[t.type] = parseFloat(acc[t.type] || 0) - parseFloat(t.amount);
      else acc[t.type] = parseFloat(acc[t.type] || 0) + parseFloat(t.amount);
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
      if (t.user_origin_id) return parseFloat(acc) - parseFloat(t.amount);
      else return parseFloat(acc) + parseFloat(t.amount);
    }
    return parseFloat(acc);
  }, 0);
  return parseFloat(res).toFixed(0);
};

export const getTransactionTotal = async (transactions, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    }
    if (new Date(t.dot).getFullYear() == currentYear) {
      let month = new Date(t.dot).getMonth();
      if (t.user_origin_id) acc[month] = parseFloat(acc[month] || 0) - parseFloat(t.amount);
      else acc[month] = parseFloat(acc[month] || 0) + parseFloat(t.amount);
    }
    return acc;
  }, {});

  return res;
};

export const getTransactionTotalReceived = async (transactions, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    }
    if (new Date(t.dot).getFullYear() == currentYear) {
      let month = new Date(t.dot).getMonth();
      if (t.user_origin_id) acc[month] = parseFloat(acc[month] || 0) - parseFloat(t.amount);
    }
    return acc;
  }, {});

  return res;
};

export const getTransactionTotalSent = async (transactions, currentYear) => {
  const res = transactions.reduce((acc, t) => {
    if (!t.type) {
      return acc;
    }
    if (new Date(t.dot).getFullYear() == currentYear) {
      let month = new Date(t.dot).getMonth();
      if (!t.user_origin_id) acc[month] = parseFloat(acc[month] || 0) + parseFloat(t.amount);
    }
    return acc;
  }, {});

  return res;
};
