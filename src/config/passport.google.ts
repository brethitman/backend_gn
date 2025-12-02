import passport from "passport";
import type { Profile } from "passport";
import { Strategy as GoogleOIDCStrategy } from "passport-google-oidc";

type Done = (err: Error | null, user?: Express.User | false) => void;

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  photo?: string;
}

passport.use(
  new GoogleOIDCStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      // scope por defecto ya incluye openid+email+profile
    },
    async (_issuer: string, profile: Profile, done: Done) => {
      try {
        const email = profile.emails?.[0]?.value ?? "";
        const name = profile.displayName ?? "";
        const photo = profile.photos?.[0]?.value;

        const user: GoogleUser = {
          googleId: profile.id,
          email,
          name,
          ...(photo ? { photo } : {}),
        };

        return done(null, user as unknown as Express.User);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Serialización para sesiones de passport
passport.serializeUser((user: Express.User, done: (err: Error | null, id?: unknown) => void) => {
  done(null, user);
});

passport.deserializeUser(
  (obj: unknown, done: (err: Error | null, user?: Express.User) => void) => {
    done(null, obj as Express.User);
  }
);

export default passport;
