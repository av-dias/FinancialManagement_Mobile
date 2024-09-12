import { Connection, Repository } from "typeorm";
import { PortfolioEntity, PortfolioModel } from "./PortfolioEntity";

export class PortfolioRepository {
  private ormRepository: Repository<PortfolioModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PortfolioModel);
  }

  public async getAll(userId: string): Promise<PortfolioModel[]> {
    const portfolios = await this.ormRepository?.find({ userId: userId });

    return portfolios;
  }

  public async create(portfolioEntity: PortfolioEntity): Promise<PortfolioModel> {
    const portfolio = this.ormRepository.create(portfolioEntity);
    await this.ormRepository.save(portfolio);

    return portfolio;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
