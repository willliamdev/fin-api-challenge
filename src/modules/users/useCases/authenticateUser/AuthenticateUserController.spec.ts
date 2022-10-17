import request from "supertest"
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app"

let connection: Connection

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "Jhon Doe",
      email: "johndoe@email.com",
      password: "password",
    });

    const res = await request(app).post("/api/v1/sessions/").send({
      email: "johndoe@email.com",
      password: "password",
    });

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
    expect(res.body.user).toHaveProperty("id")
  });

  it("should not be able to authenticate a non-existent user", async () => {
    const res = await request(app).post("/api/v1/sessions/").send({
      email: "non.existent.user@email.com",
      password: "password",
    });

    expect(res.status).toBe(401)
    expect(res.body.message).toEqual("Incorrect email or password")
  });
})