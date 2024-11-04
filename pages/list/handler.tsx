import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { ExpenseType, PurchaseType, TransactionType } from "../../models/types";
import { updateExpenses } from "../../functions/expenses";
import { handleTransaction } from "../transaction/handler";

export const isCtxLoaded = (ctx) => {
  return Object.keys(ctx).length > 0 && Object.keys(ctx["expensesByDate"]).length > 0;
};

export const handleSplit = async (email, expense: ExpenseType, splitUser, setExpenses) => {
  expense.element = expense.element as PurchaseType;
  expense.element = { ...expense.element, split: { userId: splitUser, weight: "50" } };

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(expense.element), expense.index, email);
  updateExpenses(expense, setExpenses);
};

export const handleEditPurchase = async (email, expense: ExpenseType, sliderStatus, setEditVisible, setExpenses) => {
  let selectedPurchase = expense.element as PurchaseType;

  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (!sliderStatus) delete selectedPurchase.split;

  let index = expense.index;

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  updateExpenses(expense, setExpenses);
  setEditVisible(false);
};

export const handleEditTransaction = async (email, expense: ExpenseType, setEditVisible, setExpenses) => {
  let selectedTransaction: TransactionType = expense.element as TransactionType;
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
  updateExpenses(expense, setExpenses);
  setEditVisible(false);
};

export const groupByDate = (data: any) => {
  if (!data || data.length == 0) return {};
  let grouped_data = data
    .map((value: any, index: any) => ({ ...value, index: index }))
    .reduce((rv: any, x: PurchaseType | TransactionType) => {
      let dateValue = x["dop"] || x["dot"];
      (rv[dateValue] = rv[dateValue] || []).push(x);
      return rv;
    }, {});
  return grouped_data;
};

export const handleSettleSplit = async (email, expense: ExpenseType, handleTransaction, destination, setExpenses) => {
  let selectedPurchase = expense.element as PurchaseType;
  let splitPercentage = Number(selectedPurchase.split.weight) / 100;
  let settleValue = Number(selectedPurchase.value) * splitPercentage;

  let newTransaction: TransactionType = {
    amount: settleValue.toString(),
    description: selectedPurchase.name,
    type: selectedPurchase.type,
    dot: new Date().toISOString().split("T")[0],
    user_destination_id: "",
    user_origin_id: "",
  };
  await handleTransaction(newTransaction, () => {}, destination, true, email, setExpenses);
};

export const isIncomeOnDate = (i_doi, date) => {
  return i_doi.toString().split(" ")[0] == date ? true : false;
};

export const expenseLabel = (innerData) => {
  if (innerData.split)
    return {
      text: innerData.split.weight + "%",
    };
};

export const splitOption = (setSelectedItem, expenses, email, splitUser, setExpenses) => ({
  callback: async () => {
    setSelectedItem({ ...expenses });
    await handleSplit(email, expenses, splitUser, setExpenses);
  },
  type: "Split",
});

export const settleOption = (email, expenses, destination, setExpenses) => ({
  callback: async () => {
    await handleSettleSplit(email, expenses, handleTransaction, destination, setExpenses);
  },
  type: "Settle",
});

export const editOption = (setSelectedItem, expenses, setSliderStatus, setEditVisible) => ({
  callback: async () => {
    setSelectedItem({ ...expenses });
    setSliderStatus("split" in expenses.element ? true : false);
    setEditVisible(true);
  },
  type: "Edit",
});
