import express, { Router } from "express";
import {
  paymentController,
  fundWallet,
  withdrawFromWallet,
  transferFunds,
  getUserWalletHistory,
} from "../controllers/walletController";
import { jwtAuth } from "../middleware/authentification";

const router: Router = express.Router();

router.get("/make/payment", jwtAuth, paymentController);
router.get("/fund/wallet/response", fundWallet);
router.post("/withdraw/funds", jwtAuth, withdrawFromWallet);
router.post("/transfer/funds", jwtAuth, transferFunds);
router.post("/user/wallet/history", jwtAuth, getUserWalletHistory);

export default router;
