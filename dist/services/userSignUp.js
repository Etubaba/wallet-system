"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const HttpException_1 = require("../exceptions/HttpException");
const knex = require("../db/knex");
const argon2 = __importStar(require("argon2"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, full_name, email } = req.body;
        //check if email already exisit
        const userExists = yield knex("users").where({ email }).first();
        if (userExists)
            throw new HttpException_1.HttpException(400, `This email ${email} already in use,please make use of another.`);
        //hash password
        const hashedPassword = yield argon2.hash(password);
        //create user
        yield knex("users").insert({ email, password: hashedPassword, full_name });
        //create wallet for registered user
        const walletNum = Math.floor(100000 + Math.random() * 900000); //generate wallet number
        yield knex("wallets").insert({
            user_email: email,
            amount: 0,
            wallet_number: walletNum,
        });
        res.status(200).json({ status: true, msg: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
});
exports.signUp = signUp;
