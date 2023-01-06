import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import path from "path";
import walletRoute from "../../routes/walletRoute";
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

// describe("", () => {
//   it("", () => {});
// });
