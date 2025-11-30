import { getAdapters } from "../../adapter/adapters";
import { AuthController } from "./controller/controller";
import { AuthControllerInterface } from "./ports/ports";
import { AuthRepository } from "./repository/repostiory";
import { AuthService } from "./service/service";


export function initAuthModule(): AuthControllerInterface {
    const adapter = getAdapters()
    const authRepository = new AuthRepository(adapter.mysql)
    const authService = new AuthService(authRepository)
    const authController = new AuthController(authService)

    return authController
}