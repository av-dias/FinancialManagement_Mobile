import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("portfolios")
export class PortfolioModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column()
  networthFlag: boolean;

  @Column()
  grossworthFlag: boolean;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column()
  userId: string;
}

export type PortfolioEntity = {
  name: string;
  value: number;
  networthFlag: boolean;
  grossworthFlag: boolean;
  month: number;
  year: number;
  userId: string;
};
