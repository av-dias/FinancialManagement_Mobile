import { ExpenseType } from "./types";

export interface ExpensesByMonth {
  [month: number]: ExpenseType[];
}

export interface ExpensesByYear {
  [year: number]: ExpensesByMonth;
  purchaseIndex: number;
  transactionIndex: number;
}
