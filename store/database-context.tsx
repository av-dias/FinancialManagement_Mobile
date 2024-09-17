import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Connection, createConnection } from "typeorm";

import { PortfolioRepository } from "./database/Portfolio/PortfolioRepository";
import { PortfolioModel } from "./database/Portfolio/PortfolioEntity";
import { PortfolioItemModel } from "./database/PortfolioItem/PortfolioItemEntity";
import { PortfolioItemRepository } from "./database/PortfolioItem/PortfolioItemRepository";

interface DatabaseConnectionContextData {
  portfolioRepository: PortfolioRepository;
  portfolioItemRepository: PortfolioItemRepository;
}

export const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>({} as DatabaseConnectionContextData);

export const DatabaseConnectionProvider = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async () => {
    try {
      const createdConnection = await createConnection({
        type: "expo",
        database: "fm_mobile.db",
        driver: require("expo-sqlite"),
        entities: [PortfolioModel, PortfolioItemModel],

        //If you're not using migrations, you can delete these lines,
        //since the default is no migrations:
        migrations: [],
        migrationsRun: false,
        // If you're not using migrations also set this to true
        synchronize: true,
      });

      setConnection(createdConnection);
    } catch (error) {
      console.error("Database connection failed:", error);
      // Implement retry logic here
      setTimeout(() => {
        connect();
      }, 5000); // Retry after 5 seconds (adjust as needed)
    }
  }, []);

  useEffect(() => {
    if (!connection) {
      connect();
    }
    console.log(`Database UseEffect triggered: ${connection}`);
  }, [connect, connection]);

  if (!connection) {
    console.log("Connection failed...");
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{ portfolioRepository: new PortfolioRepository(connection), portfolioItemRepository: new PortfolioItemRepository(connection) }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  return context;
}
