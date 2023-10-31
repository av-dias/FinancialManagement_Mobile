import { getFromStorage, saveToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";

export const handleSplit = async (email, purchases, setPurchases, index, splitUser, splitEmail, refreshTrigger, setRefreshTrigger, getSplitEmail) => {
  console.log(purchases);
  purchases[index]["split"] = {};
  purchases[index]["split"]["userId"] = splitEmail;
  purchases[index]["split"]["weight"] = 50;
  setPurchases(purchases);

  await saveToStorage(KEYS.PURCHASE, JSON.stringify(purchases), email);
  setRefreshTrigger(!refreshTrigger);
};

export const groupByDate = (data) => {
  if (!data || data.length == 0) return {};
  let grouped_data = data
    .map((value, index) => ({ ...value, index: index }))
    .reduce((rv, x) => {
      let dateValue = x["dop"] || x["dot"];
      (rv[dateValue] = rv[dateValue] || []).push(x);
      return rv;
    }, {});

  return grouped_data;
};
