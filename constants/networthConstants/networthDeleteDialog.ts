import { AlertData } from "../listConstants/deleteDialog";

export const NetworthAlertData = (name: string, amount: number, handleConfirm): AlertData => ({
  title: "Delete Networth",
  content: `Name: ${name}\nAmount: ${amount}€`,
  confirmText: "Yes",
  cancelText: "No",
  confirmCallback: async () => await handleConfirm(),
});
