import express  from "express";
import db from "../connect"
import {INaprawy, INaprawyId} from "../interfaces/INaprawy";
const router = express.Router();

// Pobieranie wszystkich napraw
router.get('/', (req, res) => {
  const sql = "SELECT * FROM naprawy";
  db.query(sql, (error, result:INaprawyId[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: 'Brak danych w tabeli naprawy' });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Pobieranie konkretnej naprawy
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM naprawy WHERE id = ${req.params.id}`;
  db.query(sql, (error, result:INaprawyId[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Dodawanie nowej naprawy
router.post('/', async (req, res) => {

  const body = req.body as INaprawy;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const sql = `INSERT INTO naprawy (nazwa, cena, status, idAuta)
         VALUES ("${body.nazwa}", ${body.cena}, "${body.status}", "${body.idAuta}")`;
  const car = await checkCarExists(body.idAuta);
  if(!car) {
    return res.status(400).json({ message: `Brak auta o id: ${body.idAuta}` });
  }   
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    }
    res.json({ message: `Dodano nową naprawę o id: ${result.insertId}` });
  });
});

// Aktualizacja danych naprawy
router.patch('/:id', async (req, res) => {
  const body = req.body as INaprawy;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const car = await checkCarExists(body.idAuta);
  if(!car) {
    return res.status(400).json({ message: `Brak auta o id: ${body.idAuta}` });
  }   
  const sql = `UPDATE naprawy SET nazwa="${body.nazwa}", cena="${body.cena}",
                                status="${body.status}", idAuta="${body.idAuta}" 
                                WHERE id="${req.params.id}"`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
    }
    res.json({ message: `Zmodyfikowano naprawę o id: ${req.params.id}` });
  });
});

// Usuwanie naprawy
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM naprawy WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: `Brak naprawy o id: ${req.params.id}` });
    }
    res.json({ message: `Usunięto naprawę o id: ${req.params.id}` });
  });
});


// Funkcje
function checkRequiredFields(fields:INaprawy) {
  let emptyFields = [];
  if(!fields.nazwa) emptyFields.push('nazwa');
  if(!fields.cena) emptyFields.push('cena');
  if(!fields.status) emptyFields.push('status');
  if(!fields.idAuta) emptyFields.push('idAuta');
  return emptyFields.join(', ');
}

function checkCarExists(carId:number) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM auta WHERE id=${carId}`;
    db.query(sql, (error, result) => {
      if(error || result.length < 1) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

export default router;