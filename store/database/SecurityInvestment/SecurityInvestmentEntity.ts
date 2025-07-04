import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("investments")
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

@Entity("securities")
export class SecurityModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  ticker: string;
}

export type SecurityEntity = {
  name?: string;
  ticker: string;
};

export type InvestmentEntity = {
  id?: number;
  shares: number;
  buyPrice: number;
  buyDate: Date;
  sellPrice?: number | null;
  sellDate?: Date | null;
  security?: SecurityEntity;
  userId: string;
};

export const newInvestment = (user: string) => ({
  id: null,
  shares: 0,
  buyPrice: 0,
  buyDate: null,
  sellPrice: null,
  sellDate: null,
  security: null,
  userId: user,
});

export const newSecurity = () => ({
  name: "",
  ticker: "",
});
