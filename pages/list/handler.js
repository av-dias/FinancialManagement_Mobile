import { getFromStorage, saveToStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";

export const handleSplit = async (email, purchases, setPurchases, index, splitUser, splitEmail, refreshTrigger, setRefreshTrigger, getSplitEmail) => {
  purchases[index]["split"] = {};
  purchases[index]["split"]["userId"] = splitEmail;
  purchases[index]["split"]["weight"] = 50;
  setPurchases(purchases);

  await saveToStorage(KEYS.PURCHASE, JSON.stringify(purchases), email);
  setRefreshTrigger(!refreshTrigger);
};

export const handleEditPurchase = async (
  email,
  purchases,
  setPurchases,
  index,
  name,
  value,
  type,
  note,
  pickerCurrentDate,
  splitStatus,
  splitWeight,
  splitUser,
  refreshTrigger,
  setRefreshTrigger,
  setEditVisible
) => {
  if (name && name != "") purchases[index].name = name;
  else purchases[index].name = type;
  purchases[index].value = value;
  purchases[index].type = type;
  purchases[index].dop = new Date(pickerCurrentDate).toISOString().split("T")[0];
  purchases[index].note = note;
  if (splitStatus) purchases[index]["split"] = { userId: splitUser, weight: splitWeight };
  else delete purchases[index]["split"];
  setPurchases(purchases);

  await saveToStorage(KEYS.PURCHASE, JSON.stringify(purchases), email);
  setRefreshTrigger(!refreshTrigger);
  setEditVisible(false);
};

export const handleEditTransaction = async (
  email,
  transactions,
  setTransactions,
  index,
  value,
  description,
  pickerCurrentDate,
  splitUser,
  refreshTrigger,
  setRefreshTrigger,
  setEditVisible
) => {
  transactions[index] = {
    amount: value,
    dot: new Date(pickerCurrentDate).toISOString().split("T")[0],
    description: description,
    user_destination_id: splitUser,
  };
  setTransactions(transactions);
  await saveToStorage(KEYS.TRANSACTION, JSON.stringify(transactions), email);

  setRefreshTrigger(!refreshTrigger);
  setEditVisible(false);
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
