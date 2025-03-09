import { Between, Connection, Repository } from "typeorm";
import { SplitModel } from "./SplitEntity";

export class SplitRepository {
  private ormRepository: Repository<SplitModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(SplitModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getAll(userId: string): Promise<SplitModel[]> {
    const splits = await this.ormRepository?.find();
    return splits;
  }

  public async getByDate(userId: string, month: number, year: number): Promise<SplitModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toISOString();

    const splits = await this.ormRepository.find({
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
      },
    });

    return splits;
  }

  public async updateOrCreate(splitModel: SplitModel): Promise<SplitModel> {
    await this.ormRepository.save(splitModel);
    return splitModel;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
