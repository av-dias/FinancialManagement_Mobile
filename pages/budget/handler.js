import { _styles } from "./style";

const styles = _styles;

export const isLoaded = (spendAverageByType, purchaseCurrentStats, expensesTotalByType) =>
  Object.keys(spendAverageByType).length !== 0 && Object.keys(purchaseCurrentStats).length !== 0 && Object.keys(expensesTotalByType).length !== 0;
