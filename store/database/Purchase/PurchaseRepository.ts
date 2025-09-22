import { Between, Connection, Repository, Like } from "typeorm";
import {
  PurchaseEntity,
  purchaseMapper,
  PurchaseModel,
} from "./PurchaseEntity";

export class PurchaseRepository {
  private ormRepository: Repository<PurchaseModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PurchaseModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getById(userId: string, purchaseId): Promise<PurchaseModel> {
    const purchase = await this.ormRepository?.findOne({
      where: { userId: userId, id: purchaseId },
      relations: ["split"], // Add this line
    });
    return purchase;
  }

  public async getAll(userId: string): Promise<PurchaseModel[]> {
    const purchases = await this.ormRepository?.find({
      where: { userId: userId },
      relations: ["split"], // Add this line
    });
    return purchases;
  }

  public async getByDate(
    userId: string,
    month: number,
    year: number
  ): Promise<PurchaseModel[]> {
    const purchases = await this.ormRepository
      .createQueryBuilder("purchase")
      .where("purchase.userId = :userId", { userId: userId })
      .andWhere("strftime('%Y', purchase.date) = :year", {
        year: year.toString(),
      })
      .andWhere("strftime('%m', purchase.date) = :month", {
        month: month < 10 ? `0${month}` : month.toString(),
      })
      .leftJoinAndSelect("purchase.split", "split")
      .leftJoinAndSelect("purchase.wasRefunded", "wasRefunded")
      .getMany();

    return purchases;
  }

  public async updateOrCreate(
    purchaseModel: PurchaseModel
  ): Promise<PurchaseModel> {
    const newPurchase = await this.ormRepository.save(purchaseModel);
    return newPurchase;
  }

  public async getFromType(
    userId: string,
    type: string,
    month: number,
    year: number
  ): Promise<PurchaseModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toLocaleDateString();

    const purchases = await this.ormRepository.find({
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
        type: type,
      },
      relations: ["split"], // Add this line
    });

    return purchases;
  }

  public async getAvailableMonths(
    userId: string,
    year: number
  ): Promise<number[]> {
    const distinctMonths = await this.ormRepository
      .createQueryBuilder("p")
      .select("strftime('%m', p.date)", "month") // Extract year and month
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .orderBy("month")
      .distinct()
      .getRawMany();

    return distinctMonths.map((item) => Number(item.month));
  }

  public async getAvailableTypes(userId: string) {
    const distinctTypes = await this.ormRepository
      .createQueryBuilder("p")
      .select("p.type as type")
      .distinct()
      .where(`p.userId = :userId`, { userId: userId })
      .orderBy("type")
      .getRawMany();

    return distinctTypes.map((item) => item.type);
  }

  public async sumPurchaseYearPerType(userId: string, year: number) {
    const sumByType = {};
    const sumArray = await this.ormRepository
      .createQueryBuilder("p")
      .select(
        "type, SUM(CASE WHEN isRefund = true THEN -amount ELSE amount END) as total"
      )
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async sumPurchaseYearPerTypePersonal(userId: string, year: number) {
    const sumByType = {};

    const sumArray = await this.ormRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.split", "split")
      .select([
        "type as type",
        "SUM(CASE " +
          "WHEN isRefund = true THEN -amount " +
          "WHEN split.id IS NOT NULL THEN (amount * (1 - 1.0 * split.splitWeight / 100 ))" +
          "ELSE amount END) as total",
      ])
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async calcTotalPerMonthAndYear(userId: string, year: number) {
    const sumArray = await this.ormRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.split", "split")
      .select([
        "CAST(strftime('%Y', p.date) AS INTEGER) as year",
        "CAST(strftime('%m', p.date) AS INTEGER)  as month ",
        "SUM(CASE " +
          "WHEN isRefund = true THEN -amount " +
          "WHEN split.id IS NOT NULL THEN (amount * (1 - 1.0 * split.splitWeight / 100 ))" +
          "ELSE amount END) as personalTotal",
        "SUM(CASE " +
          "WHEN isRefund = true THEN -amount " +
          "ELSE amount END) as total",
      ])
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .groupBy("year, month")
      .getRawMany();

    return sumArray;
  }

  public async findPurchaseYearWithSplit(userId: string, year: number) {
    const purchaseWithSplit = await this.ormRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.split", "split")
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, {
        userId: userId,
        year: year.toString(),
      })
      .andWhere("p.split IS NOT NULL")
      .getMany();

    return purchaseWithSplit;
  }

  public async findSplitUserId(userId) {
    const splitUserId = await this.ormRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.split", "split")
      .where(`p.userId = :userId`, { userId: userId })
      .andWhere("p.split IS NOT NULL")
      .andWhere("split.splitUserId NOT IN ('null@gmail.com', '')")
      .getOne();

    return splitUserId?.split?.splitUserId;
  }

  public async findNearestNameForPurchase(
    userId: string,
    purchase: PurchaseEntity
  ): Promise<string> {
    const amount = purchase.amount;
    const type = purchase.type;

    const foundPurchase = await this.ormRepository
      .createQueryBuilder("p")
      .where(`p.userId = :userId and p.type= :type`, {
        userId: userId,
        type: type,
      })
      .orderBy("ABS(p.amount - :amount)", "ASC")
      .setParameter("amount", amount)
      .getOne();

    return foundPurchase?.name;
  }

  public async findNearestBetweenNameForPurchase(
    userId: string,
    purchase: PurchaseEntity,
    maxValue: number,
    minValue: number
  ): Promise<string> {
    const amount = purchase.amount;
    const type = purchase.type;

    const foundPurchase: { name: string } = await this.ormRepository
      .createQueryBuilder("p")
      .select([`p.name as name`, `COUNT(p.name) as nameCount`])
      .where(`p.userId = :userId and p.type= :type`, {
        userId: userId,
        type: type,
      })
      .andWhere(`p.amount BETWEEN :minValue AND :maxValue`, {
        maxValue: maxValue,
        minValue: minValue,
      })
      .setParameter("amount", amount)
      .groupBy("p.name")
      .orderBy("nameCount", "DESC")
      .getRawOne();

    return foundPurchase?.name;
  }

  public async findPurchaseWithRefundId(userId: string, refundId: number) {
    const purchase = await this.ormRepository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.wasRefunded", "wasRefunded")
      .andWhere(`p.userId = :userId`, { userId: userId })
      .andWhere("p.wasRefunded = :refundId", { refundId: refundId })
      .getOne();

    return purchase;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
