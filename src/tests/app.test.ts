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
    accountDetail = res.body.accountDetails;
  });

  test("test identification of duplicate account", async () => {
    const res = await request(app).post("/signup").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("email is already registered with us");
  });

  test("test funding of user account", async () => {
    const res = await request(app)
      .get("/make/payment")
      .expect("Content-Type", /html/);
  });

  test("test withdrawal from user account", async () => {
    const res = await request(app)
      .post("/widthdraw/funds")
      .send({ user_email: "ekke@kdkd.com", amount: 404 })
      .expect(200);

    expect(res.body).toBeTruthy();
    expect(res.body).toHaveProperty("message");
    expect(res.body.msg).toBe("success");
  });

  test("test for insufficeient account balance", async () => {
    const res = await request(app).post("/widthdraw/funds").send({
      user_id: "1",
      account_number: accountDetail.account_number,
      amount: 5000,
    });
    expect(res.status).toEqual(400);
    expect(res.body).toBeTruthy();
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("insuffient balance");
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
