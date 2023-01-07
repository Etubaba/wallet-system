import express from "express";
import path from "path";

const app = express();

app.get("/make/payment", (req, res) => {
  const dir = __dirname.replace("services", "");
  res.sendFile(path.join(dir + "/views/paymentUI.html"));
});
app.get("/fund/wallet/response", (req, res) => {
  const dir = __dirname.replace("services", "");
  res.sendFile(path.join(dir + "/views/successful.html"));
});

app.post("/withdraw/funds", (req, res) => {
  res.json({ status: true, msg: `Withdraw completed successfully` });
});
app.post("/transfer/funds", (req, res) => {
  res.json({ status: true, msg: `Withdraw completed successfully` });
});

export default app;
