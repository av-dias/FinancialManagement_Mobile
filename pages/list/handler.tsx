import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { ExpenseType, IncomeType, PurchaseType, TransactionType } from "../../models/types";
import { updateExpenses } from "../../functions/expenses";
import { handleTransaction } from "../transaction/handler";
import { IncomeEntity } from "../../store/database/Income/IncomeEntity";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import Transaction from "../transaction/transaction";
import Purchase from "../purchase/purchase";
import Income from "../income/income";
import { getSplitEmail } from "../../functions/split";

export const isCtxLoaded = (ctx) => {
  return Object.keys(ctx).length > 0 && Object.keys(ctx["expensesByDate"]).length > 0;
};

export const handleSplit = async (email, expense: ExpenseType, splitUser, setExpenses) => {
  expense.element = expense.element as PurchaseType;
  expense.element = { ...expense.element, split: { userId: splitUser, weight: "50" } };

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(expense.element), expense.index, email);
  updateExpenses(expense, setExpenses);
};

// Major refatoring is required upon sqlite is implemented
export const handleEditPurchase = async (email, selectedPurchase: PurchaseType, index: number, splitStatus: boolean, slider: number, splitEmail, setEditVisible, setExpenses) => {
  if (!selectedPurchase.name && selectedPurchase.name == "") selectedPurchase.name = selectedPurchase.type;
  if (!splitStatus) delete selectedPurchase.split;

  if (isNaN(Number(selectedPurchase.value))) {
    alert("Value is not a number.");
    return;
  }

  selectedPurchase.value = selectedPurchase.note === "Refund" ? "-" + selectedPurchase.value : selectedPurchase.value;

  if (splitStatus) selectedPurchase.split = { userId: splitEmail, weight: slider.toString() };

  await editOnStorage(KEYS.PURCHASE, JSON.stringify(selectedPurchase), index, email);
  updateExpenses({ element: selectedPurchase, index: index, key: KEYS_SERIALIZER.PURCHASE }, setExpenses);
  setEditVisible(false);
};

// Major refatoring is required upon sqlite is implemented
export const handleEditTransaction = async (email, selectedTransaction: TransactionType, index: number, setEditVisible, setExpenses, receivedActive: boolean, destination: string) => {
  let _destination = getSplitEmail(destination);
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

  if (!receivedActive) {
    selectedTransaction = { ...selectedTransaction, user_origin_id: null, user_destination_id: _destination };
  } else {
    selectedTransaction = { ...selectedTransaction, user_origin_id: _destination, user_destination_id: email };
  }

  await editOnStorage(KEYS.TRANSACTION, JSON.stringify(selectedTransaction), index, email);
  updateExpenses({ element: selectedTransaction, index: index, key: KEYS_SERIALIZER.TRANSACTION }, setExpenses);
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
  let doi = new Date(i_doi).toISOString().slice(0, 19).replace("T", " ").split(" ")[0];
  return doi == date ? true : false;
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

export const editIncomeOption = (income, setSelectedItem, setEditVisible) => ({
  callback: () => {
    setSelectedItem({ ...income, key: KEYS_SERIALIZER.INCOME });
    setEditVisible(true);
  },
  type: "Edit",
});

export const searchItem = (data: IncomeEntity | ExpenseType, searchQuery: string) => {
  // If the search query is empty, return true to display all items
  if (searchQuery.trim().length == 0) return true;
  // Filter income based on search query
  else if (data.hasOwnProperty("doi")) {
    data = data as IncomeEntity;
    if (data.name.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())) {
      return true;
    }
    return false;
    // Filter expenses based on search query
  } else {
    data = data as ExpenseType;
    if (data.key == KEYS_SERIALIZER.PURCHASE) {
      const element = data.element as PurchaseType;
      if (element.name.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim()) || element.type.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase().trim())) return true;
    } else if (data.key == KEYS_SERIALIZER.TRANSACTION) {
      const element = data.element as TransactionType;
      if (element.description.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim()) || element.type.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())) return true;
    }
    return false;
  }
};

export const searchExpenses = (expensesByDate, searchQuery, listOfDays) => {
  Object.keys(expensesByDate).forEach((date) => {
    expensesByDate[date].forEach((expense) => {
      let hasItem = searchItem(expense, searchQuery);
      if (hasItem) {
        let expenseDate: string;
        if (expense.key === KEYS_SERIALIZER.PURCHASE) {
          expenseDate = (expense.element as PurchaseType).dop;
        } else if (expense.key === KEYS_SERIALIZER.TRANSACTION) {
          expenseDate = (expense.element as TransactionType).dot;
        }
        if (!listOfDays.includes(expenseDate)) {
          listOfDays.push(expenseDate);
        }
      }
    });
  });
};

export const searchIncome = (incomeData, searchQuery, listOfDays) => {
  incomeData.forEach((income: IncomeEntity) => {
    let hasItem = searchItem(income, searchQuery);
    if (hasItem) {
      const date = new Date(income.doi).toISOString().slice(0, 19).replace("T", " ").split(" ")[0];
      if (!listOfDays.includes(date)) {
        listOfDays.push(date);
      }
    }
  });
};

export const loadEditModal = (selectedItem: ExpenseType | IncomeType, email, sliderStatus, setEditVisible, setExpenses, setIncomeData) => {
  if (selectedItem.key === KEYS_SERIALIZER.PURCHASE) {
    const updatePurchase = (selectedItem as ExpenseType).element as PurchaseType;
    return (
      <Purchase
        purchase={updatePurchase}
        handleEdit={(newPurchase: PurchaseType, splitStatus: boolean, slider: number, splitEmail: string) =>
          handleEditPurchase(email, newPurchase, (selectedItem as ExpenseType).index, splitStatus, slider, splitEmail, setEditVisible, setExpenses)
        }
      />
    );
  } else if (selectedItem.key === KEYS_SERIALIZER.TRANSACTION) {
    const updateTransaction = (selectedItem as ExpenseType).element as TransactionType;
    return (
      <Transaction
        transaction={updateTransaction}
        handleEdit={(newTransaction: TransactionType, receivedActive: boolean, destination: string) =>
          handleEditTransaction(email, newTransaction, (selectedItem as ExpenseType).index, setEditVisible, setExpenses, receivedActive, destination)
        }
      />
    );
  } else if (selectedItem.key === KEYS_SERIALIZER.INCOME) {
    const updateIncome = selectedItem as IncomeType;
    return (
      <Income
        income={updateIncome}
        handleEditCallback={(newIncome: IncomeEntity) => {
          setEditVisible(false);
          try {
            setIncomeData((prev) => prev.map((i: IncomeEntity) => (i.id === newIncome.id ? newIncome : i)));
          } catch (e) {
            console.log(e);
          }
        }}
      />
    );
  } else {
    console.log("[Error] Selected item is not expected.");
  }
};
