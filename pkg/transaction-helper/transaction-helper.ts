import { Prisma, PrismaClient } from "@prisma/client"
import { TransactionClient } from "../type/transaction-client"

/**
 * Transaction Helper Utility
 * Provides convenient methods for managing database transactions
 */
export class TransactionHelper {
  private db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  /**
   * Execute operations within a transaction
   * @param callback - Function that receives the transaction client
   * @returns Promise with the result of the callback
   */
  async executeTransaction<T>(
    callback: (tx: TransactionClient) => Promise<T>
  ): Promise<T> {
    return await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
      return await callback(tx as TransactionClient)
    })
  }

  /**
   * Execute operations within a transaction with timeout
   * @param callback - Function that receives the transaction client
   * @param timeout - Transaction timeout in milliseconds (default: 5000ms)
   * @returns Promise with the result of the callback
   */
  async executeTransactionWithTimeout<T>(
    callback: (tx: TransactionClient) => Promise<T>,
    timeout: number = 5000
  ): Promise<T> {
    return await this.db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        return await callback(tx as TransactionClient)
      },
      {
        timeout,
      }
    )
  }

  /**
   * Execute operations within a transaction with isolation level
   * @param callback - Function that receives the transaction client
   * @param isolationLevel - Transaction isolation level
   * @returns Promise with the result of the callback
   */
  async executeTransactionWithIsolation<T>(
    callback: (tx: TransactionClient) => Promise<T>,
    isolationLevel:
      | "ReadUncommitted"
      | "ReadCommitted"
      | "RepeatableRead"
      | "Serializable" = "ReadCommitted"
  ): Promise<T> {
    return await this.db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        return await callback(tx as TransactionClient)
      },
      {
        isolationLevel,
      }
    )
  }

  /**
   * Execute operations within a transaction with full options
   * @param callback - Function that receives the transaction client
   * @param options - Transaction options
   * @returns Promise with the result of the callback
   */
  async executeTransactionWithOptions<T>(
    callback: (tx: TransactionClient) => Promise<T>,
    options: {
      timeout?: number
      isolationLevel?:
        | "ReadUncommitted"
        | "ReadCommitted"
        | "RepeatableRead"
        | "Serializable"
    } = {}
  ): Promise<T> {
    return await this.db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        return await callback(tx as TransactionClient)
      },
      {
        timeout: options.timeout || 5000,
        isolationLevel: options.isolationLevel || "ReadCommitted",
      }
    )
  }
}

/**
 * Transaction decorator for service methods
 * Automatically wraps service methods in transactions
 */
export function withTransaction(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value

  descriptor.value = async function (...args: any[]) {
    const adapter = require("../../internal/adapter/adapters").getAdapters()
    const transactionHelper = new TransactionHelper(adapter.mysql)

    return await transactionHelper.executeTransaction(async (tx) => {
      // Add transaction client to the method arguments
      return await method.apply(this, [...args, tx])
    })
  }

  return descriptor
}
