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
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// Pobieranie wszystkich aut
router.get('/', (req, res) => {
    const sql = "SELECT * FROM auta";
    connect_1.default.query(sql, (error, result) => {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: 'Brak danych w tabeli auta' });
        }
        const rows = JSON.parse(JSON.stringify(result));
        res.json(rows);
    });
});
// Pobieranie konkretnego auta z parametrem ID
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM auta WHERE id= ${req.params.id}`;
    connect_1.default.query(sql, (error, result) => {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: `Brak auta o id: ${req.params.id}` });
        }
        const rows = JSON.parse(JSON.stringify(result));
        res.json(rows);
    });
});
// Pobranie dodatkowych danych za pomocą id auta
router.get('/:id/api', (req, res) => {
    const sql = `SELECT * FROM auta WHERE id= ${req.params.id}`;
    connect_1.default.query(sql, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        else if (result.length < 1) {
            return res.status(400).json({ message: `Brak auta o id: ${req.params.id}` });
        }
        const resoult = yield axios_1.default.get(`https://api.api-ninjas.com/v1/cars?make=${result[0].marka}&year=${result[0].rocznik}`, {
            headers: { 'X-Api-Key': '0A1HnPx1wIxQa7oRyhWAPA==UgPgnkjFrtD3khGv' }
        });
        if (resoult.status < 200 && resoult.status >= 300)
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        else if (resoult.data.length == 0)
            return res.status(400).json({ message: `Brak danych o aucie!` });
        res.json(resoult.data);
    }));
});
// Dodawanie nowego auta z id klienta
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const sql = `INSERT INTO auta (vin, nrTablicy, marka, rocznik, przebieg, idKlienta)
         VALUES ("${body.vin}", "${body.nrTablicy}", "${body.marka}", 
                 "${body.rocznik}", "${body.przebieg}", "${body.idKlienta}")`;
    const client = yield checkClientExists(body.idKlienta);
    if (!client) {
        return res.status(400).json({ message: `Brak klienta o id: ${body.idKlienta}` });
    }
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        res.json({ message: `Dodano nowe auto o id: ${result.insertId}` });
    });
}));
// Usuwanie auta po identyfikatorze
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM auta WHERE id = ${req.params.id}`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        res.json({ message: `Usunięto auto o id: ${req.params.id}` });
    });
});
// Aktualizacja auta po id
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const emptyFields = checkRequiredFields(body);
    if (emptyFields) {
        return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
    }
    const client = yield checkClientExists(body.idKlienta);
    if (!client) {
        return res.status(400).json({ message: `Brak klienta o id: ${body.idKlienta}` });
    }
    const sql = `UPDATE auta SET vin="${body.vin}", nrTablicy="${body.nrTablicy}", marka="${body.marka}", 
                                rocznik="${body.rocznik}", przebieg="${body.przebieg}", idKlienta="${body.idKlienta}" 
                                WHERE id="${req.params.id}"`;
    connect_1.default.query(sql, (error, result) => {
        if (error || result.affectedRows < 1) {
            return res.status(400).json({ message: 'Wystąpił błąd!' });
        }
        res.json({ message: `Zmodyfikowano auto o id: ${req.params.id}` });
    });
}));
// Funkcje
function checkRequiredFields(fields) {
    let emptyFields = [];
    if (!fields.vin)
        emptyFields.push('vin');
    if (!fields.nrTablicy)
        emptyFields.push('nrTablicy');
    if (!fields.marka)
        emptyFields.push('marka');
    if (!fields.rocznik)
        emptyFields.push('rocznik');
    if (!fields.przebieg)
        emptyFields.push('przebieg');
    if (!fields.idKlienta)
        emptyFields.push('idKlienta');
    return emptyFields.join(', ');
}
function checkClientExists(clientId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id FROM klienci WHERE id=${clientId}`;
        connect_1.default.query(sql, (error, result) => {
            if (error || result.length < 1) {
                resolve(false);
            }
            resolve(true);
        });
    });
}
exports.default = router;
