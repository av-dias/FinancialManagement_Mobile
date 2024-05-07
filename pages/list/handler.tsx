import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { KEYS as KEYS_SERIALIZER, RELOAD_TYPE, TRIGGER_KEYS } from "../../utility/keys";
import { Expense, Purchase, Transaction } from "../../models/types";

export const isCtxLoaded = (ctx) => {
  return Object.keys(ctx).length > 0 && Object.keys(ctx["expensesByDate"]).length > 0;
};

export const handleSplit = async (email, expense: Expense, splitUser, setRefreshTrigger) => {
  expense.element = expense.element as Purchase;
  expense.element = { ...expense.element, split: { userId: splitUser, weight: "50" } };

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(expense.element), expense.index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.PURCHASE,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[3],
    [TRIGGER_KEYS[4]]: expense.index,
  });
};

export const handleEditPurchase = async (email, expense: Expense, sliderStatus, setRefreshTrigger, setEditVisible) => {
  let selectedPurchase = expense.element as Purchase;

  console.log(selectedPurchase);

  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (!sliderStatus) delete selectedPurchase.split;

  let index = expense.index;

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.PURCHASE,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[1],
    [TRIGGER_KEYS[4]]: index,
  });
  setEditVisible(false);
};

export const handleEditTransaction = async (email, expense: Expense, setRefreshTrigger, setEditVisible) => {
  let selectedTransaction: Transaction = expense.element as Transaction;
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

  let index = expense.index;

  await editOnStorage(KEYS.TRANSACTION, JSON.stringify(selectedTransaction), index, email);
  setRefreshTrigger({
    [TRIGGER_KEYS[0]]: KEYS_SERIALIZER.TRANSACTION,
    [TRIGGER_KEYS[1]]: RELOAD_TYPE[1],
  });
  setEditVisible(false);
};

export const groupByDate = (data: any) => {
  if (!data || data.length == 0) return {};
  let grouped_data = data
    .map((value: any, index: any) => ({ ...value, index: index }))
    .reduce((rv: any, x: Purchase | Transaction) => {
      let dateValue = x["dop"] || x["dot"];
      (rv[dateValue] = rv[dateValue] || []).push(x);
      return rv;
    }, {});
  return grouped_data;
};
