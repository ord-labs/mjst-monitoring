import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorHandler";
import routes from "./components";
import ApiResponse from "./interfaces/ApiResponse";
import { connectDB } from "./config/mongoose.config";
import bodyParser from "body-parser";
import passport from "passport";
import jwtPassportMiddleware from "./config/passport.jwt.config";
import { googleOAuth, googleOAuthDeveloper } from "./config/passport.google.config";

const app = express();
app.use(bodyParser.json());

// Connect to Mongo DB Atlas
connectDB();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

//Passport
app.use(passport.initialize());
passport.use(jwtPassportMiddleware);
passport.use("google", googleOAuth);
passport.use("google-seller", googleOAuthDeveloper);

app.get<ApiResponse>("/", (req, res) => {
    res.json({
        message: "Dwellu Backend"
    });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
