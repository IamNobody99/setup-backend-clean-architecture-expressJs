import { error } from "console";
import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import { Envs } from "../infrastructure/config";
import { getAdapters } from "../adapter/adapters";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ error: "Access denied. No token provided" });
    }

    const decoded = jwt.verify(token, Envs?.guard.jwtPrivateKey || "")
    const decodeObj = decoded as { email: string, uuid: string }

    const redisClient = getAdapters().redis
    const redisToken = `${decodeObj.email}:${decodeObj.uuid}`
    const storedToken = await redisClient.get(redisToken)
    console.log("storedToken", storedToken)
    console.log("token", token)
    
    if (!storedToken || storedToken !== token) {
      return res
        .status(403)
        .json({ error: "Access denied. Invalid token." })
    }

    req.user = decoded
    next()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: "Invalid token" })   
  }
}
