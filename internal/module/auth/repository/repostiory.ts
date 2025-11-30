import { PrismaClient } from "@prisma/client";
import { AuthRepositoryInterface } from "../ports/ports";
import { TransactionClient } from "../../../../pkg/type/transaction-client";

export class AuthRepository implements AuthRepositoryInterface {
    db: PrismaClient

    constructor(db: PrismaClient){
        this.db = db
    }

    async createAccount(accountData: any, tx?: TransactionClient): Promise<any> {
        return await (tx ?? this.db).accounts.create({
            data: accountData,
        })
    }

    async findAccountByEmail(
        email: string,
        tx?: TransactionClient
    ): Promise<any | null> {
        return await (tx ?? this.db).accounts.findUnique({
            where: { email },
        })
    }

    async findAccountByPhone(
        phone: string,
        tx?: TransactionClient
    ): Promise<any | null> {
        return await (tx ?? this.db).accounts.findUnique({
            where: { phone },
        })
    }

    async updateAccount(
        where: any,
        data: any,
        tx?: TransactionClient
    ): Promise<any> {
        return await (tx ?? this.db).accounts.update({
            where,
            data,
        })
    }

    async softDeleteAccount(uuid: string, tx?: TransactionClient): Promise<any> {
        return await (tx ?? this.db).accounts.update({
            where: { uuid },
            data: { deleted_at: new Date() },
        })
    }
}