import { ANALYSES_TYPE } from "../../utility/keys";

export const isLoaded = (listObjects: any[]): boolean =>
  listObjects.every((object) => Object.keys(object).length !== 0);

export const handleAverageRequest = async (
  email,
  expensesService,
  currentYear
) => {
  const expensesAverageByType = await expensesService.getExpenseAverageByType(
    email,
    Number(currentYear),
    ANALYSES_TYPE.Total
  );

  let expensesPrevAverageByType = await expensesService.getExpenseAverageByType(
    email,
    Number(currentYear) - 1,
    ANALYSES_TYPE.Total
  );

  let expensesAverageTotal = await expensesService.getExpensesTotalAverage(
    email,
    Number(currentYear),
    ANALYSES_TYPE.Total
  );

  const expensesPrevAverageTotal =
    await expensesService.getExpensesTotalAverage(
      email,
      Number(currentYear) - 1,
      ANALYSES_TYPE.Total
    );

  return {
    expensesAverageByType: expensesAverageByType,
    expensesPrevAverageByType: expensesPrevAverageByType,
    expensesAverageTotal: expensesAverageTotal,
    expensesPrevAverageTotal: expensesPrevAverageTotal,
  };
};

export const handleCurrentRequest = async (
  email,
  expensesService,
  currentYear,
  month
) => {
  const expensesCurrentMonthPerType =
    await expensesService.getMonthExpensesByType(
      email,
      month,
      Number(currentYear),
      ANALYSES_TYPE.Total
    );

  const expensesMonthTotal = await expensesService.getTotalExpensesOnMonth(
    email,
    month,
    Number(currentYear),
    ANALYSES_TYPE.Total
  );
  let expensesPrevYearTotalByType = await expensesService.getExpenseTotalByType(
    email,
    Number(currentYear) - 1,
    ANALYSES_TYPE.Total
  );
  const expensesYearTotalByType = await expensesService.getExpenseTotalByType(
    email,
    Number(currentYear),
    ANALYSES_TYPE.Total
  );

  return {
    expensesCurrentMonthPerType: expensesCurrentMonthPerType,
    expensesMonthTotal: expensesMonthTotal,
    expensesPrevYearTotalByType: expensesPrevYearTotalByType,
    expensesYearTotalByType: expensesYearTotalByType,
  };
};
