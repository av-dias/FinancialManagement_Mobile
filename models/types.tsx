export type Purchase = {
  value: string;
  name: string;
  type: string;
  description: string;
  note: string;
  dop: string;
  split: Split;
};

export type Split = {
  userId: string;
  weight: string;
};

export type Expense = {
  index: number;
  key: string;
  element: Purchase | Transaction;
};

export type Transaction = {
  amount: string;
  type: string;
  description: string;
  dot: string;
  user_destination_id: string;
  user_origin_id: string;
};

export type ExpensesByDate = {
  [key: string]: Expense[];
};

export const purchaseExpense = (purchase: Purchase, index: number, key: string): Expense => {
  const expense: Expense = {
    index: index,
    key: key,
    element: purchase,
  };
  return expense;
};

export const transactionExpense: any = (transaction: Transaction, index: number, key: string) => {
  const expense: Expense = {
    index: index,
    key: key,
    element: transaction,
  };
  return expense;
};

export function expenseToType(expense: Expense): Purchase | Transaction | undefined {
  const element = expense.element;
  if (typeof element === "object" && "value" in element && "dop" in element) {
    return element as Purchase; // Type assertion as element might be Transaction
  } else if (typeof element === "object" && "amount" in element && "dot" in element) {
    return element as Transaction; // Type assertion as element might be Purchase
  } else {
    return undefined; // Return undefined if element is not a Purchase
  }
}
