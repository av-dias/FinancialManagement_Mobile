import { Connection, DeleteResult, Repository } from "typeorm";
import { IncomeEntity, incomeMapper, IncomeModel } from "./IncomeEntity";

export class IncomeRepository {
  private ormRepository: Repository<IncomeModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(IncomeModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getAll(userId: string): Promise<IncomeModel[]> {
    const incomes = await this.ormRepository?.find({ where: { userId: userId } });
    return incomes;
  }

  public async getDistinctIncomeNames(userId: string): Promise<string[]> {
    const distinctNames = await this.ormRepository.createQueryBuilder("i").select("i.name as name").distinct().getRawMany();

    return distinctNames.map((income) => income.name);
  }

  public async getIncomeFromDate(userId: string, month: number, year: number): Promise<IncomeEntity[]> {
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

    return incomeData.length > 0 ? incomeData.map((i) => incomeMapper(i)) : [];
  }

  public async getTotalIncomeFromDate(userId: string, month: number, year: number): Promise<number> {
    const firstDateOfMonth = new Date(year, month, 1).toISOString();
    const lastDateOfMonth = new Date(year, month + 1, 0).toISOString();
    const totalIncomeData = await this.ormRepository
      .createQueryBuilder("i")
      .select("SUM(i.amount) AS totalIncome") // Add SUM(i.amount) for total
      .where("i.userId = :userId AND i.doi BETWEEN :startDate AND :endDate ", {
        userId: userId,
        startDate: firstDateOfMonth,
        endDate: lastDateOfMonth,
      })
      .getRawMany();

    return totalIncomeData[0].totalIncome || 0;
  }

  public async updateOrCreate(incomeEntity: IncomeModel): Promise<IncomeModel> {
    await this.ormRepository.save(incomeEntity);
    return incomeEntity;
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
