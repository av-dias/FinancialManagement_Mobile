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

  public async getById(
    userId: string,
    transactionId
  ): Promise<TransactionModel> {
    const transaction = await this.ormRepository?.findOne({
      where: { userId: userId, id: transactionId },
    });
    return transaction;
  }

  public async getAll(userId: string): Promise<TransactionModel[]> {
    const transactions = await this.ormRepository?.find({
      where: { userId: userId },
    });
    return transactions;
  }

  public async getByDate(
    userId: string,
    month: number,
    year: number
  ): Promise<TransactionModel[]> {
    const transactions = await this.ormRepository
      .createQueryBuilder("transactions")
      .where("userId = :userId", { userId: userId })
      .andWhere("strftime('%Y', transactions.date) = :year", {
        year: year.toString(),
      })
      .andWhere("strftime('%m', transactions.date) = :month", {
        month: month < 10 ? `0${month}` : month.toString(),
      })
      .getMany();

    return transactions;
  }

  public async getFromType(
    userId: string,
    type: string,
    month: number,
    year: number
  ): Promise<TransactionModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toLocaleDateString();

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
      .select(
        "type, SUM(CASE WHEN transactionType = :sent then amount ELSE -amount END) as total"
      )
      .setParameters({ sent: TransactionOperation.SENT })
      .where(`t.userId = :userId AND strftime('%Y', t.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async sumTransactionYearPerTypePersonal(userId: string, year: number) {
    const sumByType = {};

    const sumArray = await this.ormRepository
      .createQueryBuilder("t")
      .select(
        "type, SUM(CASE WHEN transactionType = :sent then amount ELSE 0 END) as total"
      )
      .setParameters({ sent: TransactionOperation.SENT })
      .where(`t.userId = :userId AND strftime('%Y', t.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async findTransactionReceivedYear(userId: string, year: number) {
    const transactionReceived = await this.ormRepository
      .createQueryBuilder("t")
      .where(`t.userId = :userId AND strftime('%Y', t.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .andWhere("t.transactionType = :tReceived", {
        tReceived: TransactionOperation.RECEIVED,
      })
      .getMany();

    return transactionReceived;
  }

  public async calcReceivedPerMonthAndYear(userId: string, year: number) {
    const sumArray = await this.ormRepository
      .createQueryBuilder("t")
      .select([
        "CAST(strftime('%Y', t.date) AS INTEGER) as year",
        "CAST(strftime('%m', t.date) AS INTEGER)  as month ",
        `SUM(CASE WHEN t.transactionType = "${TransactionOperation.RECEIVED}" THEN -amount ELSE 0 END) as total`,
      ])
      .where(`t.userId = :userId AND strftime('%Y', t.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("year, month")
      .getRawMany();

    return sumArray;
  }

  public async updateOrCreate(
    transactionModel: TransactionModel
  ): Promise<TransactionModel> {
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
