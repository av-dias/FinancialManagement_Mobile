export type AlertData = {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  confirmCallback: () => Promise<void>;
};
export const PurchaseAlertData = (name: string, amount: string, handleConfirm): AlertData => ({
  title: "Delete Purchase",
  content: `Name: ${name}\nAmount: ${amount}€`,
  confirmText: "Yes",
  cancelText: "No",
  confirmCallback: async () => await handleConfirm(),
});

export const TransactionAlertData = (name: string, amount: string, handleConfirm): AlertData => ({
  title: "Delete Transaction",
  content: `Name: ${name}\nAmount: ${amount}€`,
  confirmText: "Yes",
  cancelText: "No",
  confirmCallback: async () => await handleConfirm(),
});
export const IncomeAlertData = (name: string, amount: string, handleConfirm): AlertData => ({
  title: "Delete Income",
  content: `Name: ${name}\nAmount: ${amount}€`,
  confirmText: "Yes",
  cancelText: "No",
  confirmCallback: async () => await handleConfirm(),
});
