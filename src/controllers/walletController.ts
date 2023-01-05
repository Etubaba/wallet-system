import { Response, Request } from "express";
import {
  makeWalletPayment,
  fundWalletResponse,
  withdrawFunds,
  transferFund,
} from "../services/wallet";

export const paymentController = (req: Request, res: Response) => {
  return makeWalletPayment(res);
};

export const fundWallet = (req: Request, res: Response) => {
  return fundWalletResponse(req, res);
};
export const withdrawFromWallet = (req: Request, res: Response) => {
  return withdrawFunds(req, res);
};
export const transferFunds = (req: Request, res: Response) => {
  return transferFund(req, res);
};
