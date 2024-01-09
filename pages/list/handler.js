import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";

export const handleSplit = async (email, innerData, splitUser, setRefreshTrigger) => {
  let selectedValue = {
    ...innerData,
    split: { userId: splitUser, weight: 50 },
  };
  delete selectedValue["index"];

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedValue), innerData.index, email);
  setRefreshTrigger(KEYS_SERIALIZER.PURCHASE);
};

export const handleEditPurchase = async (email, selectedPurchase, sliderStatus, setRefreshTrigger, setEditVisible) => {
  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (!sliderStatus) delete selectedPurchase["split"];

  let index = selectedPurchase["index"];
  delete selectedPurchase["index"];
  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  setRefreshTrigger(KEYS_SERIALIZER.PURCHASE);
  setEditVisible(false);
};

export const handleEditTransaction = async (email, selectedTransaction, setRefreshTrigger, setEditVisible) => {
  let index = selectedTransaction["index"];
  delete selectedTransaction["index"];
  await editOnStorage(KEYS.TRANSACTION, JSON.stringify(selectedTransaction), index, email);
  setRefreshTrigger(KEYS_SERIALIZER.TRANSACTION);
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
