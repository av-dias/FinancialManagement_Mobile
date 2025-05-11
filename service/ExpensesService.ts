import { ExpenseEnum } from "../models/types";
import { useDatabaseConnection } from "../store/database-context";
import { PurchaseEntity, purchaseMapper, PurchaseModel } from "../store/database/Purchase/PurchaseEntity";
import { PurchaseRepository } from "../store/database/Purchase/PurchaseRepository";
import { SplitModel } from "../store/database/Split/SplitEntity";
import { SplitRepository } from "../store/database/Split/SplitRepository";
import { TransactionEntity, transactionMapper, TransactionModel, TransactionOperation } from "../store/database/Transaction/TransactionEntity";
import { TransactionRepository } from "../store/database/Transaction/TransactionRepository";
import { months } from "../utility/calendar";
import { ANALYSES_TYPE } from "../utility/keys";

export class ExpensesService {
  private purchaseRepository: PurchaseRepository = useDatabaseConnection().purchaseRepository;
  private splitRepository: SplitRepository = useDatabaseConnection().splitRepository;
  private transactionRepository: TransactionRepository = useDatabaseConnection().transactionRepository;

  public isReady() {
    return this.purchaseRepository.isReady() && this.transactionRepository.isReady() && this.splitRepository.isReady();
  }

  public async getExpenseByIdAndType(userId: string, expenseId: number, expenseEntity: ExpenseEnum): Promise<PurchaseModel | TransactionModel> {
    switch (expenseEntity) {
      case ExpenseEnum.Purchase: {
        return await this.purchaseRepository.getById(userId, expenseId);
      }
      case ExpenseEnum.Transaction: {
        return await this.transactionRepository.getById(userId, expenseId);
      }
      default:
        return null;
    }
  }

  public async createPurchase(purchaseEntity: PurchaseEntity): Promise<void> {
    if (!purchaseEntity.type || purchaseEntity.type == "" || !purchaseEntity.amount || !purchaseEntity.date) {
      alert("Please fill all fields.");
      throw new Error("Please fill all fields.");
    }

    if (!purchaseEntity.name || purchaseEntity.name == "") purchaseEntity.name = purchaseEntity.type;

    const purchase = new PurchaseModel();
    purchase.id = purchaseEntity?.id;
    purchase.amount = purchaseEntity.amount;
    purchase.name = purchaseEntity.name;
    purchase.type = purchaseEntity.type;
    purchase.description = purchaseEntity.description;
    purchase.note = purchaseEntity.note;
    purchase.date = new Date(purchaseEntity.date);
    purchase.isRefund = purchaseEntity.isRefund;
    purchase.wasRefunded = null;
    purchase.userId = purchaseEntity.userId;

    if (purchaseEntity.split) {
      //console.log("Purchase has split");
      const split = new SplitModel();
      split.splitUserId = purchaseEntity.split.userId;
      split.splitWeight = purchaseEntity.split.weight;
      purchase.split = split;
    } else if (purchaseEntity.id) {
      const purchaseModel = await this.purchaseRepository.getById(purchaseEntity.userId, purchaseEntity.id);
      if (purchaseModel?.split?.id) this.splitRepository.delete(purchaseModel.split.id);
      purchase.split = null;
    }

    //await this.purchaseRepository.deleteAll();
    await this.purchaseRepository.updateOrCreate(purchase);
  }

  public async updatePurchase(purchaseEntity: PurchaseEntity): Promise<void> {
    const purchase = new PurchaseModel();
    let wasRefunded;

    if (purchaseEntity.wasRefunded) {
      wasRefunded = await this.transactionRepository.getById(purchaseEntity.userId, purchaseEntity.wasRefunded);
    }

    purchase.id = purchaseEntity.id;
    purchase.amount = purchaseEntity.amount;
    purchase.name = purchaseEntity.name;
    purchase.type = purchaseEntity.type;
    purchase.description = purchaseEntity.description;
    purchase.note = purchaseEntity.note;
    purchase.date = new Date(purchaseEntity.date);
    purchase.isRefund = purchaseEntity.isRefund;
    purchase.wasRefunded = wasRefunded;
    purchase.userId = purchaseEntity.userId;

    if (purchaseEntity.split) {
      const split = new SplitModel();
      split.id = purchaseEntity.split?.id;
      split.splitUserId = purchaseEntity.split.userId;
      split.splitWeight = purchaseEntity.split.weight;
      purchase.split = split;
    } else {
      const purchaseModel = await this.purchaseRepository.getById(purchaseEntity.userId, purchaseEntity.id);
      if (purchaseModel?.split?.id) this.splitRepository.delete(purchaseModel.split.id);
      purchase.split = null;
    }

    await this.purchaseRepository.updateOrCreate(purchase);
  }

  public async createTransaction(transactionEntity: TransactionEntity): Promise<TransactionModel> {
    if (transactionEntity.userTransactionId == "" || !transactionEntity.amount || !transactionEntity.description || transactionEntity.description == "" || !transactionEntity.date) {
      alert("Please fill all fields.");
      throw new Error("Please fill all fields.");
    }

    if (!transactionEntity.userTransactionId || transactionEntity.userTransactionId == "" || transactionEntity.userTransactionId == "Not Registed") {
      alert("Please register a split user on the settings.");
      throw new Error("Please register a split user on the settings.");
    }

    if (!transactionEntity.type || transactionEntity.type == "") transactionEntity.type = "Other";

    const transaction = new TransactionModel();
    transaction.id = transactionEntity?.id;
    transaction.amount = transactionEntity.amount;
    transaction.type = transactionEntity.type;
    transaction.description = transactionEntity.description;
    transaction.date = new Date(transactionEntity.date);
    transaction.user_transaction_id = transactionEntity.userTransactionId;
    transaction.transactionType = transactionEntity.transactionType;
    transaction.userId = transactionEntity.userId;

    return await this.transactionRepository.updateOrCreate(transaction);
  }

  public async updateTransaction(transactionEntity: TransactionEntity): Promise<void> {
    const transaction = new TransactionModel();
    transaction.id = transactionEntity.id;
    transaction.amount = transactionEntity.amount;
    transaction.type = transactionEntity.type;
    transaction.description = transactionEntity.description;
    transaction.date = new Date(transactionEntity.date);
    transaction.user_transaction_id = transactionEntity.userTransactionId;
    transaction.userId = transactionEntity.userId;

    await this.transactionRepository.updateOrCreate(transaction);
  }

  public async deletePurchase(purchase: PurchaseEntity | PurchaseModel): Promise<void> {
    //await this.purchaseRepository.deleteAll();
    await this.purchaseRepository.delete(purchase.id);
  }

  public async deleteTransaction(transaction: TransactionEntity | TransactionModel): Promise<void> {
    //await this.transactionRepository.deleteAll();
    await this.transactionRepository.delete(transaction.id);
  }

  /* Get total expenses on type, month and year */
  public async getTotalExpensesOnMonth(userId: string, month: number, year: number, analysesType?: string): Promise<number> {
    const transaction = await this.transactionRepository.getByDate(userId, month, year);
    const purchase = await this.purchaseRepository.getByDate(userId, month, year);

    let purchaseTotal = purchase.reduce((acc, curr) => {
      let amount: number;
      if (analysesType === ANALYSES_TYPE.Personal && curr.split) {
        amount = curr.amount * ((100 - curr.split.splitWeight) / 100);
      } else {
        amount = curr.amount;
      }
      return curr.isRefund ? acc - amount : acc + amount;
    }, 0);

    let transactionTotal: number;
    if (analysesType === ANALYSES_TYPE.Personal) {
      transactionTotal = transaction.reduce((acc, curr) => (curr.transactionType === TransactionOperation.SENT ? acc + curr.amount : acc), 0);
    } else {
      transactionTotal = transaction.reduce((acc, curr) => (curr.transactionType === TransactionOperation.SENT ? acc + curr.amount : acc - curr.amount), 0);
    }

    return purchaseTotal + transactionTotal;
  }

  /*  Get total expenses object by type */
  public async getMonthExpensesByType(userId: string, month: number, year: number, analysesType?: string): Promise<{}> {
    const expensesByType = {};
    const transaction = await this.transactionRepository.getByDate(userId, month, year);

    transaction.map((t) => {
      if (!expensesByType[t.type]) expensesByType[t.type] = 0;
      if (analysesType === ANALYSES_TYPE.Personal && t.transactionType === TransactionOperation.RECEIVED) {
        return;
      }
      return t.transactionType === TransactionOperation.SENT ? (expensesByType[t.type] += t.amount) : (expensesByType[t.type] -= t.amount);
    });

    const purchase = await this.purchaseRepository.getByDate(userId, month, year);

    purchase.map((p) => {
      let amount: number;
      if (!expensesByType[p.type]) expensesByType[p.type] = 0;

      if (analysesType === ANALYSES_TYPE.Personal && p.split) {
        amount = p.amount * ((100 - p.split.splitWeight) / 100);
      } else {
        amount = p.amount;
      }
      return p.isRefund ? (expensesByType[p.type] -= amount) : (expensesByType[p.type] += amount);
    });

    return expensesByType;
  }

  /* Get total expense average */
  public async getExpensesTotalAverage(userId: string, year: number, analysesType?: string): Promise<number> {
    let totalExpense = 0,
      start = 0;

    const availableMonths = await this.purchaseRepository.getAvailableMonths(userId, year);

    if (availableMonths.length == 0) return 0;

    for (start = availableMonths[0]; start <= availableMonths[availableMonths.length - 1]; start++) {
      const monthExpense = await this.getTotalExpensesOnMonth(userId, start, year, analysesType);
      totalExpense += monthExpense;
    }

    return totalExpense / (start - availableMonths[0]);
  }

  /* Get all expenses Purchase/Transaction from especified type, month and year */
  public async getExpensesFromType(userId: string, type: string, month: number, year: number): Promise<(PurchaseEntity | TransactionEntity)[]> {
    let listExpenses: (PurchaseEntity | TransactionEntity)[] = [];
    listExpenses = (await this.purchaseRepository.getFromType(userId, type, month, year)).map((p) => purchaseMapper(p));
    listExpenses = listExpenses.concat((await this.transactionRepository.getFromType(userId, type, month, year)).map((t) => transactionMapper(t)));

    return listExpenses;
  }

  /* Get expense diference between total and personal type */
  public async getExpensesTypeDifference(userId: string, year: number) {
    const expensesDifference = {};
    const monthsAvailable = await this.purchaseRepository.getAvailableMonths(userId, year);

    for (const month of monthsAvailable) {
      for (const type of Object.keys(ANALYSES_TYPE)) {
        const expenseTypeTotal = await this.getTotalExpensesOnMonth(userId, month, year, ANALYSES_TYPE[type]);

        if (!expensesDifference[month]) expensesDifference[month] = expenseTypeTotal;
        else expensesDifference[month] -= expenseTypeTotal;
      }
    }

    return expensesDifference;
  }

  public async getExpenseTotalByType(userId: string, year: number, analysesType?: string) {
    const expensesSumByType = {};
    let sumPurchases, sumTransactions;

    if (analysesType === ANALYSES_TYPE.Personal) {
      sumPurchases = await this.purchaseRepository.sumPurchaseYearPerTypePersonal(userId, year);
      sumTransactions = await this.transactionRepository.sumTransactionYearPerTypePersonal(userId, year);
    } else {
      sumPurchases = await this.purchaseRepository.sumPurchaseYearPerType(userId, year);
      sumTransactions = await this.transactionRepository.sumTransactionYearPerType(userId, year);
    }

    const types = new Set(Object.keys(sumPurchases).concat(Object.keys(sumTransactions)));

    for (let type of types) {
      expensesSumByType[type] = (sumPurchases[type] | 0) + (sumTransactions[type] | 0);
    }

    return expensesSumByType;
  }

  public async getExpenseAverageByType(userId: string, year: number, analysesType?: string) {
    const availableMonths = await this.purchaseRepository.getAvailableMonths(userId, year);

    if (availableMonths.length == 0) return;

    const expensesAverageByType = await this.getExpenseTotalByType(userId, year, analysesType);

    for (const type in expensesAverageByType) {
      expensesAverageByType[type] /= availableMonths.length;
    }

    return expensesAverageByType;
  }

  public async getExpensesList(userId: string, month: number, year: number) {
    let expenseList = [];

    const purchaseList = await this.purchaseRepository.getByDate(userId, month, year);
    const transactionList = await this.transactionRepository.getByDate(userId, month, year);

    if (purchaseList.length > 0) expenseList.push(...purchaseList.map((p) => purchaseMapper(p)));
    if (transactionList.length > 0) expenseList.push(...transactionList.map((t) => transactionMapper(t)));

    return expenseList;
  }

  public async getExpensesYearWithSplit(userId: string, year: number) {
    const expenseList = await this.purchaseRepository.findPurchaseYearWithSplit(userId, year);
    const transactionList = await this.transactionRepository.findTransactionReceivedYear(userId, year);
    return { purchaseWithSplit: expenseList.map((p) => purchaseMapper(p)), transactionsWithSplit: transactionList.map((t) => transactionMapper(t)) };
  }

  public async calculateSplitDept(userId: string, year: number) {
    const splitDept = {};
    const purchaseSplit = await this.purchaseRepository.calcTotalPerMonthAndYear(userId, year);
    const transactionSplit = await this.transactionRepository.calcReceivedPerMonthAndYear(userId, year);
    for (let month = 0; month < months.length; month++) {
      const p = purchaseSplit?.find((p) => p.month === month + 1);
      const t = transactionSplit?.find((t) => t.month === month + 1);

      if (p) splitDept[month] = p.total - p.personalTotal;
      if (t) splitDept[month] += t.total;
    }

    return splitDept;
  }

  public async findSplitUserId(userId: string) {
    const splitUserId = await this.purchaseRepository.findSplitUserId(userId);

    return splitUserId;
  }
}
