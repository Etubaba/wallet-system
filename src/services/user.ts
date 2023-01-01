import { Request, Response } from "express";
import knex from "knex";
import { CreateUserDto } from "../dto/userDto";
import { HttpException } from "../exceptions/HttpException";

import * as argon2 from "argon2";

export const signUp = async (userDTO: CreateUserDto, res: Response) => {
  try {
    const { password, full_name, email }: CreateUserDto = userDTO;

    //check if email already exisit
    const userExists = await knex("users").where({ email }).first();

    if (userExists)
      throw new HttpException(
        400,
        `This email ${email} already in use,please make uuse of another.`
      );

    //hash password
    const hashedPassword = await argon2.hash(password);

    //create user
    await knex("users").insert({ email, password: hashedPassword, full_name });

    //create wallet for registered user

    const walletNum = Math.floor(100000 + Math.random() * 900000); //generate wallet number

    await knex("wallets").insert({
      user_email: email,
      amount: 0,
      wallet_number: walletNum,
    });

    res.status(200).json({ status: true, msg: "User created successfully" });
  } catch (err: any) {
    res.json({ status: false, msg: err.message });
  }
};
