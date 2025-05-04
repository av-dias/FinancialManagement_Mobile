import { PortfolioWithItemEntity } from "../store/database/Portfolio/PortfolioEntity";

export const loadWorthData = (curr: PortfolioWithItemEntity[], prev: PortfolioWithItemEntity[]) => {
  let networth = 0,
    grossworth = 0,
    prevNetworth = 0,
    prevGrossworth = 0;

  curr.forEach((p) => {
    p.networthFlag && (networth += Number(p.item.value));
    p.grossworthFlag && (grossworth += Number(p.item.value));
  });

  prev.forEach((p) => {
    p.networthFlag && (prevNetworth += Number(p.item.value));
    p.grossworthFlag && (prevGrossworth += Number(p.item.value));
  });

  return { currWorth: { networth: networth, grossworth: grossworth }, prevWorth: { networth: prevNetworth, grossworth: prevGrossworth } };
};

export const loadPortfolioAnalyses = (currWorth, prevWorth) => {
  const networthAbsolute = currWorth.networth - prevWorth.networth;
  const grossworthAbsolute = currWorth.grossworth - prevWorth.grossworth;

  const networthRelative = (networthAbsolute / currWorth.networth) * 100 || 0;
  const grosswortRelative = (grossworthAbsolute / currWorth.grossworth) * 100 || 0;

  return {
    networth: { absolute: networthAbsolute, relative: networthRelative },
    grossworth: { absolute: grossworthAbsolute, relative: grosswortRelative },
  };
};
