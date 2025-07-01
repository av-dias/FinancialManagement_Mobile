import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExpenseEnum } from "../../../models/types";

export enum TransactionOperation {
  RECEIVED = "Received",
  SENT = "Sent",
}

@Entity("transaction")
export class TransactionModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "decimal", nullable: false })
  amount: number;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false, enum: TransactionOperation })
  transactionType: string;

  @Column({ nullable: false })
  user_transaction_id: string;

  @Column({ nullable: false })
  userId: string;
}

export type TransactionEntity = {
  id?: number;
  amount: number;
  type: string;
  description: string;
  date: string;
  transactionType: TransactionOperation;
  userTransactionId: string;
  userId: string;
  entity: ExpenseEnum.Transaction;
};

export const clearTransactionEntity = (
  transactionEntity: TransactionEntity,
  user?: string
): TransactionEntity => ({
  id: null,
  amount: 0,
  type: "",
  description: "",
  date: transactionEntity?.date || new Date().toISOString().split("T")[0],
  transactionType:
    transactionEntity?.transactionType || TransactionOperation.SENT,
  userTransactionId: transactionEntity?.userTransactionId,
  userId: transactionEntity?.userId || user,
  entity: ExpenseEnum.Transaction,
});

export const transactionMapper = (t: TransactionModel): TransactionEntity =>
  ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    date: t.date.toISOString().split("T")[0],
    transactionType: t.transactionType,
    userTransactionId: t.user_transaction_id,
    userId: t.userId,
    entity: ExpenseEnum.Transaction,
  } as TransactionEntity);
