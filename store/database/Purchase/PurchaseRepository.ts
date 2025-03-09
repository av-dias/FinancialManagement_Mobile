import { Between, Connection, Repository, Like } from "typeorm";
import { PurchaseModel } from "./PurchaseEntity";

export class PurchaseRepository {
  private ormRepository: Repository<PurchaseModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(PurchaseModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getAll(userId: string): Promise<PurchaseModel[]> {
    const purchases = await this.ormRepository?.find({
      where: { userId: userId },
      relations: ["split"], // Add this line
    });
    return purchases;
  }

  public async getByDate(userId: string, month: number, year: number): Promise<PurchaseModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toLocaleDateString();
    const lastDayOfMonth = new Date(year, month, 0).toLocaleDateString();

    const purchases = await this.ormRepository.find({
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayOfMonth),
      },
      relations: ["split"], // Add this line
    });

    console.log(purchases);
    console.log(firstDayOfMonth);
    console.log(lastDayOfMonth);

    return purchases;
  }

  public async updateOrCreate(purchaseModel: PurchaseModel): Promise<PurchaseModel> {
    const newPurchase = await this.ormRepository.save(purchaseModel);
    console.log(newPurchase);
    return newPurchase;
  }

  public async getFromType(userId: string, type: string, month: number, year: number): Promise<PurchaseModel[]> {
    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString();
    const lastDayOfMonth = new Date(year, month, 0).toISOString();

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

  public async getAvailableMonths(userId: string, year: number): Promise<number[]> {
    const distinctMonths = await this.ormRepository
      .createQueryBuilder("p")
      .select("strftime('%m', p.date)", "month") // Extract year and month
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, { userId: userId, year: year.toString() })
      .orderBy("month")
      .distinct()
      .getRawMany();

    return distinctMonths.map((item) => Number(item.month));
  }

  public async getAvailableTypes(userId: string) {
    const distinctTypes = await this.ormRepository.createQueryBuilder("p").select("p.type as type").distinct().where(`p.userId = :userId`, { userId: userId }).orderBy("type").getRawMany();

    return distinctTypes.map((item) => item.type);
  }

  public async sumPurchaseYearPerType(userId: string, year: number) {
    const sumByType = {};
    const sumArray = await this.ormRepository
      .createQueryBuilder("p")
      .select("type, SUM(CASE WHEN isRefund = true THEN -amount ELSE amount END) as total")
      .where(`p.userId = :userId AND strftime('%Y', p.date) = :year`, { userId: userId, year: year.toString() })
      .groupBy("type")
      .getRawMany();

    sumArray.map((sum) => (sumByType[sum.type] = sum.total));

    return sumByType;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.clear();
  }
}
