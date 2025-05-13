import { Connection, LessThan, Repository } from "typeorm";
import { SubscriptionModel } from "./SubscriptionEntity";

export class SubscriptionRepository {
  private ormRepository: Repository<SubscriptionModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection?.getRepository(SubscriptionModel);
  }

  public isReady = () => {
    return this.ormRepository == undefined ? false : true;
  };

  public async getAll(userId: string): Promise<SubscriptionModel[]> {
    const subscriptions = await this.ormRepository?.find({
      where: { userId: userId },
    });
    return subscriptions;
  }

  public async getAllBeforeDate(userId: string, date: Date): Promise<SubscriptionModel[]> {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startOfMonth = new Date(year, month, 1).toISOString();

    const subscriptions = await this.ormRepository?.find({
      where: { userId: userId, lastUpdateDate: LessThan(startOfMonth) },
    });
    return subscriptions;
  }

  public async updateOrCreate(subcriptionModel: SubscriptionModel): Promise<SubscriptionModel> {
    const newSubscription = await this.ormRepository.save(subcriptionModel);
    return newSubscription;
  }

  public async updateLastUpdateDate(userId: string, subscriptionId: number) {
    await this.ormRepository.update(
      { userId: userId, id: subscriptionId }, // The 'where' clause: find the subscription by its ID and user id
      { lastUpdateDate: new Date() } // The 'set' clause: update lastUpdateDate with the current date/time
    );
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(userId: string): Promise<void> {
    await this.ormRepository.delete({ userId: userId });
  }
}
