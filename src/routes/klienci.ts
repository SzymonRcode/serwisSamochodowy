import express  from "express";
import db from "../connect"
import {IKlienci, IKlienciId} from "../interfaces/IKlienci";
const router = express.Router();

// Pobieranie wszystkich klientów
router.get('/', (req, res) => {
  const sql = "SELECT * FROM klienci";
  db.query(sql, (error, result:IKlienciId[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: 'Brak danych w tabeli klienci' });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Pobieranie konkretnego klienta z parametrem ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM klienci WHERE id = ${req.params.id}`;
  db.query(sql, (error, result:IKlienciId[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: `Brak klienta o id: ${req.params.id}` });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Dodawanie nowego klienta
router.post('/', (req, res) => {
  const body = req.body as IKlienci;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const sql = `INSERT INTO klienci (imie, nazwisko, pesel, ulica, kodPocztowy, miasto)
         VALUES ("${body.imie}", "${body.nazwisko}", "${body.pesel}", 
                 "${body.ulica}", "${body.kodPocztowy}", "${body.miasto}")`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    }
    res.json({ message: `Dodano nowego klienta o id: ${result.insertId}` });
  });
});

// Aktualizacja danych klienta
router.patch('/:id', (req, res) => {
  const body = req.body as IKlienci;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const sql = `UPDATE klienci SET imie = "${body.imie}", nazwisko = "${body.nazwisko}", pesel = "${body.pesel}", 
               ulica = "${body.ulica}", kodPocztowy = "${body.kodPocztowy}", miasto = "${body.miasto}" 
               WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Brak klienta o id: ${req.params.id}` });
    }
    res.json({ message: `Zaktualizowano dane klienta o id: ${req.params.id}` });
  });
});

// Usuwanie klienta po identyfikatorze
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM klienci WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Brak klienta o id: ${req.params.id}` });
    }
    res.json({ message: `Usunięto klienta o id: ${req.params.id}` });
  });
})

// Funkcje
function checkRequiredFields(fields:IKlienci) {
  let emptyFields = [];
  if(!fields.imie) emptyFields.push('imie');
  if(!fields.nazwisko) emptyFields.push('nazwisko');
  if(!fields.pesel) emptyFields.push('pesel');
  if(!fields.ulica) emptyFields.push('ulica');
  if(!fields.kodPocztowy) emptyFields.push('kodPocztowy');
  if(!fields.miasto) emptyFields.push('miasto');
  return emptyFields.join(', ');
}

export default router;