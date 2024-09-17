import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PortfolioItemModel } from "../PortfolioItem/PortfolioItemEntity";

@Entity("portfolios")
export class PortfolioModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  networthFlag: boolean;

  @Column({ nullable: false })
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
  userId: string;
};
