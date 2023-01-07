import { Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
// import { knex } from "../db/knex";

const knex = require("../db/knex");

dotenv.config();

//transfer fund from user balance to another user
export async function transferFund(req: Request, res: Response) {
  try {
    const {
      sender_email,
      amount,
      sender_wallet_number,
      receiver_wallet_number,
      receiver_email,
    } = req.body;

    //get sender wallet
    const senderWallet =
      sender_email !== undefined
        ? await knex("wallets").where({ user_email: sender_email }).first()
        : await knex("wallets")
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
    const receiverWallet =
      receiver_email !== undefined
        ? await knex("wallets").where({ user_email: receiver_email }).first()
        : await knex("wallets")
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
      await knex("wallets")
        .where({ user_email: sender_email })
        .update({
          amount: senderWallet.amount - amount,
        });
    } else {
      await knex("wallets")
        .where({ wallet_number: sender_wallet_number })
        .update({
          amount: senderWallet.amount - amount,
        });
    }

    //update sender wallet balance in users table
    if (sender_email !== undefined) {
      await knex("users")
        .where("email", sender_email)
        .update({
          wallet_balance: senderWallet.amount - amount,
        });
    } else {
      const userEmail = await knex("wallets")
        .where({ wallet_number: sender_wallet_number })
        .first();

      await knex("users")
        .where("email", userEmail.user_email)
        .update({
          wallet_balance: senderWallet.amount - amount,
        });
    }

    //add amount to receiver wallet
    if (receiver_email !== undefined) {
      await knex("wallets")
        .where({ user_email: receiver_email })
        .update({
          amount: receiverWallet.amount + amount,
        });
      //update receiver user table
      await knex("users")
        .where("email", receiver_email)
        .update({
          wallet_balance: receiverWallet.amount + amount,
        });
    } else {
      await knex("wallets")
        .where({ wallet_number: receiver_wallet_number })
        .update({
          amount: receiverWallet.amount + amount,
        });
      //update receiver user table
      const userEmail = await knex("wallets")
        .where({ wallet_number: receiver_wallet_number })
        .first();

      await knex("users")
        .where("email", userEmail.user_email)
        .update({
          wallet_balance: receiverWallet.amount + amount,
        });
    }

    const message =
      receiver_email !== undefined
        ? `Fund transfered to ${receiver_email} successfully`
        : `Fund transfered to wallet with id:${receiver_wallet_number} successfully`;

    //transaction history
    const senderId =
      sender_email !== undefined ? sender_email : sender_wallet_number;
    const receiverId =
      receiver_email !== undefined ? receiver_email : receiver_wallet_number;

    await knex("transactions_history").insert({
      action: "Transfer funds",
      sender: senderId,
      amount: amount,
      receiver: receiverId,
    });

    res.json({ status: true, msg: message });
  } catch (err: any) {
    res.status(500).json({ status: false, msg: err.message });
  }
}

//make payment via flutterwave

export function makeWalletPayment(res: Response) {
  const dir = __dirname.replace("services", "");
  res.sendFile(path.join(dir + "/views/paymentUI.html"));
}

//after payment is successful, response to fund wallent of user
export async function fundWalletResponse(req: Request, res: Response) {
  try {
    const { transaction_id } = req.query;
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    const flutterwaveResponse = await axios({
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
    const {
      customer: { email },
    } = response;

    const user = await knex("users").where("email", email);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await knex("users")
      .where("email", email)
      .update({
        wallet_balance: amount + user[0]?.wallet_balance,
      });

    //update wallet

    await knex("wallets")
      .where("user_email", email)
      .update({
        amount: amount + user[0]?.wallet_balance,
      });

    //store record in transaction history
    await knex("transactions_history").insert({
      action: "fund wallet",
      sender: email,
      amount: amount,
    });

    const dir = __dirname.replace("services", "");
    res.sendFile(path.join(dir + "/views/successful.html"));
  } catch (err: any) {
    res.status(500).json({ status: false, msg: err.message });
  }
}

//make request for withdrawer from wallet balance
export async function withdrawFunds(req: Request, res: Response) {
  try {
    const { user_email, amount } = req.body;

    const user_wallet = await knex("wallets").where({ user_email }).first();

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

    await knex("users")
      .where("email", user_email)
      .update({
        wallet_balance: user_wallet.amount - amount,
      });

    await knex("wallets")
      .where("email", user_email)
      .update({
        amount: user_wallet.amount - amount,
      });

    //transaction history
    await knex("transactions_history").insert({
      action: "Withdraw funds",
      sender: user_email,
      amount: amount,
    });

    res.json({ status: true, msg: `Withdraw completed successfully` });
  } catch (err: any) {
    res.status(500).json({ status: false, msg: err.message });
  }
}

//wallet history of a user

export async function userWalletHistory(req: Request, res: Response) {
  try {
    const { user_email } = req.body;

    const user_history = await knex("transactions_history")
      .where({ sender: user_email })
      .orWhere({ receiver: user_email });

    if (user_history.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "You do not have any transaction history",
      });
    }
    res.json({ status: true, data: user_history });
  } catch (err: any) {
    res.status(500).json({ status: false, msg: err.message });
  }
}
