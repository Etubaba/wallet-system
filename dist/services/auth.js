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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpException_1 = require("../exceptions/HttpException");
const argon2 = __importStar(require("argon2"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { knex } from "../db/knex";
dotenv_1.default.config();
const knex = require("../db/knex");
const userAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password } = req.body;
        const jwt_secret = "super_secret";
        //check if user exist
        const user = yield knex("users").where("email", email);
        if (user.length === 0) {
            throw new HttpException_1.HttpException(404, `User with email: ${email} does not exist`);
        }
        //check password is correct
        const isPasswordCorrect = yield argon2.verify((_a = user[0]) === null || _a === void 0 ? void 0 : _a.password, password);
        if (!isPasswordCorrect) {
            throw new HttpException_1.HttpException(401, `Incorrect user credentials`);
        }
        //Generate token
        const token = jsonwebtoken_1.default.sign({ email: user[0].email }, jwt_secret, {
            expiresIn: "15m",
        });
        //update user token
        yield knex("users").where("email", email).update({ token });
        const tokenUpdatedUser = yield knex("users").where("email", email);
        //delete password before sending response to client for safety
        (_b = tokenUpdatedUser[0]) === null || _b === void 0 ? true : delete _b.password;
        res.json({
            status: true,
            msg: "Login successful",
            user: tokenUpdatedUser[0],
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            msg: err.message,
        });
    }
});
exports.userAuth = userAuth;
