import { InvestmentEntity } from "../../store/database/SecurityInvestment/SecurityInvestmentEntity";
import React from "react";

export const createInvestment = (
  inputShareValue,
  inputBuyPrice,
  inputBuyDate,
  email
): InvestmentEntity => {
  return {
    shares: Number(inputShareValue.replace(",", ".")),
    buyPrice: Number(inputBuyPrice),
    buyDate: inputBuyDate,
    userId: email,
  };
};

export const addInvestmentCallback = async (
  inputInvestmentTicker,
  inputBuyDate,
  inputShareValue,
  inputBuyPrice,
  securityInvestmentService,
  setRefresh,
  setInputBuyPrice,
  setInputShareValue,
  email
) => {
  if (
    inputInvestmentTicker === "" ||
    inputBuyPrice == 0 ||
    Number(inputShareValue) == 0
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  await securityInvestmentService.insertInvestment(
    createInvestment(inputShareValue, inputBuyPrice, inputBuyDate, email),
    inputInvestmentTicker
  );
  setRefresh((prev) => !prev);
  //setModalVisible(null);
  setInputBuyPrice(0);
  setInputShareValue("0");
};

export const addSecurityCallback = async (
  inputName,
  inputTicker,
  securityRepository,
  setInputName,
  setInputTicker,
  setRefresh
) => {
  if (inputName === "" || inputTicker === "") return;

  await securityRepository.updateOrCreate({
    name: inputName,
    ticker: inputTicker,
  });
  setInputName("");
  setInputTicker("");
  setRefresh((prev) => !prev);
  //setModalVisible(null);
};
export const editOption = (
  setSelectedItem: React.Dispatch<React.SetStateAction<InvestmentEntity>>,
  item: InvestmentEntity,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setModalType: React.Dispatch<React.SetStateAction<"Trade" | "Security">>
) => ({
  callback: async () => {
    /* setSelectedItem(item);
    setModalVisible(true);
    setModalType("Trade"); */
    alert("Not implemented yet");
  },
  type: "Edit",
});
