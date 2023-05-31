import express  from "express";
import db from "../connect"
import {IUserLogin, IUserID} from "../interfaces/IUser";
import bcrypt from "bcrypt"
const router = express.Router();

// Pobieranie wszystkich użytkowników
router.get('/', (req, res) => {
  const sql = "SELECT id, login FROM uzytkownicy";
  db.query(sql, (error, result:IUserID[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: 'Brak użytkowników w bazie danych!' });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});
// Logowanie
router.post('/', (req, res) => {
  const body = req.body as IUserLogin;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const sql = `SELECT * FROM uzytkownicy WHERE login = "${body.login}"`;
  db.query(sql, async (error, result) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: `Brak użytkownika '${body.login}' w bazie!` });
    }
    const rows = JSON.parse(JSON.stringify(result));
    if(!await bcrypt.compare(body.haslo, rows[0].haslo)) {
      return res.status(400).json({ message: 'Błędne hasło!' });
    }
    res.json({ message: `Zalogowano jako: ${body.login}` });
  });
});



// Funkcje
function checkRequiredFields(fields:IUserLogin) {
  let emptyFields = [];
  if(!fields.login) emptyFields.push('login');
  if(!fields.haslo) emptyFields.push('haslo');
  return emptyFields.join(', ');
}



export default router;