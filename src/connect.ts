import mysql from 'mysql';
import dotEnv from "dotenv";
dotEnv.config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log(`Połączono z bazą MYSQL!`);
});


export default db