import { createClient } from "redis";
import { Envs } from "../infrastructure/config";
import { Adapter, Option } from "./adapters";

class RedisAdapter implements Option {
  adapter: Adapter;

  constructor(adapter: Adapter) {
    this.adapter = adapter;
  }

  Start() {
    this.start();
  }

  Close() {
    if (this.adapter.redis) {
      this.adapter.redis.destroy();
    }
  }

  private async start() {
    const redisUrl = Envs?.redis.host;
    const redisPort = Envs?.redis.port;
    const redisPassword = Envs?.redis.password || undefined;
    const redisDatabase = Envs?.redis.database || 0;

    this.adapter.redis = createClient({
      url: `redis://${redisUrl}:${redisPort}`,
      password: redisPassword,
      database: redisDatabase,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error("Redis connection retries exceeded");
          }
          return Math.min(retries * 50, 1000);
        },
      },
    })

    //error handling
    this.adapter.redis.on("error", (err) => {
      console.error("Redis connection error:", err)
    })

    this.adapter.redis.on("ready", () => {
      console.log("Redis client ready")
    })

    try {
      // Connect to Redis first
      await this.adapter.redis.connect()

      // Ping to redis after connection is established
      const res = await this.adapter.redis.ping()
      console.log("Redis connected successfully:", res)
    } catch (error) {
      console.error("Failed to connect to Redis:", error)
      throw error
    }
  }
}

export { RedisAdapter }
