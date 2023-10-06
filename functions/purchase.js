import { getFromStorage } from "../utility/secureStorage";

export const getPurchaseStats = async (email, currentMonth) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, { type, value, dop }) => {
    if (new Date(dop).getMonth() == currentMonth) {
      acc[type] = parseFloat(acc[type] || 0) + parseFloat(value);
    }
    return acc;
  }, {});

  return res;
};

export const getPurchaseTotal = async (email, currentMonth) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, curr) => {
    if (new Date(curr.dop).getMonth() == currentMonth) {
      return parseFloat(acc) + parseFloat(curr.value);
    }
    return parseFloat(acc);
  }, 0);
  return parseFloat(res).toFixed(0);
};
