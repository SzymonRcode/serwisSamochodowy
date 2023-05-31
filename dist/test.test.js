"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("./index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("/auta", () => {
    it("Get cars", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .get("/auta")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
        expect(Array.isArray(response.body)).toBe(true);
    }));
});
describe("/klienci", () => {
    let klient = {
        imie: "Test",
        nazwisko: "Test",
        pesel: Math.floor(Math.random() * 1000000000).toString(),
        ulica: "Test",
        kodPocztowy: "23-300",
        miasto: "Test"
    };
    let clientId = null;
    it("Get clients", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .get("/klienci")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it("Add new client", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/klienci")
            .send(klient)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
        clientId = Number(response.body.message.split(":")[1]);
    }));
    it("Get client by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .get(`/klienci/${clientId}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it("Update client", () => __awaiter(void 0, void 0, void 0, function* () {
        klient.miasto = "Test1";
        klient.imie = "Test1";
        const response = yield (0, supertest_1.default)(index_1.app)
            .patch(`/klienci/${clientId}`)
            .send(klient)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
    it("Delete client", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .delete(`/klienci/${clientId}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
});
describe("/register /login", () => {
    const user = {
        login: "Test" + Math.floor(Math.random() * 1000000).toString(),
        haslo: "Test123",
        imie: "Test",
        nazwisko: "Test"
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .post("/register")
            .send(user)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`/register/${user.login}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
    }));
    it("User log in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/login")
            .send(user)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
    it("Users exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .get("/login/")
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
});
describe("/auta", () => {
    const client = {
        imie: "Test",
        nazwisko: "Test",
        pesel: Math.floor(Math.random() * 1000000000).toString(),
        ulica: "Test",
        kodPocztowy: "12-345",
        miasto: "Test"
    };
    let clientId = null;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/klienci")
            .send(client)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        clientId = Number(response.body.message.split(":")[1]);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`/klienci/${clientId}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
    }));
    let carId = null;
    it("Add new car", () => __awaiter(void 0, void 0, void 0, function* () {
        const car = {
            vin: Math.floor(Math.random() * 1000000000).toString(),
            nrTablicy: "Test",
            marka: "Test",
            rocznik: "2000",
            przebieg: "2000",
            idKlienta: clientId
        };
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/auta")
            .send(car)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
        carId = Number(response.body.message.split(":")[1]);
    }));
    it("Car exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .get(`/auta/${carId}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
    it("Car delete", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .delete(`/auta/${carId}`)
            .auth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASSWORD);
        expect(response.statusCode).toBe(200);
    }));
});
