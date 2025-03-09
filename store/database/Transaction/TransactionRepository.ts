import { Between, Connection, Repository } from "typeorm";
import { TransactionModel, TransactionOperation } from "./TransactionEntity";

export class TransactionRepository {
  private ormRepository: Repository<TransactionModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(TransactionModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getAll(userId: string): Promise<TransactionModel[]> {
    const transactions = await this.ormRepository?.find({ where: { userId: userId } });
    return transactions;
  }

  public async getByDate(userId: string, month: number, year: number): Promise<TransactionModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toISOString();

    const transactions = await this.ormRepository.find({
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
      },
    });

    return transactions;
  }

  public async getFromType(userId: string, type: string, month: number, year: number): Promise<TransactionModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toISOString();

    const transactions = await this.ormRepository.find({
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
        type: type,
      },
    });

    return transactions;
  }

  public async sumTransactionYearPerType(userId: string, year: number) {
    const sumByType = {};

    const sumArray = await this.ormRepository
      .createQueryBuilder("t")
      .select("type, SUM(CASE WHEN transactionType = :sent then amount ELSE -amount END) as total")
      .setParameters({ sent: TransactionOperation.SENT })
      .where(`t.userId = :userId AND strftime('%Y', t.date) = :year`, { userId: userId, year: year.toString() })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async updateOrCreate(transactionModel: TransactionModel): Promise<TransactionModel> {
    await this.ormRepository.save(transactionModel);
    return transactionModel;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
