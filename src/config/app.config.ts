import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    APP_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    SMTP_EMAIL: string;
    SMTP_PASSWORD: string;
}

const appConfig: AppConfig = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT) ?? 5000,
    MONGO_URI: process.env.MONGO_URI ?? "",
    APP_SECRET: process.env.APP_SECRET ?? "",
    GOOGLE_ID: process.env.GOOGLE_ID ?? "",
    GOOGLE_SECRET: process.env.GOOGLE_SECRET ?? "",
    SMTP_EMAIL: process.env.SMTP_EMAIL ?? "",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? ""
};

export default appConfig;
