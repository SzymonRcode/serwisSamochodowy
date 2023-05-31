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
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("../connect"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
// Pobieranie wszystkich użytkowników
router.get('/', (req, res) => {
    const sql = "SELECT id, login FROM uzytkownicy";
    connect_1.default.query(sql, (error, result) => {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: 'Brak użytkowników w bazie danych!' });
        }
        const rows = JSON.parse(JSON.stringify(result));
        res.json(rows);
    });
});
// Logowanie
router.post('/', (req, res) => {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const sql = `SELECT * FROM uzytkownicy WHERE login = "${body.login}"`;
    connect_1.default.query(sql, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: `Brak użytkownika '${body.login}' w bazie!` });
        }
        const rows = JSON.parse(JSON.stringify(result));
        if (!(yield bcrypt_1.default.compare(body.haslo, rows[0].haslo))) {
            return res.status(400).json({ message: 'Błędne hasło!' });
        }
        res.json({ message: `Zalogowano jako: ${body.login}` });
    }));
});
// Funkcje
function checkRequiredFields(fields) {
    let emptyFields = [];
    if (!fields.login)
        emptyFields.push('login');
    if (!fields.haslo)
        emptyFields.push('haslo');
    return emptyFields.join(', ');
}
exports.default = router;
