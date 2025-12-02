import { Router, Request, Response, NextFunction } from "express";

import passport from "../config/passport.google";
import { callbackGoogle } from "../controllers/google.controller";

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  photo?: string;
}
interface GoogleRequest extends Request {
  user?: GoogleUser;
}

const router = Router();

// Paso 1: iniciar login (permite ?raw=1 para ver el perfil en JSON)
router.get("/google", (req, res, next) => {
  const wantRaw = req.query.raw === "1";
  passport.authenticate("google", {
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
router.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: true }, // OIDC requiere sesión
      (err: Error | null, user: GoogleUser | false | undefined): void => {
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

        (req as GoogleRequest).user = user;

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
        callbackGoogle(req as GoogleRequest, res);
      }
    )(req, res, next);
  }
);

export default router;
