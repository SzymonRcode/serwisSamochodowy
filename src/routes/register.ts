import express  from "express";
import db from "../connect"
import {IUser} from "../interfaces/IUser";
import bcrypt from "bcrypt"
const router = express.Router();

// Dodawanie nowego użytkownika
router.post('/', async (req, res) => {
  const body = req.body as IUser;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const pass = await bcrypt.hash(body.haslo, 10);
  const sql = `INSERT INTO uzytkownicy (login, haslo, imie, nazwisko)
         VALUES ("${body.login}", "${pass}", "${body.imie}", "${body.nazwisko}")`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Użytkownik '${body.login}' już istnieje!` });
    }
    res.json({ message: `Dodano nowego użytkownika o id: ${result.insertId}` });
  });
});

// Aktualizacja danych użytkownika
router.patch('/:login', async (req, res) => {
  const body = req.body as IUser;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const pass = await bcrypt.hash(body.haslo, 10);
  const sql = `UPDATE uzytkownicy SET haslo = "${pass}", imie = "${body.imie}", nazwisko = "${body.nazwisko}" 
                                WHERE login = "${req.params.login}"`;
  console.log(sql);
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Użytkownik '${req.params.login}' nie istnieje!` });
    }
    res.json({ message: `Zmodyfikowano dane użytkownika o nazwie: ${req.params.login}` });
  });
});

// Usuwanie użytkownika
router.delete('/:login', (req, res) => {
  const sql = `DELETE FROM uzytkownicy WHERE login = "${req.params.login}"`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Użytkownik '${req.params.login}' nie istnieje!` });
    }
    res.json({ message: `Usunięto użytkownika o nazwie: ${req.params.login}` });
  });
});


// Funkcje
function checkRequiredFields(fields:IUser) {
  let emptyFields = [];
  if(!fields.login) emptyFields.push('login');
  if(!fields.haslo) emptyFields.push('haslo');
  if(!fields.imie) emptyFields.push('imie');
  if(!fields.nazwisko) emptyFields.push('nazwisko');
  return emptyFields.join(', ');
}

export default router;
