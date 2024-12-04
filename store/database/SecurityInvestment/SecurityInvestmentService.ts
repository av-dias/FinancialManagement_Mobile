import { logTimeTook } from "../../../utility/logger";
import { useDatabaseConnection } from "../../database-context";
import { InvestmentRepository } from "./InvestmentRepository";
import { InvestmentEntity, InvestmentModel, SecurityEntity } from "./SecurityInvestmentEntity";
import { SecurityRepository } from "./SecurityRepository";

export class SecurityInvestmentService {
  private securityRepository: SecurityRepository = useDatabaseConnection().securityRepository;
  private investmentRepository: InvestmentRepository = useDatabaseConnection().investmentRepository;

  public async insertInvestment(investmentEntity: InvestmentEntity, securityTicker: string) {
    console.log(securityTicker);
    let startTime = performance.now();
    const security = await this.securityRepository.getByTicker(securityTicker);
    let endTime = performance.now();
    logTimeTook("SecurityRepository", "Get", endTime, startTime);

    if (!security) {
      throw new Error("Security not found");
    }

    console.log(security);
    console.log(investmentEntity);
    const invesment = new InvestmentModel();
    invesment.shares = investmentEntity.shares;
    invesment.buyPrice = investmentEntity.buyPrice;
    invesment.buyDate = investmentEntity.buyDate;
    invesment.userId = investmentEntity.userId;
    invesment.security = security;

    startTime = performance.now();
    await this.investmentRepository.updateOrCreate(invesment);
    endTime = performance.now();
    logTimeTook("InvestmentRepository", "Create", endTime, startTime);
  }
}
