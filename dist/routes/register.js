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
// Dodawanie nowego użytkownika
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const pass = yield bcrypt_1.default.hash(body.haslo, 10);
    const sql = `INSERT INTO uzytkownicy (login, haslo, imie, nazwisko)
         VALUES ("${body.login}", "${pass}", "${body.imie}", "${body.nazwisko}")`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: `Użytkownik '${body.login}' już istnieje!` });
        }
        res.json({ message: `Dodano nowego użytkownika o id: ${result.insertId}` });
    });
}));
// Aktualizacja danych użytkownika
router.patch('/:login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const pass = yield bcrypt_1.default.hash(body.haslo, 10);
    const sql = `UPDATE uzytkownicy SET haslo = "${pass}, imie = "${body.imie}", nazwisko = "${body.nazwisko}" 
                                WHERE login = "${req.params.login}"`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: `Użytkownik '${req.params.login}' nie istnieje!` });
        }
        res.json({ message: `Zmodyfikowano dane użytkownika o nazwie: ${req.params.login}` });
    });
}));
// Usuwanie użytkownika
router.delete('/:login', (req, res) => {
    const sql = `DELETE FROM uzytkownicy WHERE login = "${req.params.login}"`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: `Użytkownik '${req.params.login}' nie istnieje!` });
        }
        res.json({ message: `Usunięto użytkownika o nazwie: ${req.params.login}` });
    });
});
// Funkcje
function checkRequiredFields(fields) {
    let emptyFields = [];
    if (!fields.login)
        emptyFields.push('login');
    if (!fields.haslo)
        emptyFields.push('haslo');
    if (!fields.imie)
        emptyFields.push('imie');
    if (!fields.nazwisko)
        emptyFields.push('nazwisko');
    return emptyFields.join(', ');
}
exports.default = router;
