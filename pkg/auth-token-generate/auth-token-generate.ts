import jwt from "jsonwebtoken"
import { Envs } from "../../internal/infrastructure/config"

export async function generateToken(payload:any) {
  const jwtExpiresIn = `${Envs?.guard.jwtAccessTokenExpiration || 24}h`

  return jwt.sign(payload, Envs?.guard.jwtPrivateKey || "your-secret-key", {
    expiresIn: jwtExpiresIn,
  } as jwt.SignOptions)
}