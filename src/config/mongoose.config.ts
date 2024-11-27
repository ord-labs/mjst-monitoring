import mongoose, { ConnectOptions } from "mongoose";
import appConfig from "./app.config";

export const connectDB = () => {
    mongoose
        .connect(appConfig.MONGO_URI, {
            useNewUrlParser: true
        } as ConnectOptions)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.log(err.message);
        });
};
