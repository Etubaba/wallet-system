import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces";
import dotenv from "dotenv";

dotenv.config();

export const SECRET_KEY: Secret = "super_secret";

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ status: false, msg: "Authorization needed" });
  }
};
