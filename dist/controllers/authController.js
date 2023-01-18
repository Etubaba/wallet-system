"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_1 = require("../services/auth");
const authController = (req, res) => {
    return (0, auth_1.userAuth)(req, res);
};
exports.authController = authController;
