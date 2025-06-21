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

  public async getAllLinkedSecurities(userId: string): Promise<string[]> {
    const linkedSecurityIdsSubQuery = await this.ormRepository
      .createQueryBuilder("investment") // Alias the InvestmentModel as 'investment'
      .leftJoin("investment.security", "security") // Join with the SecurityModel via the 'security' relation, alias as 'security'
      .where("investment.userId = :userId", { userId: userId }) // Filter investments by userId
      .select("security.ticker as ticker") // Select the entire 'security' object from the join
      .distinct(true) // Ensure only unique SecurityModel objects are returned
      .getRawMany(); // Execute the query and get the results
    return linkedSecurityIdsSubQuery.map((security) => security.ticker);
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
