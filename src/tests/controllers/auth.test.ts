import { authController } from "../../controllers/authController";
import { describe, it, expect } from "vitest";
import { Request, Response } from "express";
import { vi } from "vitest";

// const knex = require("../../db/knex");
import { knex } from "../../db/knex";

vi.mock("../../db/knex");

const req: Partial<Request> = {
  body: {
    email: "test",
    password: "12345",
  },
};
const res = {};

describe("User Authentification", () => {
  it("should return 404 if user is not found", async () => {
    await knex("users").mockImplementation({
      id: 1,
      email: "test@test.com",
      password: "12345",
      full_name: "Wahala muntus",
      wallet_balance: 100,
    });
    // authController(req, {});
  });
});
