import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getConnectionManager, Connection } from "typeorm";

import { PortfolioRepository } from "./database/Portfolio/PortfolioRepository";
import { PortfolioModel } from "./database/Portfolio/PortfolioEntity";
import { PortfolioItemModel } from "./database/PortfolioItem/PortfolioItemEntity";
import { PortfolioItemRepository } from "./database/PortfolioItem/PortfolioItemRepository";
import { IncomeRepository } from "./database/Income/IncomeRepository";
import { IncomeModel } from "./database/Income/IncomeEntity";

interface DatabaseConnectionContextData {
  portfolioRepository: PortfolioRepository;
  portfolioItemRepository: PortfolioItemRepository;
  incomeRepository: IncomeRepository;
}

export const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
);

export const DatabaseConnectionProvider = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async () => {
    console.log("Connecting to...");
    try {
      const connectionManager = getConnectionManager();

      // Check wheter there was a connection already created
      if (connectionManager.has("default")) {
        setConnection(connectionManager.get("default"));
        return;
      }

      const managedConnection = connectionManager.create({
        type: "expo",
        database: "fm_mobile.db",
        driver: require("expo-sqlite"),
        entities: [PortfolioModel, PortfolioItemModel, IncomeModel],

        //If you're not using migrations, you can delete these lines,
        //since the default is no migrations:
        migrations: [],
        migrationsRun: false,
        // If you're not using migrations also set this to true
        synchronize: true,
      });

      const createdConnection = await managedConnection.connect();
      setConnection(createdConnection);
    } catch (error) {
      console.error("Database connection failed:", error);
      // Implement retry
      setTimeout(() => {
        connect();
      }, 5000); // Retry after 10 seconds (adjust as needed)
    }
  }, []);

  useEffect(() => {
    if (!connection) {
      connect();
    }
    console.log(`Database  UseEffect triggered: ${connection}`);
  }, [connect, connection]);

  if (!connection) {
    console.log("Connection failed...");
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        portfolioRepository: new PortfolioRepository(connection),
        portfolioItemRepository: new PortfolioItemRepository(connection),
        incomeRepository: new IncomeRepository(connection),
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  return context;
}
