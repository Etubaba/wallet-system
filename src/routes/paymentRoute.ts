import express, { Router } from "express";
import {
  paymentController,
  fundWallet,
  withdrawFromWallet,
} from "../controllers/walletController";

const router: Router = express.Router();

router.get("/make/payment", paymentController);
router.get("/fund/wallet/response", fundWallet);
router.post("/withdraw/funds", withdrawFromWallet);

export default router;
