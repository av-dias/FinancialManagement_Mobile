import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";

export const handleSplit = async (email, selectedPurchase, index, splitUser, refreshTrigger, setRefreshTrigger) => {
  console.log(selectedPurchase);
  selectedPurchase["split"] = { userId: splitUser, weight: 50 };

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  setRefreshTrigger(!refreshTrigger);
};

export const handleEditPurchase = async (
  email,
  index,
  selectedPurchase,
  splitStatus,
  splitUser,
  slider,
  refreshTrigger,
  setRefreshTrigger,
  setEditVisible
) => {
  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (splitStatus) selectedPurchase["split"] = { userId: splitUser, weight: slider };
  else delete selectedPurchase["split"];

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  setRefreshTrigger(!refreshTrigger);
  setEditVisible(false);
};

export const handleEditTransaction = async (email, index, selectedTransaction, splitUser, refreshTrigger, setRefreshTrigger, setEditVisible) => {
  selectedTransaction = {
    ...selectedTransaction,
    user_destination_id: splitUser,
  };

  await editOnStorage(KEYS.TRANSACTION, JSON.stringify(selectedTransaction), index, email);
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
