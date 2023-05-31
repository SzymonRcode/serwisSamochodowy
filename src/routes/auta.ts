import express  from "express";
import db from "../connect"
import {IAuta, IAutaId} from "../interfaces/IAuta";

import axios from "axios"

const router = express.Router();

// Pobieranie wszystkich aut
router.get('/', (req, res) => {
  const sql = "SELECT * FROM auta";
  db.query(sql, (error, result:IAutaId[]) => {
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: 'Brak danych w tabeli auta' });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Pobieranie konkretnego auta z parametrem ID
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM auta WHERE id= ${req.params.id}`;
  db.query(sql, (error, result:IAutaId[]) =>{
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: `Brak auta o id: ${req.params.id}` });
    }
    const rows = JSON.parse(JSON.stringify(result));
    res.json(rows);
  });
});

// Pobranie dodatkowych danych za pomocą id auta
router.get('/:id/api', (req, res) => {
  const sql = `SELECT * FROM auta WHERE id= ${req.params.id}`;
  db.query(sql, async (error, result:IAutaId[]) =>{
    if(error) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    } else if(result.length < 1) {
      return res.status(400).json({ message: `Brak auta o id: ${req.params.id}` });
    }
    const resoult = await axios.get(`https://api.api-ninjas.com/v1/cars?make=${result[0].marka}&year=${result[0].rocznik}`,{
      headers:{'X-Api-Key': '0A1HnPx1wIxQa7oRyhWAPA==UgPgnkjFrtD3khGv'}
    })
    if(resoult.status < 200 && resoult.status >= 300)
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    else if(resoult.data.length == 0)
      return res.status(400).json({ message: `Brak danych o aucie!`});
    res.json(resoult.data);
  });
});

// Dodawanie nowego auta z id klienta
router.post('/', async (req, res) => {
  const body = req.body as IAuta;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const sql = `INSERT INTO auta (vin, nrTablicy, marka, rocznik, przebieg, idKlienta)
         VALUES ("${body.vin}", "${body.nrTablicy}", "${body.marka}", 
                 "${body.rocznik}", "${body.przebieg}", "${body.idKlienta}")`;
  const client = await checkClientExists(body.idKlienta);
  if(!client) {
    return res.status(400).json({ message: `Brak klienta o id: ${body.idKlienta}` });
  }   
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: 'Wystąpił błąd!' });
    }
    res.json({ message: `Dodano nowe auto o id: ${result.insertId}` });
  });
});

// Usuwanie auta po identyfikatorze
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM auta WHERE id = ${req.params.id}`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: 'Wystąpił błąd!'});
    }
    res.json({ message: `Usunięto auto o id: ${req.params.id}` });
  });
})

// Aktualizacja auta po id
router.patch('/:id', async (req, res) =>{
  const body = req.body as IAuta;
  const emptyFields = checkRequiredFields(body);
  if(emptyFields) {
    return res.status(400).json({ message: `Uzupełnij brakujące pola: ${emptyFields}` });
  }
  const client = await checkClientExists(body.idKlienta);
  if(!client) {
    return res.status(400).json({ message: `Brak klienta o id: ${body.idKlienta}` });
  }   
  const sql = `UPDATE auta SET vin="${body.vin}", nrTablicy="${body.nrTablicy}", marka="${body.marka}", 
                                rocznik="${body.rocznik}", przebieg="${body.przebieg}", idKlienta="${body.idKlienta}" 
                                WHERE id="${req.params.id}"`;
  db.query(sql, (error, result) => {
    if(error || result.affectedRows < 1) {
      return res.status(400).json({ message: 'Wystąpił błąd!'});
    }
    res.json({ message: `Zmodyfikowano auto o id: ${req.params.id}` });
  });
});

// Funkcje
function checkRequiredFields(fields:IAuta) {
  let emptyFields = [];
  if(!fields.vin) emptyFields.push('vin');
  if(!fields.nrTablicy) emptyFields.push('nrTablicy');
  if(!fields.marka) emptyFields.push('marka');
  if(!fields.rocznik) emptyFields.push('rocznik');
  if(!fields.przebieg) emptyFields.push('przebieg');
  if(!fields.idKlienta) emptyFields.push('idKlienta');
  return emptyFields.join(', ');
}

function checkClientExists(clientId:Number) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM klienci WHERE id=${clientId}`;
    db.query(sql, (error, result) => {
      if(error || result.length < 1) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

export default router;