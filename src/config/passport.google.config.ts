import { Strategy, VerifyCallback } from "passport-google-oauth20";
import appConfig from "./app.config";

export const googleOAuth = new Strategy(
    {
        clientID: appConfig.GOOGLE_ID ?? "",
        clientSecret: appConfig.GOOGLE_SECRET ?? "",
        callbackURL:
            appConfig.NODE_ENV === "production"
                ? "https://api.dwellu.io/api/auth/google/callback"
                : "http://localhost:5000/api/auth/google/callback"
    },
    (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        return done(null, profile);
    }
);

export const googleOAuthDeveloper = new Strategy(
    {
        clientID: appConfig.GOOGLE_ID ?? "",
        clientSecret: appConfig.GOOGLE_SECRET ?? "",
        callbackURL:
            appConfig.NODE_ENV === "production"
                ? "https://api.dwellu.io/api/auth/seller/google/callback"
                : "http://localhost:5000/api/auth/seller/google/callback"
    },
    (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        return done(null, profile);
    }
);
