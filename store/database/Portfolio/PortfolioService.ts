import { PortfolioEntity, PortfolioModel } from "./PortfolioEntity";
import { PortfolioItemEntity, PortfolioItemModel } from "../PortfolioItem/PortfolioItemEntity";
import { PortfolioRepository } from "./PortfolioRepository";
import { PortfolioItemRepository } from "../PortfolioItem/PortfolioItemRepository";
import { useDatabaseConnection } from "../../database-context";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository = useDatabaseConnection().portfolioRepository;
  private portfolioItemRepository: PortfolioItemRepository = useDatabaseConnection().portfolioItemRepository;

  public async update(portfolioEntity: PortfolioEntity, portfolioItemEntity: PortfolioItemEntity) {
    let portfolioFound = await this.portfolioRepository.getByName(portfolioEntity.userId, portfolioEntity.name);
    let portfolio: PortfolioModel;

    const portfolioItem = new PortfolioItemModel();
    portfolioItem.month = portfolioItemEntity.month;
    portfolioItem.year = portfolioItemEntity.year;
    portfolioItem.value = portfolioItemEntity.value;

    if (portfolioFound) {
      portfolio = portfolioFound;
      portfolio.items.push(portfolioItem);
    } else {
      portfolio = new PortfolioModel();
      portfolio.name = portfolioEntity.name;
      portfolio.networthFlag = portfolioEntity.networthFlag;
      portfolio.grossworthFlag = portfolioEntity.grossworthFlag;
      portfolio.userId = portfolioEntity.userId;
      portfolio.items = [portfolioItem];
    }

    await this.portfolioRepository.updateOrCreate(portfolio);
  }
}
