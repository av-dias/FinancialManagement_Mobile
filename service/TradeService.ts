import { Dispatch, SetStateAction } from "react";
import { useDatabaseConnection } from "../store/database-context";
import { InvestmentRepository } from "../store/database/SecurityInvestment/InvestmentRepository";
import { SecurityRepository } from "../store/database/SecurityInvestment/SecurityRepository";
import { eventEmitter, NotificationEvent } from "../utility/eventEmitter";
import {
  createNotification,
  NotificationData,
} from "../components/NotificationBox/NotificationBox";

export class TradeService {
  private securityRepository: SecurityRepository =
    useDatabaseConnection().securityRepository;
  private investmentRepository: InvestmentRepository =
    useDatabaseConnection().investmentRepository;

  public isReady() {
    return (
      this.securityRepository.isReady() && this.investmentRepository.isReady()
    );
  }

  public async deleteSecurtyByTicker(
    securityTicker: string,
    userId: string,
    setRefresh: Dispatch<SetStateAction<boolean>>
  ) {
    try {
      // This effectively gives us a list of all security tickers that are currently linked to investments.
      const linkedTickers =
        await this.investmentRepository.getAllLinkedSecurities(userId);

      if (linkedTickers.includes(securityTicker)) {
        eventEmitter.emit(
          NotificationEvent,
          createNotification("Cannot delete, ticker in use.", "orange")
        );
      } else {
        await this.securityRepository.deleteUnlinkedSecurity(securityTicker);
        console.log(`Delete ticker ${securityTicker}.`);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting unlinked securities:", error);
      // Re-throw the error or handle it as appropriate for your application
      throw error;
    }
  }
}
