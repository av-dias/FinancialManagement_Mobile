import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SplitEntity, splitMapper, SplitModel } from "../Split/SplitEntity";
import { ExpenseEnum } from "../../../models/types";
import { TransactionModel } from "../Transaction/TransactionEntity";

@Entity("purchase")
export class PurchaseModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "decimal", nullable: false })
  amount: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: true })
  isRefund: boolean;

  @OneToOne(() => TransactionModel, { cascade: true })
  @JoinColumn()
  wasRefunded: TransactionModel;

  @OneToOne(() => SplitModel, { cascade: true })
  @JoinColumn()
  split: SplitModel;

  @Column({ nullable: false })
  userId: string;
}

export type PurchaseEntity = {
  id?: number;
  amount: number;
  name: string;
  type: string;
  description: string;
  note: string;
  date: string;
  isRefund: boolean;
  wasRefunded: number;
  split?: SplitEntity;
  userId: string;
  entity: ExpenseEnum.Purchase;
};

export const clearPurchaseEntity = (
  purchaseEntity: PurchaseEntity,
  user?: string
): PurchaseEntity => ({
  id: null,
  amount: 0,
  name: "",
  type: "",
  description: "",
  note: "",
  date: purchaseEntity?.date || new Date().toISOString().split("T")[0],
  isRefund: purchaseEntity?.isRefund || false,
  wasRefunded: null,
  split: null,
  userId: purchaseEntity?.userId || user,
  entity: ExpenseEnum.Purchase,
});

export const purchaseMapper = (p: PurchaseModel): PurchaseEntity =>
  ({
    id: p.id,
    amount: p.amount,
    name: p.name,
    type: p.type,
    description: p.description,
    note: p.note,
    date: p.date.toISOString().split("T")[0],
    isRefund: p.isRefund,
    wasRefunded: p?.wasRefunded?.id,
    split: p.split ? splitMapper(p.split) : null,
    userId: p.userId,
    entity: ExpenseEnum.Purchase,
  } as PurchaseEntity);
