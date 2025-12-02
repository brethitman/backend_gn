// ===== External =====
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";

// ===== Internos =====



// ⚠️ IMPORTANTE: Tu archivo original de Google Login (de Proyecto 1)
import "./infrastructure/passport-google";
import { manejadorErrores } from "./middlewares/error.middleware";
// Rutas adicionales del Proyecto 2
import rutasAutenticacion from "./routes/autenticacion.routes";
import cloudinaryRoutes from "./routes/cloudinary.routes";
import comentariosRoutes from "./routes/comentarios.routes";
import cursosRoutes from "./routes/cursos.routes";
import topicosRoutes from "./routes/topicos.routes";
import usuariosRoutes from "./routes/usuarios.routes";
const app = express();

// ========= C O N F I G U R A C I Ó N  G E N E R A L =========

// CORS para permitir cookies (si el front las usa)
app.use(cors({ 
  origin: ["http://localhost:5173"], 
  credentials: true 
}));

app.use(express.json());
app.use(morgan("dev"));

// 🔐 Sessions (NECESARIO PARA GOOGLE LOGIN)
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

// 🔐 Passport: inicialización EXACTA como tu Proyecto 1
app.use(passport.initialize());
app.use(passport.session());

// ========= R U T A S ==========

// 💠 Login tradicional + verificación código + Google Login
app.use("/api/v1/autenticacion", rutasAutenticacion);

// 💠 Se mantienen TODAS las rutas del Proyecto 2
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/topicos", topicosRoutes);
app.use("/api/v1/cursos", cursosRoutes);
app.use("/api/v1/comentarios", comentariosRoutes);

// Ruta de subida a Cloudinary
app.use("/api/cloudinary", cloudinaryRoutes);

// ========= E R R O R E S ==========
app.use(manejadorErrores);

export default app;
