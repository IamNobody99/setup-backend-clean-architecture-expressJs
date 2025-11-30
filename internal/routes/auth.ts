import { Application, Router } from "express";
import { initAuthModule } from "../module/auth/auth";


export function setupAuthRoutes(app : Application){
    const authController = initAuthModule()
    const router = Router()

    router.post("/register", authController.register.bind(authController))
    router.post("/login", authController.login.bind(authController))

    app.use("/auth", router)
}