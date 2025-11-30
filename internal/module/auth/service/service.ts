import { RedisClientType } from "redis";
import { TransactionHelper } from "../../../../pkg/transaction-helper/transaction-helper";
import { getAdapters } from "../../../adapter/adapters";
import { Envs } from "../../../infrastructure/config";
import { RegisterDTO } from "../dto/dto";
import { AuthRepositoryInterface, AuthServiceInterface } from "../ports/ports";
import bcrypt from "bcrypt"
import { generateToken } from "../../../../pkg/auth-token-generate/auth-token-generate";



export class AuthService implements AuthServiceInterface {
    private authRepository: AuthRepositoryInterface
    private jwtSecret: string
    private jwtExpiresIn: string
    private saltRounds: number
    private redisClient: RedisClientType
    private transactionHelper: TransactionHelper


    constructor(
        authRepository: AuthRepositoryInterface,
        jwtSecret: string = Envs?.guard.jwtPrivateKey || "your-secret-key",
        jwtExpiresIn: string = `${Envs?.guard.jwtAccessTokenExpiration || 24}h`,
        saltRounds: number = 12
    ) {
        const adapter = getAdapters()

        this.authRepository = authRepository
        this.jwtSecret = jwtSecret
        this.jwtExpiresIn = jwtExpiresIn
        this.saltRounds = saltRounds
        this.redisClient = adapter.redis
        this.transactionHelper = new TransactionHelper(adapter.mysql)
    }

    async register(accountData: RegisterDTO): Promise<{ account:any, token:string }> {
      return await this.transactionHelper.executeTransaction(async (tx) => {
        const existingAccount = await this.authRepository.findAccountByEmail(accountData.email)
        if (existingAccount) throw new Error("Email already exists")

        const existingPhone = await this.authRepository.findAccountByPhone(accountData.phone)
        if (existingPhone) throw new Error("Phone number already exists")

        const hashedPassword = await bcrypt.hash(accountData.password, this.saltRounds)

        const createAccountInput: any = {
            email: accountData.email,
            phone: accountData.phone,
            hashed_password: hashedPassword,
        }

        const newAccount = await this.authRepository.createAccount(
            createAccountInput, tx
        )

        const redisToken = `${newAccount.email}:${newAccount.uuid}`

        const payload = {
            id: newAccount.id,
            email: newAccount.email,
            uuid: newAccount.uuid,
        }
        const token = await generateToken(payload)

        await this.redisClient.set(redisToken, token, { EX: 60 * 60 * 24 })

        return {
            account: this.toPublicAccount(newAccount),
            token,
        }
      })
    }

    async login(credentials: any): Promise<{ account: any; token: string }> {
        const account = await this.authRepository.findAccountByEmail(
            credentials.email
        )
        if (!account) throw new Error("Invalid credentials")
        if (account.deleted_at) throw new Error("Account has been deactivated")

        const isPasswordValid = await bcrypt.compare(credentials.password, account.hashed_password)
        if (!isPasswordValid) throw new Error("Invalid credentials")
        
        const redisToken = `${account.email}:${account.uuid}`

        const payload = {
            id: account.id,
            email: account.email,
            uuid: account.uuid,
        }
        const token = await generateToken(payload)
        await this.redisClient.set(redisToken, token, { EX: 60 * 60 * 24 })

        const response: any = {
            account: this.toPublicAccount(account),
            token
        }
        return response
    }

    private toPublicAccount(account: any): any {
        return {
            email: account.email,
            phone: account.phone,
            created_at: account.created_at,
        }
    }
}