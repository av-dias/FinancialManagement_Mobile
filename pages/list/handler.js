import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { KEYS as KEYS_SERIALIZER, RELOAD_TYPE, TRIGGER_KEYS } from "../../utility/keys";

export const isCtxLoaded = (ctx) => {
  return Object.keys(ctx).length > 0 && Object.keys(ctx["expensesByDate"]).length > 0;
};

export const handleSplit = async (email, innerData, splitUser, setRefreshTrigger) => {
  let selectedValue = {
    ...innerData,
    split: { userId: splitUser, weight: 50 },
  };

  let editedValue = { ...selectedValue };
  delete editedValue["index"];
  delete editedValue["key"];

  console.log(editedValue);

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(editedValue), innerData.index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.PURCHASE,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[3],
    [TRIGGER_KEYS[2]]: editedValue,
    [TRIGGER_KEYS[4]]: selectedValue.index,
  });
};

export const handleEditPurchase = async (email, selectedPurchase, sliderStatus, setRefreshTrigger, setEditVisible, beforeEditItem) => {
  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (!sliderStatus) delete selectedPurchase["split"];

  let index = selectedPurchase["index"];
  delete selectedPurchase["index"];
  delete selectedPurchase["key"];

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.PURCHASE,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[1],
    [TRIGGER_KEYS[3]]: beforeEditItem,
    [TRIGGER_KEYS[3]]: selectedPurchase,
    [TRIGGER_KEYS[4]]: index,
  });
  setEditVisible(false);
};

export const handleEditTransaction = async (email, selectedTransaction, setRefreshTrigger, setEditVisible, beforeEditItem) => {
  if (
    !selectedTransaction.amount ||
    selectedTransaction.amount == "" ||
    !selectedTransaction.description ||
    selectedTransaction.description == "" ||
    !selectedTransaction.dot ||
    selectedTransaction.dot == ""
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (!selectedTransaction.type || selectedTransaction.type == "") selectedTransaction.type = "Other";

  let index = selectedTransaction["index"];
  delete selectedTransaction["index"];
  delete selectedTransaction["key"];

  await editOnStorage(KEYS.TRANSACTION, JSON.stringify(selectedTransaction), index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.TRANSACTION,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[1],
    [TRIGGER_KEYS[2]]: selectedTransaction,
    [TRIGGER_KEYS[3]]: beforeEditItem,
  });
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
