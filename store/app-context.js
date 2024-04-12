import { createContext, useContext, useState, useEffect } from "react";
import { getAllPurchaseStats } from "../functions/purchase";
import { getUser } from "../functions/basic";
import { UserContext } from "./user-context";

export const AppContext = createContext({ purchase: [], transaction: [] });

const AppContextProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransaction] = useState([]);

  const userCtx = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      if (userCtx.email) {
        let resPurchases = await getAllPurchaseStats(userCtx.email);
        setPurchases(resPurchases);
      }
    }
    fetchData();
  }, [userCtx]);

  const addPurchase = () => {};
  const removePurchase = () => {};

  const value = {
    purchase: purchases,
    transaction: transactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
