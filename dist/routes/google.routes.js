"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_google_1 = __importDefault(require("../config/passport.google"));
const google_controller_1 = require("../controllers/google.controller");
const router = (0, express_1.Router)();
// Paso 1: iniciar login (permite ?raw=1 para ver el perfil en JSON)
router.get("/google", (req, res, next) => {
    const wantRaw = req.query.raw === "1";
    passport_google_1.default.authenticate("google", {
        scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
        state: wantRaw ? "raw" : undefined,
    })(req, res, next);
});
// Paso 2: callback
router.get("/google/callback", (req, res, next) => {
    passport_google_1.default.authenticate("google", { session: true }, // OIDC requiere sesión
    (err, user) => {
        if (err) {
            console.error("[GoogleAuth Error]", err);
            res.status(500).send("Error en autenticación con Google");
            return;
        }
        if (!user) {
            // Evita "Cannot GET /login"
            const front = new URL("http://localhost:5173/");
            front.searchParams.set("error", "google_auth_failed");
            res.redirect(front.toString());
            return;
        }
        req.user = user;
        // Si venías con ?raw=1, devolvemos el perfil "bonito"
        if (req.query.state === "raw") {
            const profileJson = {
                id: user.googleId,
                displayName: user.name,
                emails: [{ value: user.email, verified: true }],
                photos: user.photo ? [{ value: user.photo }] : [],
                provider: "google",
            };
            res.json(profileJson);
            return;
        }
        // Flujo normal: firma JWT y redirige al front
        (0, google_controller_1.callbackGoogle)(req, res);
    })(req, res, next);
});
exports.default = router;
//# sourceMappingURL=google.routes.js.map