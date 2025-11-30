import dotenv from "dotenv";

// Global singleton instance
let Envs: Config | null = null;
let initialized = false;

interface AppConfig {
  name: string;
  environment: string;
  baseURL: string;
  //   frontendBaseURL: string
  port: string;
  logLevel: string;
  logFile: string;
  localStoragePublicPath: string;
  localStoragePrivatePath: string;
  emailAppPassword: string;
  emailServiceAddress: string;
  timeoutDuration: number;
  historyDeleteDurationInMonth: number;
  cookieSecure: boolean;
  cookieSameSite: string;
}

interface DBConfig {
  connectionTimeout: number;
  maxOpenCons: number;
  maxIdleCons: number;
  connMaxLifetime: number;
  SchemaName: string;
}

interface GuardConfig {
  jwtPrivateKey: string;
  jwtAccessTokenExpiration: number;
  jwtRefreshTokenExpiration: number;
}

interface MySqlConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  sslMode: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  database: number;
}

/* -------------------------------------------------------------------------- */
/*                                  CONFIG                                    */
/* -------------------------------------------------------------------------- */

class Config {
  public app: AppConfig;
  public db: DBConfig;
  public guard: GuardConfig;
  public mysql: MySqlConfig;
  public redis: RedisConfig;

  constructor() {
    this.app = this.loadAppConfig();
    this.db = this.loadDBConfig();
    this.guard = this.loadGuardConfig();
    this.mysql = this.loadMySQLConfig();
    this.redis = this.loadRedisConfig();
  }

  /* --------------------------------- HELPERS -------------------------------- */

  private getEnv(key: string, defaultValue: string = ""): string {
    return process.env[key] || defaultValue;
  }

  private getEnvNumber(key: string, defaultValue = 0): number {
    const value = process.env[key];
    return value ? Number(value) : defaultValue;
  }

  private getEnvBool(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    return value ? value.toLowerCase() === "true" : defaultValue;
  }

  /* ------------------------------ LOAD SECTIONS ----------------------------- */

  private loadAppConfig(): AppConfig {
    return {
      name: this.getEnv("APP_NAME"),
      environment: this.getEnv("APP_ENV", "development"),
      baseURL: this.getEnv("APP_BASE_URL", "http://localhost:5000"),
      //   frontendBaseURL: this.getEnv(
      //     "APP_FRONTEND_BASE_URL",
      //     "http://localhost:6000"
      //   ),
      port: this.getEnv("PORT", "5000"),
      logLevel: this.getEnv("APP_LOG_LEVEL", "debug"),
      logFile: this.getEnv("APP_LOG_FILE", "./logs/app.log"),
      localStoragePublicPath: this.getEnv(
        "LOCAL_STORAGE_PUBLIC_PATH",
        "./storage/public"
      ),
      localStoragePrivatePath: this.getEnv(
        "LOCAL_STORAGE_PRIVATE_PATH",
        "./storage/private"
      ),
      emailAppPassword: this.getEnv("EMAIL_APP_PASSWORD"),
      emailServiceAddress: this.getEnv("EMAIL_SERVICE_ADDRESS"),
      timeoutDuration: this.getEnvNumber("TIMEOUT_DURATION", 30),
      historyDeleteDurationInMonth: this.getEnvNumber(
        "HISTORY_DELETE_DURATION",
        1
      ),
      cookieSecure: false,
      cookieSameSite: "Lax",
    };
  }

  private loadDBConfig(): DBConfig {
    return {
      connectionTimeout: this.getEnvNumber("DB_CONN_TIMEOUT", 30),
      maxOpenCons: this.getEnvNumber("DB_MAX_OPEN_CONS", 20),
      maxIdleCons: this.getEnvNumber("DB_MAX_IDLE_CONS", 20),
      connMaxLifetime: this.getEnvNumber("DB_CONN_MAX_LIFETIME", 0),
      SchemaName: this.getEnv("SCHEMA_NAME", ""),
    };
  }

  private loadGuardConfig(): GuardConfig {
    return {
      jwtPrivateKey: this.getEnv("JWT_PRIVATE_KEY"),
      jwtAccessTokenExpiration: this.getEnvNumber(
        "JWT_ACCESS_TOKEN_EXPIRATION",
        1
      ),
      jwtRefreshTokenExpiration: this.getEnvNumber(
        "JWT_REFRESH_TOKEN_EXPIRATION",
        120
      ),
    };
  }

  private loadMySQLConfig(): MySqlConfig {
    return {
      host: this.getEnv("MYSQL_HOST", "localhost"),
      port: this.getEnv("MYSQL_PORT", "3306"),
      username: this.getEnv("MYSQL_USER", "root"),
      password: this.getEnv("MYSQL_PASSWORD", ""),
      database: this.getEnv("MYSQL_DB", "mydb"),
      sslMode: this.getEnv("MYSQL_SSL_MODE", "disable"),
    };
  }

  private loadRedisConfig(): RedisConfig {
    return {
      host: this.getEnv("REDIS_HOST", "localhost"),
      port: this.getEnvNumber("REDIS_PORT", 6379),
      password: this.getEnv("REDIS_PASSWORD", ""),
      database: this.getEnvNumber("REDIS_DATABASE", 0),
    };
  }

  private setEnvironmentSpecificConfig(): void {
    if (this.app.environment === "production") {
      this.app.cookieSecure = true;
      this.app.cookieSameSite = "Lax";
    } else {
      this.app.cookieSecure = false;
      this.app.cookieSameSite = "Lax";
    }
  }
}

interface ConfigureOptions {
  path?: string;
  filename?: string;
}

class Configure {
  private path: string;
  private filename: string;

  constructor(options: ConfigureOptions = {}) {
    this.path = options.path || "./";
    this.filename = options.filename || ".env";
  }

  public initialize(): void {
    if (!initialized) {
      const envPath = `${this.path}${this.filename}`;
      dotenv.config({ path: envPath });

      Envs = new Config();
      initialized = true;

      console.log(`Configuration loaded from: ${envPath}`);
      console.log(`Environment: ${Envs.app.environment}`);
    }
  }

  public static getInstance(): Config {
    if (!Envs) {
      throw new Error(
        "Configuration not initialized. Call initialize() first."
      );
    }
    return Envs;
  }
}

function createConfiguration(options: ConfigureOptions = {}): Configure {
  return new Configure(options);
}

function withPath(
  path: string
): (options: ConfigureOptions) => ConfigureOptions {
  return (options: ConfigureOptions) => ({ ...options, path });
}

function withFilename(
  filename: string
): (options: ConfigureOptions) => ConfigureOptions {
  return (options: ConfigureOptions) => ({ ...options, filename });
}

export {
  Envs,
  Config,
  Configure,
  createConfiguration,
  withPath,
  withFilename,
  type AppConfig,
  type DBConfig,
  type GuardConfig,
  type MySqlConfig,
  type RedisConfig,
};
