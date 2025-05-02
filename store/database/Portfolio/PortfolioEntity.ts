import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { clearPortfolioItemEntity, PortfolioItemEntity, portfolioItemMapper, PortfolioItemModel } from "../PortfolioItem/PortfolioItemEntity";

@Entity("portfolios")
export class PortfolioModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, type: "boolean" })
  networthFlag: boolean;

  @Column({ nullable: false, type: "boolean" })
  grossworthFlag: boolean;

  @Column({ nullable: false })
  userId: string;

  @OneToMany(() => PortfolioItemModel, (portfolioItem) => portfolioItem.portfolio, {
    cascade: true,
  })
  items: PortfolioItemModel[];
}

export type PortfolioEntity = {
  name: string;
  networthFlag: boolean;
  grossworthFlag: boolean;
  items?: PortfolioItemEntity[];
  userId: string;
};

export type PortfolioWithItemEntity = {
  name: string;
  networthFlag: boolean;
  grossworthFlag: boolean;
  item: PortfolioItemEntity;
  userId: string;
};

export const portfolioMapper = (p: PortfolioModel): PortfolioEntity =>
  ({
    name: p.name,
    networthFlag: p.networthFlag,
    grossworthFlag: p.grossworthFlag,
    items: p.items ? portfolioItemMapper(p.items) : null,
    userId: p.userId,
  } as PortfolioEntity);

export const portfolioWithItemMapper = (p: PortfolioModel, i: PortfolioItemModel): PortfolioWithItemEntity =>
  ({
    name: p.name,
    networthFlag: p.networthFlag,
    grossworthFlag: p.grossworthFlag,
    item: i ? portfolioItemMapper([i])[0] : null,
    userId: p.userId,
  } as PortfolioWithItemEntity);
