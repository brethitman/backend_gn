"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oidc_1 = require("passport-google-oidc");
passport_1.default.use(new passport_google_oidc_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    // scope por defecto ya incluye openid+email+profile
}, async (_issuer, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value ?? "";
        const name = profile.displayName ?? "";
        const photo = profile.photos?.[0]?.value;
        const user = {
            googleId: profile.id,
            email,
            name,
            ...(photo ? { photo } : {}),
        };
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
// Serialización para sesiones de passport
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.google.js.map