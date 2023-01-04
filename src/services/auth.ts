import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "../exceptions/HttpException";
import * as argon2 from "argon2";
import dotenv from "dotenv";
import { userData } from "../interfaces";

dotenv.config();

const knex = require("../db/knex");

export const userAuth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //check if user exist
    const user = await knex("users").where("email", email);

    if (!user) {
      throw new HttpException(404, `User with email: ${email} does not exist`);
    }

    //check password is correct
    const isPasswordCorrect = await argon2.verify(user[0]?.password, password);

    if (!isPasswordCorrect) {
      throw new HttpException(406, `User credentials is incorrect`);
    }
    //Generate token
    const token = jwt.sign({ email: user[0].email }, "super_secret", {
      expiresIn: "1h",
    });
    //update user token
    await knex("users").where("email", email).update({ token });

    const tokenUpdatedUser = await knex("users").where("email", email);

    //delete password before sending response to client for safety
    delete tokenUpdatedUser[0]?.password;

    res.json({
      status: true,
      msg: "Login successful",
      user: tokenUpdatedUser[0],
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      status: false,
      msg: err.message,
    });
  }
};
