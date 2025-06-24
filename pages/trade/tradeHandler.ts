import {
  InvestmentEntity,
  newInvestment,
  newSecurity,
  SecurityEntity,
} from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import React from "react";
import { SecurityRepository } from "../../store/database/SecurityInvestment/SecurityRepository";
import { eventEmitter, NotificationEvent } from "../../utility/eventEmitter";
import { createNotification } from "../../components/NotificationBox/NotificationBox";
import { dark } from "../../utility/colors";

export const addInvestmentCallback = async (
  investment: InvestmentEntity,
  setInvestment,
  securityInvestmentService,
  setRefresh
) => {
  if (!investment.buyDate || !investment.shares || !investment.security) {
    eventEmitter.emit(
      NotificationEvent,
      createNotification("Please fill all fields.", dark.error)
    );
    return;
  }

  await securityInvestmentService.insertInvestment(
    investment,
    investment.security.ticker
  );
  setRefresh((prev) => !prev);
  //setModalVisible(null);
  setInvestment(newInvestment(investment.userId));
};

export const addSecurityCallback = async (
  security: SecurityEntity,
  securityRepository: SecurityRepository,
  setSecurity,
  setRefresh
) => {
  if (
    !security.name ||
    !security.ticker ||
    security.name.trim() === "" ||
    security.ticker.trim() === ""
  ) {
    eventEmitter.emit(
      NotificationEvent,
      createNotification("Please fill all fields.", dark.error)
    );
    return;
  }

  await securityRepository.updateOrCreate(security);
  setSecurity(newSecurity());
  setRefresh((prev) => !prev);
  //setModalVisible(null);
};

export const editOption = (
  setSelectedItem: React.Dispatch<React.SetStateAction<InvestmentEntity>>,
  item: InvestmentEntity,
  setInvestment: React.Dispatch<React.SetStateAction<InvestmentEntity>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setModalType: React.Dispatch<React.SetStateAction<"Trade" | "Security">>
) => ({
  callback: async () => {
    setSelectedItem(item);
    setModalVisible(true);
    setModalType("Trade");
    setInvestment(item);
  },
  type: "Edit",
});
