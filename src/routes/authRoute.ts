import express, { Router } from "express";
import { authController } from "../controllers/authController";

const router: Router = express.Router();

router.post("/auth", authController);

export default router;
