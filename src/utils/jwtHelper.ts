import jwt from "jsonwebtoken";
import appConfig from "../config/app.config";

export const generateToken = (data: object) => {
    return jwt.sign(data, appConfig.APP_SECRET, { expiresIn: "30d" });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, appConfig.APP_SECRET);
};
