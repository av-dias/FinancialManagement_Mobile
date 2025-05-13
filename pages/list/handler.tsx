import { editOnStorage } from "../../functions/secureStorage";
import { KEYS } from "../../utility/storageKeys";
import { ExpenseEnum, ExpenseType, IncomeType, PurchaseType, TransactionType } from "../../models/types";
import { updateExpenses } from "../../functions/expenses";
import { handleTransaction } from "../transaction/handler";
import { IncomeEntity } from "../../store/database/Income/IncomeEntity";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import Transaction from "../transaction/transaction";
import Purchase from "../purchase/purchase";
import Income from "../income/income";
import { getSplitEmail } from "../../functions/split";
import { ExpensesService } from "../../service/ExpensesService";
import { PurchaseEntity, PurchaseModel } from "../../store/database/Purchase/PurchaseEntity";
import { TransactionEntity, transactionMapper, TransactionModel, TransactionOperation } from "../../store/database/Transaction/TransactionEntity";
import { SplitEntity } from "../../store/database/Split/SplitEntity";

export const isCtxLoaded = (ctx) => {
  return Object.keys(ctx).length > 0 && Object.keys(ctx["expensesByDate"]).length > 0;
};

export const handleSplit = async (expense: PurchaseEntity, splitUser, expensesService: ExpensesService) => {
  const newSplit: SplitEntity = { userId: splitUser, weight: 50 };
  expense.split = newSplit;

  await expensesService.updatePurchase(expense);
};

export const handleSettleSplit = async (email, expense: PurchaseEntity, destination, expenseService: ExpensesService) => {
  let splitPercentage = Number(expense.split.weight) / 100;
  let settleValue = Number(expense.amount) * splitPercentage;

  let newTransaction: TransactionEntity = {
    amount: settleValue,
    description: expense.name,
    type: expense.type,
    date: new Date().toISOString().split("T")[0],
    transactionType: TransactionOperation.RECEIVED,
    userTransactionId: destination,
    userId: email,
    entity: ExpenseEnum.Transaction,
  };

  try {
    const transactionModel = await expenseService.createTransaction(newTransaction);
    expense.wasRefunded = transactionModel.id;
    await expenseService.updatePurchase(expense);
    return transactionModel;
  } catch (e) {
    console.log(e);
  }
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

export const isIncomeOnDate = (i_doi, date) => {
  let doi = new Date(i_doi).toISOString().slice(0, 19).replace("T", " ").split(" ")[0];
  return doi == date ? true : false;
};

export const isExpenseOnDate = (expense: PurchaseEntity | TransactionEntity, date) => {
  return expense.date === date ? true : false;
};

export const expenseLabel = (innerData) => {
  if (innerData.split)
    return {
      text: innerData.split.weight + "%",
    };
};

export const splitOption = (expense, splitUser, expenseService: ExpensesService, callback) => ({
  callback: async () => {
    await handleSplit(expense, splitUser, expenseService);
    callback();
  },
  type: "Split",
});

export const settleOption = (email, expense, destination, expenseService: ExpensesService, addCallback) => ({
  callback: async () => {
    const newTransaction = await handleSettleSplit(email, expense, destination, expenseService);
    addCallback(transactionMapper(newTransaction));
  },
  type: "Settle",
});

export const editOption = (setSelectedItem, expense, setEditVisible) => ({
  callback: async () => {
    setSelectedItem({ ...expense });
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

export const transferPurchase = async (email, purchase: PurchaseType, expensesService: ExpensesService) => {
  try {
    const refund = purchase.note == "Refund" ? true : false;

    let newPurchase: PurchaseEntity = {
      amount: Number(purchase.value.replace("-", "")),
      name: purchase.name,
      type: purchase.type,
      description: purchase.description,
      note: purchase.note,
      date: purchase.dop,
      isRefund: refund,
      wasRefunded: null,
      entity: ExpenseEnum.Purchase,
      userId: email,
    };

    if (purchase.split) {
      purchase.split.userId = null;

      const splitUserId = await expensesService.findSplitUserId(email);

      newPurchase.split = {
        userId: purchase.split?.userId || splitUserId || "null@gmail.com",
        weight: Number(purchase.split.weight),
      };
    }

    await expensesService.createPurchase(newPurchase);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const transferTransaction = async (email, transaction: TransactionType, expensesService: ExpensesService) => {
  try {
    let transactionOperation: TransactionOperation;

    // Validate if the transaction is received or sent
    if (transaction.user_origin_id === null) {
      // Transaction is sent, hence the origin is blank
      transactionOperation = TransactionOperation.SENT;
    } else {
      // Transaction is received, hence the origin is populated
      transactionOperation = TransactionOperation.RECEIVED;
    }

    let newTransaction: TransactionEntity = {
      amount: Number(transaction.amount),
      description: transaction.description,
      type: transaction.type,
      date: transaction.dot,
      transactionType: transactionOperation,
      userTransactionId: transaction.user_destination_id,
      entity: ExpenseEnum.Transaction,
      userId: email,
    };

    await expensesService.createTransaction(newTransaction);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const searchItem = (data: IncomeEntity | PurchaseEntity | TransactionEntity, searchQuery: string) => {
  // If the search query is empty, return true to display all items
  if (searchQuery.trim().length == 0) return true;
  // Filter income based on search query
  else if (data.entity === ExpenseEnum.Income) {
    if (data.name.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())) {
      return true;
    }
    return false;
    // Filter expenses based on search query
  } else {
    if (data.entity != ExpenseEnum.Transaction && data?.name.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim())) return true;
    if (
      data.entity != ExpenseEnum.Purchase &&
      (data?.description.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim()) || data?.type.toLowerCase().includes(searchQuery.toLocaleLowerCase().trim()))
    )
      return true;

    return false;
  }
};

export const searchExpenses = (expenseData: (TransactionEntity | PurchaseEntity)[], searchQuery, listOfDays) => {
  expenseData.forEach((expense) => {
    let hasItem = searchItem(expense, searchQuery);
    if (hasItem) {
      if (!listOfDays.includes(expense.date)) {
        listOfDays.push(expense.date);
      }
    }
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

export const loadEditModal = (selectedItem: PurchaseEntity | TransactionEntity | IncomeEntity, email, reload, setIncomeData) => {
  if (selectedItem.entity === ExpenseEnum.Purchase) {
    const updatePurchase = selectedItem;
    return <Purchase purchase={updatePurchase} callback={reload} />;
  } else if (selectedItem.entity === ExpenseEnum.Transaction) {
    const updateTransaction = selectedItem;
    return <Transaction transaction={updateTransaction} callback={reload} />;
  } else if (selectedItem.entity === ExpenseEnum.Income) {
    const updateIncome = selectedItem;
    return (
      <Income
        income={updateIncome}
        handleEditCallback={(newIncome: IncomeEntity) => {
          reload();
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
