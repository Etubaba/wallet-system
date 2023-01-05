import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface userData {
  email: String;
  password: String | Buffer;
}

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}
