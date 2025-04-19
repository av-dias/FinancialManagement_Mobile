import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpenseEnum } from "../../../models/types";

@Entity("income")
export class IncomeModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  doi: Date;
}

export type IncomeEntity = {
  id: number;
  name: string;
  amount: number;
  doi: Date;
  userId: string;
  entity: ExpenseEnum.Income;
};

export const clearIncomeEntity = (email: string): IncomeEntity => ({
  doi: new Date(),
  name: null,
  amount: null,
  userId: email,
  entity: ExpenseEnum.Income,
  id: null,
});

export const incomeMapper = (i: IncomeModel): IncomeEntity =>
  ({
    id: i.id,
    name: i.name,
    amount: i.amount,
    doi: i.doi,
    userId: i.userId,
    entity: ExpenseEnum.Income,
  } as IncomeEntity);
