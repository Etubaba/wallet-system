"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWalletHistory = exports.transferFunds = exports.withdrawFromWallet = exports.fundWallet = exports.paymentController = void 0;
const wallet_1 = require("../services/wallet");
const paymentController = (req, res) => {
    return (0, wallet_1.makeWalletPayment)(res);
};
exports.paymentController = paymentController;
const fundWallet = (req, res) => {
    return (0, wallet_1.fundWalletResponse)(req, res);
};
exports.fundWallet = fundWallet;
const withdrawFromWallet = (req, res) => {
    return (0, wallet_1.withdrawFunds)(req, res);
};
exports.withdrawFromWallet = withdrawFromWallet;
const transferFunds = (req, res) => {
    return (0, wallet_1.transferFund)(req, res);
};
exports.transferFunds = transferFunds;
const getUserWalletHistory = (req, res) => {
    return (0, wallet_1.userWalletHistory)(req, res);
};
exports.getUserWalletHistory = getUserWalletHistory;
