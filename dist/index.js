"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Konfiguracja express js
app.use(express_1.default.json());
// Basic auth
app.use((0, express_basic_auth_1.default)({
    users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD },
    unauthorizedResponse: { message: "Brak autoryzacji" }
}));
// Domyślny routing
app.get('/', (req, res) => {
    res.json({ message: 'Witaj' });
});
// Podział na poszczególny routing
const login_1 = __importDefault(require("./routes/login"));
app.use('/login', login_1.default);
const register_1 = __importDefault(require("./routes/register"));
app.use('/register', register_1.default);
const klienci_1 = __importDefault(require("./routes/klienci"));
app.use('/klienci', klienci_1.default);
const auta_1 = __importDefault(require("./routes/auta"));
app.use('/auta', auta_1.default);
const naprawy_1 = __importDefault(require("./routes/naprawy"));
app.use('/naprawy', naprawy_1.default);
// Uruchomienie serwera
const server = app.listen(3000, () => {
    console.log(`Serwer został uruchomiony na porcie 3000!`);
});
