import { Connection, Repository } from "typeorm";
import { InvestmentEntity, InvestmentModel } from "./SecurityInvestmentEntity";

export class InvestmentRepository {
  private ormRepository: Repository<InvestmentModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(InvestmentModel);
  }

  public isReady = () => {
    return !this.ormRepository ? false : true;
  };

  public async getAll(userId: string): Promise<InvestmentModel[]> {
    return (
      await this.ormRepository?.find({
        where: { userId },
        relations: ["security"],
      })
    ).filter((investment) => !isNaN(new Date(investment.buyDate).getTime()));
  }

  public async updateOrCreate(investmentEntity: InvestmentEntity) {
    await this.ormRepository.save(investmentEntity);
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll() {
    await this.ormRepository.clear();
  }
}
