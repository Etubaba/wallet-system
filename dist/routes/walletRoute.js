"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const authentification_1 = require("../middleware/authentification");
const router = express_1.default.Router();
router.get("/make/payment", walletController_1.paymentController);
router.get("/fund/wallet/response", walletController_1.fundWallet);
router.post("/withdraw/funds", authentification_1.jwtAuth, walletController_1.withdrawFromWallet);
router.post("/transfer/funds", authentification_1.jwtAuth, walletController_1.transferFunds);
router.post("/user/wallet/history", authentification_1.jwtAuth, walletController_1.getUserWalletHistory);
exports.default = router;
