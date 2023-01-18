"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWalletHistory = exports.withdrawFunds = exports.fundWalletResponse = exports.makeWalletPayment = exports.transferFund = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
// import { knex } from "../db/knex";
const knex = require("../db/knex");
dotenv_1.default.config();
//transfer fund from user balance to another user
function transferFund(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { sender_email, amount, sender_wallet_number, receiver_wallet_number, receiver_email, } = req.body;
            //get sender wallet
            const senderWallet = sender_email !== undefined
                ? yield knex("wallets").where({ user_email: sender_email }).first()
                : yield knex("wallets")
                    .where({ wallet_number: sender_wallet_number })
                    .first();
            //if sender wallet does not exist
            if (!senderWallet) {
                return res
                    .status(404)
                    .json({ status: false, msg: "Sender account does not exist" });
            }
            //check if wallet balance is sufficient for the transaction
            if (senderWallet.amount < amount) {
                return res
                    .status(406)
                    .json({ status: false, msg: "Insufficient balance" });
            }
            //get receiver wallet
            const receiverWallet = receiver_email !== undefined
                ? yield knex("wallets").where({ user_email: receiver_email }).first()
                : yield knex("wallets")
                    .where({ wallet_number: receiver_wallet_number })
                    .first();
            //if receiver wallet does not exist
            if (!receiverWallet) {
                return res
                    .status(404)
                    .json({ status: false, msg: "Receiver's account does not exist" });
            }
            //deduct amount from sender wallet
            if (sender_email !== undefined) {
                yield knex("wallets")
                    .where({ user_email: sender_email })
                    .update({
                    amount: senderWallet.amount - amount,
                });
            }
            else {
                yield knex("wallets")
                    .where({ wallet_number: sender_wallet_number })
                    .update({
                    amount: senderWallet.amount - amount,
                });
            }
            //update sender wallet balance in users table
            if (sender_email !== undefined) {
                yield knex("users")
                    .where("email", sender_email)
                    .update({
                    wallet_balance: senderWallet.amount - amount,
                });
            }
            else {
                const userEmail = yield knex("wallets")
                    .where({ wallet_number: sender_wallet_number })
                    .first();
                yield knex("users")
                    .where("email", userEmail.user_email)
                    .update({
                    wallet_balance: senderWallet.amount - amount,
                });
            }
            //add amount to receiver wallet
            if (receiver_email !== undefined) {
                yield knex("wallets")
                    .where({ user_email: receiver_email })
                    .update({
                    amount: receiverWallet.amount + amount,
                });
                //update receiver user table
                yield knex("users")
                    .where("email", receiver_email)
                    .update({
                    wallet_balance: receiverWallet.amount + amount,
                });
            }
            else {
                yield knex("wallets")
                    .where({ wallet_number: receiver_wallet_number })
                    .update({
                    amount: receiverWallet.amount + amount,
                });
                //update receiver user table
                const userEmail = yield knex("wallets")
                    .where({ wallet_number: receiver_wallet_number })
                    .first();
                yield knex("users")
                    .where("email", userEmail.user_email)
                    .update({
                    wallet_balance: receiverWallet.amount + amount,
                });
            }
            const message = receiver_email !== undefined
                ? `Fund transfered to ${receiver_email} successfully`
                : `Fund transfered to wallet with id:${receiver_wallet_number} successfully`;
            //transaction history
            const senderId = sender_email !== undefined ? sender_email : sender_wallet_number;
            const receiverId = receiver_email !== undefined ? receiver_email : receiver_wallet_number;
            yield knex("transactions_history").insert({
                action: "Transfer funds",
                sender: senderId,
                amount: amount,
                receiver: receiverId,
            });
            res.json({ status: true, msg: message });
        }
        catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    });
}
exports.transferFund = transferFund;
//make payment via flutterwave
function makeWalletPayment(res) {
    try {
        const dir = __dirname.replace("services", "");
        res.sendFile(path_1.default.join(dir + "/views/paymentUI.html"));
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.makeWalletPayment = makeWalletPayment;
//after payment is successful, response to fund wallent of user
function fundWalletResponse(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { transaction_id } = req.query;
            const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
            const flutterwaveResponse = yield (0, axios_1.default)({
                url,
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
                },
            });
            //update wallet balance in user schema and wallet schema
            const response = flutterwaveResponse.data.data;
            const { amount } = response;
            const { customer: { email }, } = response;
            const user = yield knex("users").where("email", email);
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            yield knex("users")
                .where("email", email)
                .update({
                wallet_balance: amount + ((_a = user[0]) === null || _a === void 0 ? void 0 : _a.wallet_balance),
            });
            //update wallet
            yield knex("wallets")
                .where("user_email", email)
                .update({
                amount: amount + ((_b = user[0]) === null || _b === void 0 ? void 0 : _b.wallet_balance),
            });
            //store record in transaction history
            yield knex("transactions_history").insert({
                action: "fund wallet",
                sender: email,
                amount: amount,
            });
            const dir = __dirname.replace("services", "");
            res.sendFile(path_1.default.join(dir + "/views/successful.html"));
        }
        catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    });
}
exports.fundWalletResponse = fundWalletResponse;
//make request for withdrawer from wallet balance
function withdrawFunds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_email, amount } = req.body;
            const user_wallet = yield knex("wallets").where({ user_email }).first();
            if (!user_wallet) {
                return res.status(404).json({ status: false, msg: "Wallet not found" });
            }
            //check if wallet balance is sufficient for the transaction
            if (user_wallet.amount < amount) {
                return res
                    .status(403)
                    .json({ status: false, msg: "Insuffient Wallet balance" });
            }
            //update wallet balance in user schema and wallet schema
            yield knex("users")
                .where("email", user_email)
                .update({
                wallet_balance: user_wallet.amount - amount,
            });
            yield knex("wallets")
                .where("email", user_email)
                .update({
                amount: user_wallet.amount - amount,
            });
            //transaction history
            yield knex("transactions_history").insert({
                action: "Withdraw funds",
                sender: user_email,
                amount: amount,
            });
            res.json({ status: true, msg: `Withdraw completed successfully` });
        }
        catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    });
}
exports.withdrawFunds = withdrawFunds;
//wallet history of a user
function userWalletHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_email } = req.body;
            const user_history = yield knex("transactions_history")
                .where({ sender: user_email })
                .orWhere({ receiver: user_email });
            if (user_history.length === 0) {
                return res.status(404).json({
                    status: false,
                    msg: "You do not have any transaction history",
                });
            }
            res.json({ status: true, data: user_history });
        }
        catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    });
}
exports.userWalletHistory = userWalletHistory;
