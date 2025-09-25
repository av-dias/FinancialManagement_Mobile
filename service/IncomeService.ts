import { useDatabaseConnection } from "../store/database-context";
import { IncomeRepository } from "../store/database/Income/IncomeRepository";

export class IncomeService {
  private incomeRepository: IncomeRepository =
    useDatabaseConnection().incomeRepository;

  public isReady() {
    return this.incomeRepository.isReady();
  }

  /**
   * This is used to save db details in file for backup usage only
   * @param userId
   * @returns
   */
  public async getAllIncome(userId: string) {
    const i = await this.incomeRepository.getAll(userId);

    return i;
  }

  public async getTotalIncomeFromMonth(
    email: string,
    currentMonth: number,
    currentYear: number
  ) {
    const i = await this.incomeRepository.getIncomeFromDate(
      email,
      currentMonth,
      currentYear
    );

    return i.reduce((acc, income) => acc + Number(income.amount), 0);
  }
}
