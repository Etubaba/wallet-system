import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import path from "path";

// import { app } from "../../main";

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

describe(" Withdraw funds request", () => {
  it("should return response successful", () => {
    request(app)
      .post("/withdraw/funds")
      .send({ user_email: "ekke@kdkd.com", amount: 404 })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
  });
});
describe("transfer funds request", () => {
  it("should return response successful", () => {
    request(app)
      .post("/transfer/funds")
      .send({
        receiver_email: "hhd@gmail.com",
        sender_email: "ekke@kdkd.com",
        amount: 404,
      })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
  });
});

describe("Make payment ", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/wrongurl");
    expect(res.status).toBe(404);
  });

  it("should return payment form in html", async (done) => {
    request(app)
      .get("/make/payment")
      .expect("Content-Type", /html/)
      .end(function (err, res) {
        if (err) throw err;
      });
  });
});

describe("/fund/wallet/response", () => {
  it("should return successful page in html", async () => {
    request(app)
      .get("/fund/wallet/response")
      .expect("Content-Type", /html/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
  });
});
