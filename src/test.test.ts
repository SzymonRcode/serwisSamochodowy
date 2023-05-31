import request from "supertest";
import {app} from "./index" 
import dotEnv from "dotenv";
import {IKlienci} from "./interfaces/IKlienci";
import {IUser} from "./interfaces/IUser";
import {IAuta} from "./interfaces/IAuta";
dotEnv.config();

describe("/auta", () => {
  it("Get cars", async () => {
    const response = await request(app)
    .get("/auta")
    .auth( (process.env.BASIC_AUTH_USER as string), (process.env.BASIC_AUTH_PASSWORD as string));
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(undefined);
    expect(Array.isArray(response.body)).toBe(true);
    });
});
describe("/klienci", () => {
  let klient: IKlienci = {
    imie: "Test",
    nazwisko: "Test",
    pesel: Math.floor(Math.random() * 1000000000).toString(),
    ulica: "Test",
    kodPocztowy: "23-300",
    miasto: "Test"
  }
  let clientId:Number | null = null
  it("Get clients", async () => {
    const response = await request(app)
    .get("/klienci")
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(undefined);
    expect(Array.isArray(response.body)).toBe(true);
  });
  it("Add new client", async () => {
    const response = await request(app)
    .post("/klienci")
    .send(klient)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
    clientId = Number(response.body.message.split(":")[1])
  });
  it("Get client by id", async () => {
    const response = await request(app)
    .get(`/klienci/${clientId}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(undefined);
    expect(Array.isArray(response.body)).toBe(true);
  });
  it("Update client", async () => {
    klient.miasto = "Test1"
    klient.imie = "Test1"
    const response = await request(app)
    .patch(`/klienci/${clientId}`)
    .send(klient)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
  it("Delete client", async () => {
    const response = await request(app)
    .delete(`/klienci/${clientId}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
});
describe("/register /login", () => {
  const user:IUser = {
    login: "Test" + Math.floor(Math.random() * 1000000).toString(),
    haslo: "Test123",
    imie: "Test",
    nazwisko: "Test"
  };
  beforeAll(async () => {
    await request(app)
    .post("/register")
    .send(user)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
});
  afterAll(async () => {
    await request(app)
    .delete(`/register/${user.login}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
  });
  it("User log in", async () => {
    const response = await request(app)
    .post("/login")
    .send(user)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
  it("Users exists", async () => {
    const response = await request(app)
    .get("/login/")
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
});
describe("/auta", () => {
  const client:IKlienci = {
    imie: "Test",
    nazwisko: "Test",
    pesel: Math.floor(Math.random() * 1000000000).toString(),
    ulica: "Test",
    kodPocztowy: "12-345",
    miasto: "Test"
  };
  let clientId:Number | null = null
  beforeAll(async () => {
    const response = await request(app)
    .post("/klienci")
    .send(client)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    clientId = Number(response.body.message.split(":")[1]);
  });
  afterAll(async () => {
    await request(app)
    .delete(`/klienci/${clientId}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
  });
  let carId: Number | null = null;
  it("Add new car", async () => {
    const car:IAuta = {
      vin: Math.floor(Math.random() * 1000000000).toString(),
      nrTablicy: "Test",
      marka: "Test",
      rocznik: "2000",
      przebieg: "2000",
      idKlienta: clientId as number
    };
    const response = await request(app)
    .post("/auta")
    .send(car)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
    carId = Number(response.body.message.split(":")[1]);
  });
  it("Car exists", async () => {
    const response = await request(app)
    .get(`/auta/${carId}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
  it("Car delete", async () => {
    const response = await request(app)
    .delete(`/auta/${carId}`)
    .auth(process.env.BASIC_AUTH_USER as string, process.env.BASIC_AUTH_PASSWORD as string);
    expect(response.statusCode).toBe(200);
  });
});