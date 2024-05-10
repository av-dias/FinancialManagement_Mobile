import { Expense } from "./types";

export interface ExpensesByMonth {
  [month: number]: Expense[];
}

export interface ExpensesByYear {
  [year: number]: ExpensesByMonth;
  purchaseIndex: number;
  transactionIndex: number;
}
