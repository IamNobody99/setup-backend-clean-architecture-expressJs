import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { getAdapters, initializeAdapters } from "../internal/adapter/adapters";
import { MySqlAdapter } from "../internal/adapter/mysql";
import { RedisAdapter } from "../internal/adapter/redis";
import {
  Configure,
  createConfiguration,
} from "../internal/infrastructure/config";
import { setupAuthRoutes } from "../internal/routes/auth";

function runServer() {
  const configure = createConfiguration({
    path: "./",
    filename: ".env",
  })

  configure.initialize()

  const config = Configure.getInstance()

  const adapter = initializeAdapters()
  adapter.sync([new MySqlAdapter(adapter), new RedisAdapter(adapter)])

  const app = express();
  app.use(
    //setting cors
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-TOKEN", "Accept"],
      exposedHeaders: ["Content-Type", "Content-Length", "X-TOKEN"],
      credentials: false,
      preflightContinue: false,
      optionsSuccessStatus: 200,
    })
  )

  const upload = multer()
  app.use(express.json())
  app.use(upload.any())

  setupAuthRoutes(app)

  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Hello World!",
      environment: config.app.environment,
      port: config.app.port,
      app: {
        name: config.app.name,
        baseUrl: config.app.baseURL,
        logLevel: config.app.logLevel,
      },
      database: {
        host: config.mysql.host,
        port: config.mysql.port,
        database: config.mysql.database,
      },
      redis: {
        host: config.redis.host,
        port: config.redis.port,
      },
    })
  })

  const port = parseInt(config.app.port, 10)
  app.listen(port, () => {
    console.log(
      `🚀 Server running on port ${port} in ${config.app.environment} environment`
    )
    console.log(`🔗 Visit: ${config.app.baseURL}`)
    console.log(
      `📊 Database: ${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`
    )
    console.log(`📦 Redis: ${config.redis.host}:${config.redis.port}`)
  })
}

export { runServer };
