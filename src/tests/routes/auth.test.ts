import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { authRes } from "../mock/authRes";
import knex from "knex";

const Knex = knex({ client: "mysql2" });

const app = express();

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  res.status(200).json(authRes);
});

describe("auth for user", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/wrongurl");
    expect(res.status).toBe(404);
  });

  it("should responds with json", function (done) {
    request(app)
      .post("/auth")
      .send({ email: "john@gmail.com", password: "12345" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return err;
        return done;
      });

    expect(authRes).toHaveProperty("status", true);
    expect(authRes).toHaveProperty("msg", "Login successful");
  });
});
