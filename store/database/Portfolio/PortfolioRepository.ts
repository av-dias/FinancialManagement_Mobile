import { Connection, Repository } from "typeorm";
import { PortfolioModel } from "./PortfolioEntity";

export class PortfolioRepository {
  private ormRepository: Repository<PortfolioModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PortfolioModel);
  }

  public async getAll(userId: string): Promise<PortfolioModel[]> {
    const portfolios = await this.ormRepository?.find({ where: { userId: userId }, relations: ["items"] });
    return portfolios;
  }

  public async getDistinctPortfolioNames(userId: string) {
    const distinctItems = await this.ormRepository
      .createQueryBuilder("p")
      .select(["p.name AS name", "p.grossworthFlag AS grossworthFlag", "p.networthFlag as networthFlag"])
      .where({ userId: userId })
      .getRawMany();
    return distinctItems.map((p) => ({
      ...p,
      grossworthFlag: p.grossworthFlag == 1 ? true : false,
      networthFlag: p.networthFlag == 1 ? true : false,
    }));
  }

  public async getSortedPortfolio(userId: string, currMonth: number, currYear: number) {
    let list = [];
    try {
      list = await this.ormRepository
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.items", "items")
        .where("p.userId = :userId AND items.month <= :month AND items.year <= :year", { userId: userId, month: currMonth, year: currYear })
        .orderBy("items.year", "DESC")
        .orderBy("items.month", "DESC")
        .distinct()
        .getMany();
    } catch (err) {
      console.log(err);
    } finally {
      return list;
    }
  }

  public async getByName(userId: string, name: string): Promise<PortfolioModel> {
    const portfolios = await this.ormRepository?.find({ where: { userId: userId, name: name }, relations: ["items"] });
    return portfolios[0];
  }

  public async hasPortfolio(userId: string, name: string): Promise<boolean> {
    const portfolios = await this.ormRepository?.find({ userId: userId, name: name });
    return portfolios.length > 0;
  }

  public async updateOrCreate(portfolioEntity: PortfolioModel): Promise<PortfolioModel> {
    await this.ormRepository.save(portfolioEntity);
    return portfolioEntity;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
