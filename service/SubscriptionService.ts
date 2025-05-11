import { ExpenseEnum } from "../models/types";
import { useDatabaseConnection } from "../store/database-context";
import { SubscriptionEntity, subscriptionMapper, SubscriptionModel } from "../store/database/Subscription/SubscriptionEntity";
import { SubscriptionRepository } from "../store/database/Subscription/SubscriptionRepository";
import { ExpensesService } from "./ExpensesService";

export class SubscriptionService {
  private readonly subscriptionRepository: SubscriptionRepository = useDatabaseConnection().subscriptionRepository;
  private readonly expenseService = new ExpensesService();

  public isReady() {
    return this.subscriptionRepository.isReady();
  }

  public async getAll(userId: string): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.subscriptionRepository.getAll(userId);
    return subscriptions.map((s) => subscriptionMapper(s));
  }

  public async createSubscription(userId: string, subscriptionEntity: SubscriptionEntity): Promise<void> {
    if (!subscriptionEntity.dayOfMonth || !subscriptionEntity.item) {
      alert("Please fill all fields.");
      throw new Error("Please fill all fields.");
    }
    if (!subscriptionEntity.lastUpdateDate) subscriptionEntity.lastUpdateDate = new Date().toISOString().split("T")[0];

    const subscription = new SubscriptionModel();
    subscription.id = subscriptionEntity?.id;
    subscription.entity = subscriptionEntity.entity;
    subscription.dayOfMonth = subscriptionEntity.dayOfMonth;
    subscription.lastUpdateDate = new Date(subscriptionEntity.lastUpdateDate);
    subscription.userId = subscriptionEntity.userId;

    if (subscriptionEntity.item.entity === ExpenseEnum.Income) {
      // TODO: Implement this feature
      alert("This feature is not enabled yet.");
    } else {
      subscription.item = JSON.stringify(await this.expenseService.getExpenseByIdAndType(userId, subscriptionEntity.item.id, subscriptionEntity.item.entity));
    }

    console.log(subscription);
    await this.subscriptionRepository.updateOrCreate(subscription);
  }
}
