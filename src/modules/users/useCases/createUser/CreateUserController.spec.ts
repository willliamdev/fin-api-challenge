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

  it("should be able to create a new user", async () => {
    const res = await request(app).post("/api/v1/users/").send({
      name: "Jhon Doe",
      email: "johndoe@email.com",
      password: "12345678",
    });

    console.log(res.body)
    expect(res.status).toBe(201);
  });

  it("should not be able to create a new user if the email is already being used", async () => {
    const res = await request(app).post("/api/v1/users/").send({
      name: "Jhon Doe",
      email: "johndoe@email.com",
      password: "12345678",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual("User already exists")
  });
})