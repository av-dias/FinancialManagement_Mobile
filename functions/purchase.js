import { getFromStorage } from "./secureStorage";
import { STATS_TYPE } from "../utility/keys";
import { KEYS } from "../utility/storageKeys";

export const getMonthPurchaseStats = async (email, currentMonth, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));

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

export const getPurchaseStats = async (email, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));

  const res = purchases.reduce((acc, { type, value, dop, split }) => {
    if (statsType == STATS_TYPE[1] && split) {
      value = (value * (100 - split.weight)) / 100;
    }
    if (new Date(dop).getFullYear() == currentYear) {
      acc[type] = parseFloat(acc[type] || 0) + parseFloat(value);
    }
    return acc;
  }, {});

  return res;
};

export const getMonthPurchaseTotal = async (email, currentMonth, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));

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

export const getPurchaseTotal = async (email, currentYear, statsType) => {
  let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));

  const res = purchases.reduce((acc, { value, dop, split }) => {
    if (statsType == STATS_TYPE[1] && split) {
      value = (value * (100 - split.weight)) / 100;
    }
    if (new Date(dop).getFullYear() == currentYear) {
      let month = new Date(dop).getMonth();
      acc[month] = parseFloat(acc[month] || 0) + parseFloat(value);
    }
    return acc;
  }, {});

  return res;
};

export const getPurchaseAverage = async (email, currentYear, statsType) => {
  let purchasesStats,
    purchaseAverage = {};
  let usedMonthsCount = 0;
  for (let i = 0; i < 12; i++) {
    purchasesStats = await getMonthPurchaseStats(email, i, currentYear, statsType);
    if (JSON.stringify(purchasesStats) != "{}") usedMonthsCount++;
    for (const stat of Object.keys(purchasesStats)) {
      if (purchaseAverage[stat]) {
        purchaseAverage[stat] += purchasesStats[stat];
      } else {
        purchaseAverage[stat] = purchasesStats[stat];
      }
    }
  }

  for (const stat of Object.keys(purchaseAverage)) {
    purchaseAverage[stat] = purchaseAverage[stat] / usedMonthsCount;
  }

  return purchaseAverage;
};

export const getPurchaseAverageTotal = async (email, currentYear, statsType) => {
  let purchasesTotal = 0,
    purchaseAverageTotal = 0;
  usedMonthsCount = 0;

  for (let i = 0; i < 12; i++) {
    purchasesTotal = parseInt(await getMonthPurchaseTotal(email, i, currentYear, statsType));
    purchaseAverageTotal += purchasesTotal;

    if (String(purchasesTotal) != "0") usedMonthsCount++;
  }

  return parseInt(purchaseAverageTotal) / parseInt(usedMonthsCount);
};

export const getPurchaseCount = async (email) => {
  let purchases = JSON.parse(await getFromStorage(KEYS.PURCHASE, email));

  return purchases.length;
};
