//C:\Users\Ffcg\Videos\copi_google\GENERACION_DE_SOFTWARE\BACKEND_GS\src\types\passport-google-oidc.d.ts
declare module "passport-google-oidc" {
  import type { Profile } from "passport";
  import { Strategy as PassportStrategy } from "passport-strategy";

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
    authorizationURL?: string;
    tokenURL?: string;
    userInfoURL?: string;
  }

  export type VerifyCallback = (err: unknown, user?: unknown) => void;

  export type VerifyFunction = (
    issuer: string,
    profile: Profile,
    done: VerifyCallback
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    name: "google";
  }

  export { Strategy as GoogleOIDCStrategy };
}
