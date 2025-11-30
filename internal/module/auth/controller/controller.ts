import { Request, Response } from "express";
import { validateDTO } from "../../../middleware/validation";
import { AuthResponse, LoginDTO, RegisterDTO } from "../dto/dto";
import { AuthControllerInterface } from "../ports/ports";
import { AuthService } from "../service/service";


export class AuthController implements AuthControllerInterface {
    private authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = await validateDTO(RegisterDTO, req.body)

            if (!validationResult.isValid) {
                res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.errors,
                })
                return
            }

            const accountData: RegisterDTO = validationResult.data!

            const account = await this.authService.register(accountData)

            res
                .status(201)
                .set("X-TOKEN", account.token)
                .json({
                    success: true,
                    message: "Account created successfully",
                    data: account.account,
                } as AuthResponse)
        } catch (error: any) {
            console.log(error)
            res.status(400).json({
                success: false,
                message: error.message || "Registration failed",
            } as AuthResponse)
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = await validateDTO(LoginDTO, req.body)

            if (!validationResult.isValid) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationResult.errors,
                } as AuthResponse)
                return
            }

            const loginData = validationResult.data!

            const result = await this.authService.login(loginData)

            res
                .status(200)
                .set("X-TOKEN", result.token)
                .json({
                    success: true,
                    message: "Login successful",
                    data: result.account,
                    token: result.token,
                } as AuthResponse)
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || "Login failed",
            } as AuthResponse)
        }
    }
}