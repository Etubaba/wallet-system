import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import signupRoute from "./routes/signupRoute";
import authRoute from "./routes/authRoute";
import paymentRoute from "./routes/paymentRoute";
import cors from "cors";

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Lendsqr Assessment for backend");
});

app.use("/", signupRoute);
app.use("/", authRoute);
app.use("/", paymentRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
