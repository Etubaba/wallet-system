import { Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

//transfer fund from user balance to another user
export async function transferFund(req: Request, res: Response) {
  // try {
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
    throw new HttpException(404, "Sender account does not exist");
  }

  //check if wallet balance is sufficient for the transaction
  if (senderWallet.amount < amount) {
    throw new HttpException(406, "Insufficient fund");
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
    throw new HttpException(404, "Receiver account does not exist");
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

  return { status: true, msg: message };
}

//fund wallet using flutterwave
