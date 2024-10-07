import { Connection, Repository } from "typeorm";
import { IncomeModel } from "./IncomeEntity";

export class IncomeRepository {
  private ormRepository: Repository<IncomeModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(IncomeModel);
  }

  public async getAll(userId: string): Promise<IncomeModel[]> {
    const incomes = await this.ormRepository?.find({ where: { userId: userId } });
    return incomes;
  }

  public async getDistinctIncomeNames(userId: string): Promise<string[]> {
    const distinctNames = await this.ormRepository
      .createQueryBuilder("i")
      .select("i.name")
      .distinct(true)
      .getMany();

    return distinctNames.map((income) => income.name);
  }

  public async getIncomeFromDate(
    userId: string,
    month: number,
    year: number
  ): Promise<IncomeModel[]> {
    const firstDateOfMonth = new Date(year, month, 1).toISOString();
    const lastDateOfMonth = new Date(year, month + 1, 0).toISOString();
    const incomeData = await this.ormRepository
      .createQueryBuilder("i")
      .select("i.amount AS amount, i.doi AS doi, i.id AS id, i.name AS name, i.userId AS userId")
      .where("i.userId = :userId AND i.doi BETWEEN :startDate AND :endDate ", {
        userId: userId,
        startDate: firstDateOfMonth,
        endDate: lastDateOfMonth,
      })
      .getRawMany();

    return incomeData;
  }

  public async updateOrCreate(incomeEntity: IncomeModel): Promise<IncomeModel> {
    await this.ormRepository.save(incomeEntity);
    return incomeEntity;
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
