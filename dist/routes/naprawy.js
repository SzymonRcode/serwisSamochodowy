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
const router = express_1.default.Router();
// Pobieranie wszystkich napraw
router.get('/', (req, res) => {
    const sql = "SELECT * FROM naprawy";
    connect_1.default.query(sql, (error, result) => {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: 'Brak danych w tabeli naprawy' });
        }
        const rows = JSON.parse(JSON.stringify(result));
        res.json(rows);
    });
});
// Pobieranie konkretnej naprawy
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM naprawy WHERE id = ${req.params.id}`;
    connect_1.default.query(sql, (error, result) => {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
        }
        const rows = JSON.parse(JSON.stringify(result));
        res.json(rows);
    });
});
// Dodawanie nowej naprawy
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const sql = `INSERT INTO naprawy (nazwa, cena, status, idAuta)
         VALUES ("${body.nazwa}", ${body.cena}, "${body.status}", "${body.idAuta}")`;
    const car = yield checkCarExists(body.idAuta);
    if (!car) {
        return res.status(400).json({ message: `Brak auta o id: ${body.idAuta}` });
    }
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        res.json({ message: `Dodano nową naprawę o id: ${result.insertId}` });
    });
}));
// Aktualizacja danych naprawy
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const car = yield checkCarExists(body.idAuta);
    if (!car) {
        return res.status(400).json({ message: `Brak auta o id: ${body.idAuta}` });
    }
    const sql = `UPDATE naprawy SET nazwa="${body.nazwa}", cena="${body.cena}",
                                status="${body.status}", idAuta="${body.idAuta}" 
                                WHERE id="${req.params.id}"`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
        }
        res.json({ message: `Zmodyfikowano naprawę o id: ${req.params.id}` });
    });
}));
// Usuwanie naprawy
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM naprawy WHERE id = ${req.params.id}`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
        }
        res.json({ message: `Usunięto naprawę o id: ${req.params.id}` });
    });
});
// Funkcje
function checkRequiredFields(fields) {
    let emptyFields = [];
    if (!fields.nazwa)
        emptyFields.push('nazwa');
    if (!fields.cena)
        emptyFields.push('cena');
    if (!fields.status)
        emptyFields.push('status');
    if (!fields.idAuta)
        emptyFields.push('idAuta');
    return emptyFields.join(', ');
}
function checkCarExists(carId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM auta WHERE id=${carId}`;
        connect_1.default.query(sql, (error, result) => {
            if (error || result.length < 1) {
                resolve(false);
            }
            resolve(true);
        });
    });
}
exports.default = router;
