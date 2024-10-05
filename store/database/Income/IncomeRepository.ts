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

  public async updateOrCreate(incomeEntity: IncomeModel): Promise<IncomeModel> {
    await this.ormRepository.save(incomeEntity);
    return incomeEntity;
  }
}
