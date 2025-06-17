import {
  InvestmentEntity,
  newInvestment,
  newSecurity,
  SecurityEntity,
} from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import React from "react";

export const addInvestmentCallback = async (
  investment: InvestmentEntity,
  setInvestment,
  securityInvestmentService,
  setRefresh
) => {
  if (
    investment.security.ticker === "" ||
    investment.buyPrice == 0 ||
    investment.shares == 0
  ) {
    alert("Please fill in all fields correctly.");
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
  securityRepository,
  setSecurity,
  setRefresh
) => {
  if (security.name === "" || security.ticker === "") return;

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
