import { Request, Response } from "express";
import { TransactionClient } from "../../../../pkg/type/transaction-client";


export interface AuthRepositoryInterface {
  createAccount(accountData: any, tx?: TransactionClient): Promise<any>
  updateAccount(where: any, data: any, tx?: TransactionClient): Promise<any>
  softDeleteAccount(uuid: string, tx?: TransactionClient): Promise<any>
  findAccountByEmail(email: string, tx?: TransactionClient): Promise<any | null>
  findAccountByPhone(phone: string, tx?: TransactionClient): Promise<any | null>
}

export interface AuthServiceInterface {
  register(accountData: any): Promise<{ account: any; token: string }>
  login(credentials: any): Promise<{ account: any; token: string }>
}

export interface AuthControllerInterface {
  register(req: Request, res: Response): Promise<void>
  login(req: Request, res: Response): Promise<void>
}
