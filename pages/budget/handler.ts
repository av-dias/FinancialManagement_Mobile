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
    ANALYSES_TYPE.Personal
  );

  let expensesPrevAverageByType = await expensesService.getExpenseAverageByType(
    email,
    Number(currentYear) - 1,
    ANALYSES_TYPE.Personal
  );

  let expensesAverageTotal = await expensesService.getExpensesTotalAverage(
    email,
    Number(currentYear),
    ANALYSES_TYPE.Personal
  );

  const expensesPrevAverageTotal =
    await expensesService.getExpensesTotalAverage(
      email,
      Number(currentYear) - 1,
      ANALYSES_TYPE.Personal
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
      ANALYSES_TYPE.Personal
    );

  const expensesMonthTotal = await expensesService.getTotalExpensesOnMonth(
    email,
    month,
    Number(currentYear),
    ANALYSES_TYPE.Personal
  );
  let expensesPrevYearTotalByType = await expensesService.getExpenseTotalByType(
    email,
    Number(currentYear) - 1,
    ANALYSES_TYPE.Personal
  );
  const expensesYearTotalByType = await expensesService.getExpenseTotalByType(
    email,
    Number(currentYear),
    ANALYSES_TYPE.Personal
  );

  return {
    expensesCurrentMonthPerType: expensesCurrentMonthPerType,
    expensesMonthTotal: expensesMonthTotal,
    expensesPrevYearTotalByType: expensesPrevYearTotalByType,
    expensesYearTotalByType: expensesYearTotalByType,
  };
};
