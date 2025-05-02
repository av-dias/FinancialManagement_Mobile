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
  id?: number;
  value: number;
  month: number;
  year: number;
};

export const clearPortfolioItemEntity = (month: number, year: number): PortfolioItemEntity => ({
  id: null,
  value: 0,
  month: month,
  year: year,
});

export const portfolioItemMapper = (i: PortfolioItemModel[]): PortfolioItemEntity[] =>
  i.map(
    (entity) =>
      ({
        id: entity.id,
        value: entity.value,
        month: entity.month,
        year: entity.year,
      } as PortfolioItemEntity)
  );
