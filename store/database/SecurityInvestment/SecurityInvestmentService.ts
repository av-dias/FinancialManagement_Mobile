import { logTimeTook } from "../../../utility/logger";
import { useDatabaseConnection } from "../../database-context";
import { InvestmentRepository } from "./InvestmentRepository";
import {
  InvestmentEntity,
  InvestmentModel,
  SecurityEntity,
} from "./SecurityInvestmentEntity";
import { SecurityRepository } from "./SecurityRepository";

export class SecurityInvestmentService {
  private securityRepository: SecurityRepository =
    useDatabaseConnection().securityRepository;
  private investmentRepository: InvestmentRepository =
    useDatabaseConnection().investmentRepository;

  public async insertInvestment(
    investmentEntity: InvestmentEntity,
    securityTicker: string
  ) {
    let startTime = performance.now();
    const security = await this.securityRepository.getByTicker(securityTicker);

    if (!security) {
      throw new Error("Security not found");
    }

    if (isNaN(new Date(investmentEntity.buyDate).getTime())) {
      console.log("Invalid buy date");
      alert("Invalid buy date.");
      return;
    }

    const investment = new InvestmentModel();
    investment.id = investmentEntity?.id;
    investment.shares = investmentEntity.shares;
    investment.buyPrice = investmentEntity.buyPrice;
    investment.buyDate = investmentEntity.buyDate;
    investment.userId = investmentEntity.userId;
    investment.security = security;

    await this.investmentRepository.updateOrCreate(investment);
    const endTime = performance.now();
    logTimeTook("InvestmentRepository", "Create", endTime, startTime);
  }
}
