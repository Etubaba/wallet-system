import { expect, it, describe } from "vitest";
//import { app } from "../main";
import request from "supertest";
import express from "express";

const app = express();

app.get("/", (req, res) => {});

describe("", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/wrongurl");
    expect(res.status).toBe(404);
  });

  it("it should get the home page", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        return done;
      });
  });
});
