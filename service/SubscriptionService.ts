import { createNotification } from "../components/NotificationBox/NotificationBox";
import { ExpenseEnum } from "../models/types";
import { useDatabaseConnection } from "../store/database-context";
import {
  SubscriptionEntity,
  subscriptionMapper,
  SubscriptionModel,
} from "../store/database/Subscription/SubscriptionEntity";
import { SubscriptionRepository } from "../store/database/Subscription/SubscriptionRepository";
import { dark } from "../utility/colors";
import { eventEmitter, NotificationEvent } from "../utility/eventEmitter";
import { ExpensesService } from "./ExpensesService";

export class SubscriptionService {
  private readonly subscriptionRepository: SubscriptionRepository =
    useDatabaseConnection().subscriptionRepository;
  private readonly expenseService = new ExpensesService();

  public isReady() {
    return this.subscriptionRepository.isReady();
  }

  public async getAll(userId: string): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.subscriptionRepository.getAll(userId);
    return subscriptions.map((s) => subscriptionMapper(s));
  }

  public async getAllBeforeDate(
    userId: string,
    date: Date
  ): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.subscriptionRepository.getAllBeforeDate(
      userId,
      date
    );
    return subscriptions.map((s) => subscriptionMapper(s));
  }

  public async createSubscription(
    userId: string,
    subscriptionEntity: SubscriptionEntity
  ): Promise<void> {
    if (!subscriptionEntity.dayOfMonth || !subscriptionEntity.item) {
      eventEmitter.emit(
        NotificationEvent,
        createNotification("Please fill all fields.", dark.error)
      );
      throw new Error("Please fill all fields.");
    }
    if (!subscriptionEntity.lastUpdateDate)
      subscriptionEntity.lastUpdateDate = new Date()
        .toISOString()
        .split("T")[0];

    const subscription = new SubscriptionModel();
    subscription.id = subscriptionEntity?.id;
    subscription.entity = subscriptionEntity.entity;
    subscription.dayOfMonth = subscriptionEntity.dayOfMonth;
    subscription.lastUpdateDate = new Date(subscriptionEntity.lastUpdateDate);
    subscription.userId = subscriptionEntity.userId;

    if (subscriptionEntity.item.entity === ExpenseEnum.Income) {
      // TODO: Implement this feature
      eventEmitter.emit(
        NotificationEvent,
        createNotification("This feature is not enabled yet.", dark.error)
      );
    } else {
      subscription.item = JSON.stringify(
        await this.expenseService.getExpenseByIdAndType(
          userId,
          subscriptionEntity.item.id,
          subscriptionEntity.item.entity
        )
      );
    }

    await this.subscriptionRepository.updateOrCreate(subscription);
  }

  public async updateLastUpdateDate(userId: string, subscriptionId: number) {
    await this.subscriptionRepository.updateLastUpdateDate(
      userId,
      subscriptionId
    );
  }

  public async deleteById(id: number) {
    await this.subscriptionRepository.delete(id);
  }

  public async deleteAll(userId: string) {
    await this.subscriptionRepository.deleteAll(userId);
  }
}
