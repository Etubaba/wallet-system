"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const signupRoute_1 = __importDefault(require("./routes/signupRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const walletRoute_1 = __importDefault(require("./routes/walletRoute"));
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
const port = process.env.PORT || 8080;
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.get("/", (req, res) => {
    res.send("Lendsqr Assessment for backend");
});
exports.app.use("/", signupRoute_1.default);
exports.app.use("/", authRoute_1.default);
exports.app.use("/", walletRoute_1.default);
exports.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
