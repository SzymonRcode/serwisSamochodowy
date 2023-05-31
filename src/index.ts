import express, {Application}  from "express";
import basicAuth  from "express-basic-auth";

import dotEnv from "dotenv";
dotEnv.config();


const app:Application = express(); 

// Konfiguracja express js
app.use(express.json());

// Basic auth
app.use(basicAuth({
  users: { [process.env.BASIC_AUTH_USER as string]: process.env.BASIC_AUTH_PASSWORD as string },
  unauthorizedResponse: { message: "Brak autoryzacji" }
}));

// Domyślny routing
app.get('/', (req, res) => {
  res.json({ message: 'Witaj' });
});

// Podział na poszczególny routing
import loginRouter from "./routes/login"
app.use('/login', loginRouter);

import registerRouter from "./routes/register"
app.use('/register', registerRouter);

import klienciRouter from "./routes/klienci"
app.use('/klienci', klienciRouter);

import autaRouter from "./routes/auta"
app.use('/auta', autaRouter);

import naprawyRouter from "./routes/naprawy"
app.use('/naprawy', naprawyRouter);

// Uruchomienie serwera
const server = app.listen(3000, () => {
  console.log(`Serwer został uruchomiony na porcie 3000!`);
});

export {app}