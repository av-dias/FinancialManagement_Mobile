import {
  PortfolioEntity,
  PortfolioModel,
  PortfolioWithItemEntity,
  portfolioWithItemMapper,
} from "../store/database/Portfolio/PortfolioEntity";
import {
  clearPortfolioItemEntity,
  PortfolioItemEntity,
  PortfolioItemModel,
} from "../store/database/PortfolioItem/PortfolioItemEntity";
import { PortfolioRepository } from "../store/database/Portfolio/PortfolioRepository";
import { PortfolioItemRepository } from "../store/database/PortfolioItem/PortfolioItemRepository";
import { useDatabaseConnection } from "../store/database-context";
import { loadWorthData } from "../functions/networth";

export class PortfolioService {
  private readonly portfolioRepository: PortfolioRepository =
    useDatabaseConnection().portfolioRepository;
  private readonly portfolioItemRepository: PortfolioItemRepository =
    useDatabaseConnection().portfolioItemRepository;

  public isReady() {
    return (
      this.portfolioRepository.isReady() &&
      this.portfolioItemRepository.isReady() &&
      this.portfolioItemRepository.isReady()
    );
  }

  public async getAllPortfolio(userId: string) {
    const p = await this.portfolioRepository.getAll(userId);

    return p;
  }

  public async update(
    portfolioEntity: PortfolioEntity,
    portfolioItemEntity: PortfolioItemEntity
  ) {
    let portfolioFound = await this.portfolioRepository.getByName(
      portfolioEntity.userId,
      portfolioEntity.name
    );
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

  public async getNearestPortfolioItem(
    userId: string,
    month: number,
    year: number
  ): Promise<PortfolioWithItemEntity[]> {
    const sortedPortfolioItems =
      await this.portfolioRepository.getSortedPortfolio(userId, month, year);

    const nearestPortfolioItems = sortedPortfolioItems
      .map((p: PortfolioModel) => {
        // Evaluate if first item has date equal or less
        const nearestItem = p.items.find(
          (i: PortfolioItemModel) =>
            (year == i.year && month >= i.month) || year > i.year
        );
        const portfolioWithItemEntity = portfolioWithItemMapper(p, nearestItem);

        if (!portfolioWithItemEntity.item)
          portfolioWithItemEntity.item = clearPortfolioItemEntity(month, year);
        return portfolioWithItemEntity;
      })
      .sort((a, b) => b.item.value - a.item.value);

    return nearestPortfolioItems;
  }

  public async getWorthGroupedByMonth(
    userId: string,
    month: number,
    year: number
  ) {
    const worthGroupedByMonth = { grossworth: [], networth: [] };

    for (let currMonth = 0; currMonth <= month; currMonth++) {
      const nearestPortfolioItems = await this.getNearestPortfolioItem(
        userId,
        currMonth,
        year
      );
      const lastMonthNearestPortfolioItems = await this.getNearestPortfolioItem(
        userId,
        currMonth - 1,
        year
      );
      const { currWorth } = loadWorthData(
        nearestPortfolioItems,
        lastMonthNearestPortfolioItems
      );
      worthGroupedByMonth.grossworth.push(currWorth.grossworth);
      worthGroupedByMonth.networth.push(currWorth.networth);
    }

    return worthGroupedByMonth;
  }

  public async getMinMaxWorth(userId: string) {
    let values = [];

    const dates = await this.portfolioItemRepository.getAllAvailableDates(
      userId
    );
    for (const date of dates) {
      let networth = 0,
        grossworth = 0;
      const { month, year } = date;
      const curr = await this.getNearestPortfolioItem(userId, month, year);
      curr.forEach((p) => {
        p.networthFlag && (networth += Number(p.item.value));
        p.grossworthFlag && (grossworth += Number(p.item.value));
      });

      values.push({
        month: month,
        year: year,
        networth: networth,
        grossworth: grossworth,
      });
    }

    return {
      values: values,
      min: {
        grossWorth: values[0].grossworth,
        networth: values[0].networth,
        month: values[0].month,
        year: values[0].year,
      },
      max: {
        grossWorth: values[values.length - 1].grossworth,
        networth: values[values.length - 1].networth,
        month: values[values.length - 1].month,
        year: values[values.length - 1].year,
      },
    };
  }

  public async deletePortfolioItem(
    userId: string,
    name: string,
    value: number,
    month: number,
    year: number
  ) {
    const id = await this.portfolioItemRepository.get(
      userId,
      name,
      value,
      month,
      year
    );
    if (id) {
      await this.portfolioItemRepository.delete(id);
      console.log(`Deleting portfolio item ${id}`);

      const isEmpty = await this.portfolioRepository.hasPortfolioItems(
        userId,
        name
      );
      if (isEmpty) {
        await this.portfolioRepository.deleteByName(userId, name);
      }
    }
  }
}
