import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PortfolioModel } from "../Portfolio/PortfolioEntity";

@Entity("portfolio_items")
export class PortfolioItemModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  month: number;

  @Column({ nullable: false })
  year: number;

  @ManyToOne(() => PortfolioModel, (portfolio) => portfolio.items, { cascade: false })
  portfolio: PortfolioModel;
}

export type PortfolioItemEntity = {
  value: number;
  month: number;
  year: number;
};
