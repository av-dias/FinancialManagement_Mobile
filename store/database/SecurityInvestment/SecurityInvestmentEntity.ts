import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("investment")
export class InvestmentModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  shares: number;

  @Column({ nullable: false })
  buyPrice: number;

  @Column({ nullable: false })
  buyDate: Date;

  @Column({ nullable: true })
  sellPrice: number;

  @Column({ nullable: true })
  sellDate: Date;

  @ManyToOne(() => SecurityModel, (security) => security.id, { cascade: true })
  security: SecurityModel;

  @Column({ nullable: false })
  userId: string;
}

export type InvestmentEntity = {
  id?: number;
  shares: number;
  buyPrice: number;
  buyDate: Date;
  sellPrice?: number | null;
  sellDate?: Date | null;
  userId: string;
};

@Entity("security")
export class SecurityModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  ticker: string;
}

export type SecurityEntity = {
  name: string;
  ticker: string;
};
