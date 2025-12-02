"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===== External =====
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
// ===== Internos =====
// ⚠️ IMPORTANTE: Tu archivo original de Google Login (de Proyecto 1)
require("./infrastructure/passport-google");
const error_middleware_1 = require("./middlewares/error.middleware");
// Rutas adicionales del Proyecto 2
const autenticacion_routes_1 = __importDefault(require("./routes/autenticacion.routes"));
const cloudinary_routes_1 = __importDefault(require("./routes/cloudinary.routes"));
const comentarios_routes_1 = __importDefault(require("./routes/comentarios.routes"));
const cursos_routes_1 = __importDefault(require("./routes/cursos.routes"));
const topicos_routes_1 = __importDefault(require("./routes/topicos.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const app = (0, express_1.default)();
// ========= C O N F I G U R A C I Ó N  G E N E R A L =========
// CORS para permitir cookies (si el front las usa)
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// 🔐 Sessions (NECESARIO PARA GOOGLE LOGIN)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// 🔐 Passport: inicialización EXACTA como tu Proyecto 1
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ========= R U T A S ==========
// 💠 Login tradicional + verificación código + Google Login
app.use("/api/v1/autenticacion", autenticacion_routes_1.default);
// 💠 Se mantienen TODAS las rutas del Proyecto 2
app.use("/api/v1/usuarios", usuarios_routes_1.default);
app.use("/api/v1/topicos", topicos_routes_1.default);
app.use("/api/v1/cursos", cursos_routes_1.default);
app.use("/api/v1/comentarios", comentarios_routes_1.default);
// Ruta de subida a Cloudinary
app.use("/api/cloudinary", cloudinary_routes_1.default);
// ========= E R R O R E S ==========
app.use(error_middleware_1.manejadorErrores);
exports.default = app;
//# sourceMappingURL=app.js.map