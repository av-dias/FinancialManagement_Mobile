import { Connection, Repository } from "typeorm";
import { PortfolioItemEntity, PortfolioItemModel } from "./PortfolioItemEntity";

export class PortfolioItemRepository {
  private ormRepository: Repository<PortfolioItemModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PortfolioItemModel);
  }

  public async getAll(portfolioId: string): Promise<PortfolioItemModel[]> {
    const portfolios = await this.ormRepository?.find();

    return portfolios;
  }

  public async create(portfolioItemEntity: PortfolioItemEntity): Promise<PortfolioItemModel> {
    const portfolio = this.ormRepository.create(portfolioItemEntity);
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
