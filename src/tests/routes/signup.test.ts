import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import knex from "knex";

const Knex = knex({ client: "mysql2" });

const app = express();

app.post("/signup", (req, res) => {
  const { password, full_name, email } = req.body;

  res.status(201).json({ status: true, msg: "User created successfully" });
});

describe("auth", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/wrongurl");
    expect(res.status).toBe(404);
  });

  it("should responds with json", async function (done) {
    request(app)
      .post("/auth")
      .send({
        email: "john@gmail.com",
        password: "12345",
        full_name: "john doe",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return err;
        return done;
      });

    // expect(authRes).toHaveProperty("msg", "Login successful");
  });
});
