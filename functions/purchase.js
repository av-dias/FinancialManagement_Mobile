import { getFromStorage } from "../utility/secureStorage";

export const getPurchaseStats = async (email) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, { type, value }) => {
    acc[type] = parseFloat(acc[type] || 0) + parseFloat(value);
    return acc;
  }, {});

  return res;
};

export const getPurchaseTotal = async (email) => {
  let purchases = JSON.parse(await getFromStorage("purchases", email));

  const res = purchases.reduce((acc, curr) => {
    return parseFloat(acc) + parseFloat(curr.value);
  }, 0);
  return parseFloat(res).toFixed(2);
};
