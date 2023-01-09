import { expect, test, it, describe } from "vitest";
import request from "supertest";
import { app } from "../main";

describe("Test the lendsqr app", () => {
  const user = {
    full_name: "emeka",
    email: "emekaokonkwo@gmail.com",
    password: "123456",
  };

  let accountDetail;

  test("Create a valid  user account", async () => {
    const res = await request(app).post("/signup").send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("accountDetails");
    expect(res.body.msg).toBe("User created successfully");
    accountDetail = res.body.accountDetails;
  });

  test("test identification of duplicate account", async () => {
    const res = await request(app).post("/signup").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.msg).toBe(`User with email:
    ${user.email} already exist`);
  });

  test("test funding of user account", async () => {
    const res = await request(app)
      .get("/make/payment")
      .expect("Content-Type", /html/)
      .expect(200);
  });

  test("test withdrawal from user account", async () => {
    const res = await request(app)
      .post("/widthdraw/funds")
      .send({ user_email: "ekke@kdkd.com", amount: 404 })
      .expect(200);
    expect(res.body.msg).toBe("s");
  });

  test("test for insufficient account balance", async () => {
    const res = await request(app).post("/widthdraw/funds").send({
      sender_email: "lolo@gmail.com",
      receiver_email: "loho@gmail.com",

      amount: 5000,
    });
    expect(res.status).toEqual(400);
    expect(res.body).toBeTruthy();
    expect(res.body).toHaveProperty("msg");
    expect(res.body.msg).toBe("Insuffient Wallet balance");
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
});
