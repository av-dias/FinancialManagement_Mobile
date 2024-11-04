export type PurchaseType = {
  value: string;
  name: string;
  type: string;
  description: string;
  note: string;
  dop: string;
  split: SplitType;
};

export type SplitType = {
  userId: string;
  weight: string;
};

export type ExpenseType = {
  index: number;
  key: string;
  element: PurchaseType | TransactionType;
};

export type TransactionType = {
  amount: string;
  type: string;
  description: string;
  dot: string;
  user_destination_id: string;
  user_origin_id: string;
};

export type ExpensesByDateType = {
  [key: string]: ExpenseType[];
};

export const purchaseExpense = (purchase: PurchaseType, index: number, key: string): ExpenseType => {
  const expense: ExpenseType = {
    index: index,
    key: key,
    element: purchase,
  };
  return expense;
};

export const transactionExpense: any = (transaction: TransactionType, index: number, key: string) => {
  const expense: ExpenseType = {
    index: index,
    key: key,
    element: transaction,
  };
  return expense;
};

export function expenseToType(expense: ExpenseType): PurchaseType | TransactionType | undefined {
  const element = expense.element;
  if (typeof element === "object" && "value" in element && "dop" in element) {
    return element as PurchaseType; // Type assertion as element might be Transaction
  } else if (typeof element === "object" && "amount" in element && "dot" in element) {
    return element as TransactionType; // Type assertion as element might be Purchase
  } else {
    return undefined; // Return undefined if element is not a Purchase
  }
}
