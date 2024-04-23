export const isCtxLoaded = (ctx, year, month) => {
  return (
    ctx &&
    Object.keys(ctx).length > 0 &&
    ctx["transactionTotal"] &&
    ctx["expenseByType"] &&
    ctx["splitDept"] &&
    Object.keys(ctx["transactionTotal"]).length > 0 &&
    Object.keys(ctx["expenseByType"]).length > 0 &&
    Object.keys(ctx["splitDept"]).length > 0 &&
    ctx["transactionTotal"][year] &&
    ctx["expenseByType"][year] &&
    ctx["splitDept"][year] &&
    ctx["transactionTotal"][year][month] &&
    ctx["expenseByType"][year][month] &&
    ctx["splitDept"][year][month]
  );
};
