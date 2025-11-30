import { PrismaClient } from "@prisma/client";
import { Envs } from "../infrastructure/config";
import { Adapter, Option } from "./adapters";

class MySqlAdapter implements Option {
  adapter: Adapter;

  constructor(adapter: Adapter) {
    this.adapter = adapter;
  }

  Start() {
    this.start();
  }

  Close() {
    if (this.adapter.mysql) {
      this.adapter.mysql.$disconnect();
    }
  }

  private start() {
    const dbUser = Envs?.mysql.username;
    const dbPassword = Envs?.mysql.password;
    const dbHost = Envs?.mysql.host;
    const dbName = Envs?.mysql.database;
    const dbPort = Envs?.mysql.port;

    const connectionString = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

    this.adapter.mysql = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });

    this.adapter.mysql.$connect().then(() => {
      console.log("MySQL ping test successful!")
    }).catch((error: Error) => {
        throw error
    })
  }
}

export { MySqlAdapter }
