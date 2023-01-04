import express, { Router } from "express";
import { signupController } from "../controllers/signupController";

const router: Router = express.Router();

router.post("/signup", signupController);

export default router;
