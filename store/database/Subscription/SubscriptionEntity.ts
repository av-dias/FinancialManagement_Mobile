import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseEntity, purchaseMapper, PurchaseModel } from "../Purchase/PurchaseEntity";
import { TransactionEntity, transactionMapper, TransactionModel } from "../Transaction/TransactionEntity";
import { IncomeEntity, incomeMapper, IncomeModel } from "../Income/IncomeEntity";
import { ExpenseEnum } from "../../../models/types";

@Entity("subscription")
export class SubscriptionModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  dayOfMonth: number;

  @Column({ nullable: true })
  lastUpdateDate: Date;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false, enum: ExpenseEnum })
  entity: string;

  @Column("text", { nullable: false })
  item: string;
}

export type SubscriptionEntity = {
  id?: number;
  dayOfMonth: number;
  lastUpdateDate: string;
  item: PurchaseEntity | TransactionEntity | IncomeEntity;
  entity: ExpenseEnum;
  userId: string;
};

export const subscriptionMapper = (s: SubscriptionModel): SubscriptionEntity => ({
  id: s.id,
  dayOfMonth: s.dayOfMonth,
  lastUpdateDate: s.lastUpdateDate.toISOString().split("T")[0],
  item: loadSubscriptionItem(s.entity as ExpenseEnum, JSON.parse(s.item)),
  entity: s.entity as ExpenseEnum,
  userId: s.userId,
});

const loadSubscriptionItem = (entity: ExpenseEnum, item: PurchaseModel | TransactionModel | IncomeModel) => {
  switch (entity) {
    case ExpenseEnum.Purchase:
      item = item as PurchaseModel;
      item.date = new Date(item.date);
      return purchaseMapper(item);

    case ExpenseEnum.Transaction:
      item = item as TransactionModel;
      item.date = new Date(item.date);
      return transactionMapper(item);

    case ExpenseEnum.Income:
      item = item as IncomeModel;
      item.doi = new Date(item.doi);
      return incomeMapper(item);

    default:
      return null;
  }
};
