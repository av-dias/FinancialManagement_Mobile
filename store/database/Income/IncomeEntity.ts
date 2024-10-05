import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
  doi: string;
}

export type IncomeEntity = {
  name: string;
  amount: number;
  doi: string;
  userId: string;
};
