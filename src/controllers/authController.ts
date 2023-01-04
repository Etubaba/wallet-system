import { Response, Request } from "express";
import { userAuth } from "../services/auth";

export const authController = (req: Request, res: Response) => {
  return userAuth(req, res);
};
