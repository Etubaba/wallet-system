import express, { Router } from "express";
import {
  paymentController,
  fundWallet,
  withdrawFromWallet,
  transferFunds,
  getUserWalletHistory,
} from "../controllers/walletController";

const router: Router = express.Router();

router.get("/make/payment", paymentController);
router.get("/fund/wallet/response", fundWallet);
router.post("/withdraw/funds", withdrawFromWallet);
router.post("/transfer/funds", transferFunds);
router.post("/user/wallet/history", getUserWalletHistory);

export default router;
