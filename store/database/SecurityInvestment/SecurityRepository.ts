import { Connection, DeleteResult, Repository } from "typeorm";
import { SecurityEntity, SecurityModel } from "./SecurityInvestmentEntity";
import { logTimeTook } from "../../../utility/logger";

export class SecurityRepository {
  private ormRepository: Repository<SecurityModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(SecurityModel);
  }

  public isReady = () => {
    return !this.ormRepository ? false : true;
  };

  public async getAll(userId: string): Promise<SecurityModel[]> {
    return await this.ormRepository?.find();
  }

  public async getByTicker(ticker: string): Promise<SecurityModel> {
    return await this.ormRepository.findOne({ ticker: ticker });
  }

  public async updateOrCreate(security: SecurityEntity) {
    let startTime = performance.now();
    await this.ormRepository.save(security);
    let endTime = performance.now();
    logTimeTook("SecurityRepository", "Save", endTime, startTime);
  }

  public async deleteUnlinkedSecurity(
    securityTicker: string
  ): Promise<DeleteResult> {
    const result = await this.ormRepository
      .createQueryBuilder("security")
      .delete()
      .where("ticker = :ticker", { ticker: securityTicker }) // Filter by the provided ticker
      .execute();

    return result;
  }

  public async deleteAll() {
    await this.ormRepository.clear();
  }
}
