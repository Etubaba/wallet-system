import { Response, Request } from "express";
import { signUp } from "../services/user";

export const signupController = async (req: Request, res: Response) => {
  return signUp(req, res);
};
