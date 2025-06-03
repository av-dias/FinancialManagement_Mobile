import { Connection, DeleteResult, Repository } from "typeorm";
import { PortfolioItemEntity, PortfolioItemModel } from "./PortfolioItemEntity";

export class PortfolioItemRepository {
  private ormRepository: Repository<PortfolioItemModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PortfolioItemModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async get(userId: string, name: string, value: number, month: number, year: number): Promise<number> {
    const portfolios = await this.ormRepository
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.portfolio", "p")
      .select(["i.id AS id"])
      .where("p.userId = :userId AND p.name = :name AND i.value = :value AND i.month = :month AND i.year = :year", {
        userId,
        name,
        value,
        month,
        year,
      })
      .getRawOne();

    return portfolios;
  }

  public async getAllAvailableDates(userId: string) {
    const dates = await this.ormRepository
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.portfolio", "p")
      .select(["i.year AS year", "i.month AS month"])
      .where("p.userId = :userId ", {
        userId,
      })
      .distinct()
      .orderBy("i.year, i.month")
      .getRawMany();

    return dates;
  }

  public async create(portfolioItemEntity: PortfolioItemEntity): Promise<PortfolioItemModel> {
    const portfolio = this.ormRepository.create(portfolioItemEntity);
    await this.ormRepository.save(portfolio);

    return portfolio;
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
